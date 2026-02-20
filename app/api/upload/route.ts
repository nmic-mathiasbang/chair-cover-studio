import { NextRequest, NextResponse } from "next/server";
import { cropTo2x3 } from "../../../lib/image-crop";
import {
  extensionFromMimeType,
  saveUploadedOriginal,
} from "../../../lib/file-storage";

export const maxDuration = 15;

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const t0 = Date.now();

  try {
    const formData = await request.formData();
    const furnitureFile = formData.get("furnitureFile") as File | null;
    const parseMs = Date.now() - t0;

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

    if (furnitureFile.size > maxFileSize) {
      return NextResponse.json(
        { success: false, error: "Main image must be 10 MB or less." },
        { status: 400 },
      );
    }

    // EXIF rotate + crop to 2:3 + downscale to 1024px
    const tCrop = Date.now();
    const userImageBuffer = Buffer.from(await furnitureFile.arrayBuffer());
    const { buffer: croppedBuffer, mimeType: croppedMimeType } =
      await cropTo2x3(userImageBuffer, furnitureFile.type);
    const cropMs = Date.now() - tCrop;

    // Upload cropped original to Supabase
    const tUpload = Date.now();
    const ext = extensionFromMimeType(croppedMimeType);
    const originalImageUrl = await saveUploadedOriginal(croppedBuffer, ext);
    const uploadMs = Date.now() - tUpload;

    const totalMs = Date.now() - t0;
    console.log({
      route: "/api/upload",
      parseMs,
      cropMs,
      uploadMs,
      totalMs,
    });

    return NextResponse.json({ success: true, originalImageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected upload error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
