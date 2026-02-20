import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { getFabricById } from "../../../lib/fabrics";
import { cropTo2x3 } from "../../../lib/image-crop";
import {
  extensionFromMimeType,
  readPublicFileAsBase64,
  saveGeneratedImage,
  saveUploadedOriginal,
} from "../../../lib/file-storage";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxMainImageSize = 10 * 1024 * 1024;
const maxReferenceImageSize = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const generationStartTime = Date.now();

  try {
    const formData = await request.formData();
    const furnitureFile = formData.get("furnitureFile") as File | null;
    const referenceFile = formData.get("referenceFile") as File | null;
    const selectedFabricId =
      (formData.get("selectedFabricId") as string | null) ?? "";

    // --- Validation --------------------------------------------------------

    if (!furnitureFile) {
      return NextResponse.json(
        { success: false, error: "Please upload a furniture photo first." },
        { status: 400 },
      );
    }

    if (!allowedTypes.includes(furnitureFile.type)) {
      return NextResponse.json(
        { success: false, error: "Main image must be JPEG, PNG, or WebP." },
        { status: 400 },
      );
    }

    if (furnitureFile.size > maxMainImageSize) {
      return NextResponse.json(
        { success: false, error: "Main image must be 10 MB or less." },
        { status: 400 },
      );
    }

    if (!selectedFabricId && !referenceFile) {
      return NextResponse.json(
        {
          success: false,
          error: "Pick a fabric swatch or upload a reference fabric image.",
        },
        { status: 400 },
      );
    }

    if (referenceFile) {
      if (!allowedTypes.includes(referenceFile.type)) {
        return NextResponse.json(
          {
            success: false,
            error: "Reference image must be JPEG, PNG, or WebP.",
          },
          { status: 400 },
        );
      }
      if (referenceFile.size > maxReferenceImageSize) {
        return NextResponse.json(
          { success: false, error: "Reference image must be 5 MB or less." },
          { status: 400 },
        );
      }
    }

    // --- Crop user image to 2:3 and convert to base64 ----------------------

    const userImageBuffer = Buffer.from(await furnitureFile.arrayBuffer());
    const { buffer: croppedBuffer, mimeType: croppedMimeType } =
      await cropTo2x3(userImageBuffer, furnitureFile.type);

    const userImageBase64 = croppedBuffer.toString("base64");
    const userImageMimeType = croppedMimeType;

    // Persist the cropped original (2:3) for before/after comparison.
    const originalImageUrl = await saveUploadedOriginal(
      croppedBuffer,
      extensionFromMimeType(croppedMimeType),
    );

    // --- Resolve fabric info & reference image -----------------------------

    const selectedFabric = selectedFabricId
      ? (getFabricById(selectedFabricId) ?? null)
      : null;

    let referenceImageBase64: string | null = null;
    let referenceImageMimeType = "image/jpeg";

    if (referenceFile) {
      const refBuffer = Buffer.from(await referenceFile.arrayBuffer());
      referenceImageBase64 = refBuffer.toString("base64");
      referenceImageMimeType = referenceFile.type;
    } else if (selectedFabric) {
      const localSwatch = await readPublicFileAsBase64(
        selectedFabric.swatchPath,
      );
      referenceImageBase64 = localSwatch.base64;
      referenceImageMimeType = localSwatch.mimeType;
    }

    // --- Build the prompt --------------------------------------------------

    const fabricName = selectedFabric?.name ?? "custom uploaded fabric";
    const fabricHex = selectedFabric?.hex ?? "";
    const fabricHint =
      selectedFabric?.promptHint ?? "realistic furniture upholstery material";

    const prompt = `You are an expert furniture upholstery visualizer. Transform the provided furniture photo to show how it would look re-upholstered in the fabric "${fabricName}" (approximate color ${fabricHex}).

Key requirements:
- Keep the exact same room layout, dimensions, and perspective as the original photo
- Replace ONLY the upholstery / cover material on the chair or sofa
- Do NOT change the furniture shape, legs, frame, stitching lines, or structure
- Texture guidance: ${fabricHint}
- Maintain realistic lighting and shadows based on the original photo
- Keep floors, walls, ceiling, and all non-furniture objects unchanged
- The result should look like a professional interior-design visualization
- Make it photorealistic

Generate the transformed furniture image.`;

    // --- Build the content array (text + user image + optional ref) ---------

    const content: Array<
      | { type: "text"; text: string }
      | { type: "image"; image: string; mimeType: string }
    > = [
      { type: "text", text: prompt },
      {
        type: "image",
        image: userImageBase64,
        mimeType: userImageMimeType,
      },
    ];

    // Append reference image and extend the prompt when available.
    if (referenceImageBase64) {
      content.push({
        type: "image",
        image: referenceImageBase64,
        mimeType: referenceImageMimeType,
      });
      content[0] = {
        type: "text",
        text:
          prompt +
          "\n\nUse the second image as the style / texture reference for the new upholstery fabric.",
      };
    }

    // --- Call Gemini image generation ---------------------------------------

    const result = await generateText({
      model: google("gemini-3-pro-image-preview"),
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
      providerOptions: {
        google: {
          responseModalities: ["IMAGE"],
          imageConfig: {
            aspectRatio: "2:3",
            imageSize: "2K",
          },
        },
      },
    });

    // --- Extract generated image from the response --------------------------

    let generatedImageBase64: string | null = null;
    let generatedImageMimeType = "image/png";

    if (result.files && result.files.length > 0) {
      for (const file of result.files) {
        if (file.mediaType.startsWith("image/")) {
          generatedImageBase64 = file.base64;
          generatedImageMimeType = file.mediaType;
          break;
        }
      }
    }

    if (!generatedImageBase64) {
      return NextResponse.json(
        { success: false, error: "No image was returned by the AI model." },
        { status: 500 },
      );
    }

    // Persist the generated image locally.
    const generatedBuffer = Buffer.from(generatedImageBase64, "base64");
    const generatedImageUrl = await saveGeneratedImage(
      generatedBuffer,
      extensionFromMimeType(generatedImageMimeType),
    );

    const generationTimeMs = Date.now() - generationStartTime;

    return NextResponse.json({
      success: true,
      generatedImageUrl,
      originalImageUrl,
      generationTimeMs,
    });
  } catch (error) {
    console.error("Generation error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected generation error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
