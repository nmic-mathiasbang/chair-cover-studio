import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { getFabricById } from "../../../lib/fabrics";
import {
  extensionFromMimeType,
  readPublicFileAsBase64,
  saveGeneratedImage,
} from "../../../lib/file-storage";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const t0 = Date.now();

  try {
    const body = await request.json();
    const { originalImageUrl, selectedFabricId } = body ?? {};
    const parseMs = Date.now() - t0;

    // --- Validation --------------------------------------------------------

    if (!originalImageUrl || typeof originalImageUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing originalImageUrl." },
        { status: 400 },
      );
    }

    if (!selectedFabricId || typeof selectedFabricId !== "string") {
      return NextResponse.json(
        { success: false, error: "Please choose a fabric swatch." },
        { status: 400 },
      );
    }

    const selectedFabric = getFabricById(selectedFabricId) ?? null;
    if (!selectedFabric) {
      return NextResponse.json(
        { success: false, error: "Selected swatch was not found." },
        { status: 400 },
      );
    }

    // --- Fetch the already-uploaded original image -------------------------

    const tFetch = Date.now();
    const imgRes = await fetch(originalImageUrl);
    if (!imgRes.ok) {
      return NextResponse.json(
        { success: false, error: "Could not fetch original image." },
        { status: 502 },
      );
    }
    const imgBuffer = await imgRes.arrayBuffer();
    const userImageBase64 = Buffer.from(imgBuffer).toString("base64");
    const userImageMimeType =
      imgRes.headers.get("content-type") || "image/jpeg";
    const fetchOriginalMs = Date.now() - tFetch;

    // --- Read swatch reference image ---------------------------------------

    const tRef = Date.now();
    const localSwatch = await readPublicFileAsBase64(selectedFabric.swatchPath);
    const referenceImageBase64 = localSwatch.base64;
    const referenceImageMimeType = localSwatch.mimeType;
    const referenceReadMs = Date.now() - tRef;

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

Generate the transformed furniture image.

Use the second image as the exact style / texture reference for the new upholstery fabric.`;

    const content: Array<
      | { type: "text"; text: string }
      | { type: "image"; image: string; mimeType: string }
    > = [
      { type: "text", text: prompt },
      { type: "image", image: userImageBase64, mimeType: userImageMimeType },
      {
        type: "image",
        image: referenceImageBase64,
        mimeType: referenceImageMimeType,
      },
    ];

    // --- Call Gemini --------------------------------------------------------

    const tGemini = Date.now();
    const result = await generateText({
      model: google("gemini-3-pro-image-preview"),
      messages: [{ role: "user", content }],
      providerOptions: {
        google: {
          responseModalities: ["IMAGE"],
          imageConfig: { aspectRatio: "2:3", imageSize: "1K" },
        },
      },
    });
    const geminiMs = Date.now() - tGemini;

    // --- Extract generated image -------------------------------------------

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

    // --- Upload generated image to Supabase --------------------------------

    const tUpload = Date.now();
    const generatedBuffer = Buffer.from(generatedImageBase64, "base64");
    const generatedImageUrl = await saveGeneratedImage(
      generatedBuffer,
      extensionFromMimeType(generatedImageMimeType),
    );
    const generatedUploadMs = Date.now() - tUpload;

    const totalMs = Date.now() - t0;

    console.log({
      route: "/api/generate",
      parseMs,
      fetchOriginalMs,
      referenceReadMs,
      geminiMs,
      generatedUploadMs,
      totalMs,
    });

    return NextResponse.json({
      success: true,
      generatedImageUrl,
      originalImageUrl,
      generationTimeMs: totalMs,
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
