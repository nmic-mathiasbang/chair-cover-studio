import { getSupabase } from "./supabase";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const uploadsDir = path.join(process.cwd(), "public", "uploads");
const generatedDir = path.join(process.cwd(), "public", "generated");

/** Runtime check: use Supabase when URL + key are set. */
function shouldUseSupabase(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function ensureLocalDirs() {
  await Promise.all([
    mkdir(uploadsDir, { recursive: true }),
    mkdir(generatedDir, { recursive: true }),
  ]);
}

/**
 * Upload a buffer to a Supabase Storage bucket and return the public URL.
 */
async function uploadToSupabase(
  bucket: string,
  fileName: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const client = getSupabase();

  const { error } = await client.storage
    .from(bucket)
    .upload(fileName, buffer, { contentType, upsert: false });

  if (error) {
    throw new Error(`Supabase upload failed (${bucket}/${fileName}): ${error.message}`);
  }

  // Public bucket — get the permanent public URL
  const { data } = client.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Save uploaded original (cropped 2:3). Uses Supabase Storage when configured,
 * otherwise falls back to local public/ folder (local dev only).
 */
export async function saveUploadedOriginal(
  buffer: Buffer,
  extension: string,
): Promise<string> {
  const fileName = `upload-${Date.now()}.${extension}`;
  const contentType =
    extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";

  if (shouldUseSupabase()) {
    return uploadToSupabase("uploads", fileName, buffer, contentType);
  }

  // Local dev fallback
  await ensureLocalDirs();
  const absPath = path.join(uploadsDir, fileName);
  await writeFile(absPath, buffer);
  return `/uploads/${fileName}`;
}

/**
 * Save generated image. Uses Supabase Storage when configured,
 * otherwise falls back to local public/ folder (local dev only).
 */
export async function saveGeneratedImage(
  buffer: Buffer,
  extension: string,
): Promise<string> {
  const fileName = `generated-${Date.now()}.${extension}`;
  const contentType =
    extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";

  if (shouldUseSupabase()) {
    return uploadToSupabase("generated", fileName, buffer, contentType);
  }

  // Local dev fallback
  await ensureLocalDirs();
  const absPath = path.join(generatedDir, fileName);
  await writeFile(absPath, buffer);
  return `/generated/${fileName}`;
}

/**
 * Read a file as base64. Used for preset swatches in public/swatches.
 */
export async function readPublicFileAsBase64(publicPath: string): Promise<{
  base64: string;
  mimeType: string;
}> {
  const normalizedPath = publicPath.replace(/^\//, "");
  const absolutePath = path.join(process.cwd(), "public", normalizedPath);
  const fileBuffer = await readFile(absolutePath);
  const base64 = fileBuffer.toString("base64");
  const mimeType = getMimeTypeFromPath(publicPath);
  return { base64, mimeType };
}

export function extensionFromMimeType(mimeType: string): string {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

function getMimeTypeFromPath(filePath: string): string {
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  return "image/jpeg";
}
