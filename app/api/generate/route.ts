import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// Allow up to 60s for Gemini image generation on Vercel
export const maxDuration = 60;
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

export async function POST(request: NextRequest) {
  const generationStartTime = Date.now();

  try {
    const formData = await request.formData();
    const furnitureFile = formData.get("furnitureFile") as File | null;
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

    if (!selectedFabricId) {
      return NextResponse.json(
        {
          success: false,
          error: "Please choose one of the preset fabric swatches.",
        },
        { status: 400 },
      );
    }

    // --- Crop user image to 2:3 and convert to base64 ----------------------

    const userImageBuffer = Buffer.from(await furnitureFile.arrayBuffer());
    const { buffer: croppedBuffer, mimeType: croppedMimeType } =
      await cropTo2x3(userImageBuffer, furnitureFile.type);

    const userImageBase64 = croppedBuffer.toString("base64");
    const userImageMimeType = croppedMimeType;

    // --- Resolve selected fabric swatch -----------------------------------

    const selectedFabric = selectedFabricId
      ? (getFabricById(selectedFabricId) ?? null)
      : null;

    if (!selectedFabric) {
      return NextResponse.json(
        { success: false, error: "Selected swatch was not found." },
        { status: 400 },
      );
    }

    const localSwatch = await readPublicFileAsBase64(selectedFabric.swatchPath);
    const referenceImageBase64 = localSwatch.base64;
    const referenceImageMimeType = localSwatch.mimeType;

    // --- Build the prompt --------------------------------------------------

    const fabricName = selectedFabric.name;
    const fabricHex = selectedFabric.hex;
    const fabricHint = selectedFabric.promptHint;

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

    // --- Build the content array (text + user image + swatch ref) -----------

    const content: Array<
      | { type: "text"; text: string }
      | { type: "image"; image: string; mimeType: string }
    > = [
      {
        type: "text",
        text:
          prompt +
          "\n\nUse the second image as the exact style / texture reference for the new upholstery fabric.",
      },
      {
        type: "image",
        image: userImageBase64,
        mimeType: userImageMimeType,
      },
      {
        type: "image",
        image: referenceImageBase64,
        mimeType: referenceImageMimeType,
      },
    ];

    // --- Run Gemini call and original upload in parallel --------------------

    const ext = extensionFromMimeType(croppedMimeType);

    const [originalImageUrl, result] = await Promise.all([
      saveUploadedOriginal(croppedBuffer, ext),
      generateText({
        model: google("gemini-3-pro-image-preview"),
        messages: [{ role: "user", content }],
        providerOptions: {
          google: {
            responseModalities: ["IMAGE"],
            imageConfig: {
              aspectRatio: "2:3",
              imageSize: "1K",
            },
          },
        },
      }),
    ]);

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

    // Upload generated image to Supabase (sequential — needs Gemini result).
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
