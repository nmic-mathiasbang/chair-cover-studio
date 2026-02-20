import { put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const uploadsDir = path.join(process.cwd(), "public", "uploads");
const generatedDir = path.join(process.cwd(), "public", "generated");

/** Check at runtime — env can be missing at build time on Vercel. */
function shouldUseBlob(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

/** On Vercel the filesystem is read-only; never attempt local writes. */
function isVercel(): boolean {
  return process.env.VERCEL === "1";
}

async function ensureLocalDirs() {
  await Promise.all([
    mkdir(uploadsDir, { recursive: true }),
    mkdir(generatedDir, { recursive: true }),
  ]);
}

/**
 * Save uploaded original (cropped 2:3). Uses Vercel Blob when BLOB_READ_WRITE_TOKEN
 * is set, otherwise falls back to local public/ folder (local dev only).
 */
export async function saveUploadedOriginal(
  buffer: Buffer,
  extension: string,
): Promise<string> {
  const fileName = `upload-${Date.now()}.${extension}`;
  const contentType = extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";

  if (shouldUseBlob()) {
    const blob = await put(`uploads/${fileName}`, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: true,
    });
    return blob.url;
  }

  if (isVercel()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is required on Vercel. Add it in Project Settings → Environment Variables.",
    );
  }

  await ensureLocalDirs();
  const absPath = path.join(uploadsDir, fileName);
  await writeFile(absPath, buffer);
  return `/uploads/${fileName}`;
}

/**
 * Save generated image. Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set,
 * otherwise falls back to local public/ folder (local dev only).
 */
export async function saveGeneratedImage(
  buffer: Buffer,
  extension: string,
): Promise<string> {
  const fileName = `generated-${Date.now()}.${extension}`;
  const contentType = extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";

  if (shouldUseBlob()) {
    const blob = await put(`generated/${fileName}`, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: true,
    });
    return blob.url;
  }

  if (isVercel()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is required on Vercel. Add it in Project Settings → Environment Variables.",
    );
  }

  await ensureLocalDirs();
  const absPath = path.join(generatedDir, fileName);
  await writeFile(absPath, buffer);
  return `/generated/${fileName}`;
}

/**
 * Read a file as base64. Used for preset swatches in public/swatches (local only).
 * For Blob URLs we fetch and convert.
 */
export async function readPublicFileAsBase64(publicPath: string): Promise<{
  base64: string;
  mimeType: string;
}> {
  // Swatch paths are always local (public/swatches/*).
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
