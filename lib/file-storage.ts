import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const uploadsDir = path.join(process.cwd(), "public", "uploads");
const generatedDir = path.join(process.cwd(), "public", "generated");

export async function ensurePublicImageDirs() {
  // Create local directories once so API writes are always safe.
  await Promise.all([
    mkdir(uploadsDir, { recursive: true }),
    mkdir(generatedDir, { recursive: true }),
  ]);
}

export async function saveUploadedOriginal(buffer: Buffer, extension: string): Promise<string> {
  await ensurePublicImageDirs();
  const fileName = `upload-${Date.now()}.${extension}`;
  const absPath = path.join(uploadsDir, fileName);
  await writeFile(absPath, buffer);
  return `/uploads/${fileName}`;
}

export async function saveGeneratedImage(buffer: Buffer, extension: string): Promise<string> {
  await ensurePublicImageDirs();
  const fileName = `generated-${Date.now()}.${extension}`;
  const absPath = path.join(generatedDir, fileName);
  await writeFile(absPath, buffer);
  return `/generated/${fileName}`;
}

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
