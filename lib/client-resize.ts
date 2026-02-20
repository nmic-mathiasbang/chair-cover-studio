/**
 * Resize an image file client-side so it stays under Vercel's 4.5 MB body limit.
 * Uses an off-screen canvas to re-encode as JPEG at reduced dimensions.
 */

const MAX_DIMENSION = 1536;
const JPEG_QUALITY = 0.85;

export async function resizeImageFile(file: File): Promise<File> {
  // Small files don't need resizing
  if (file.size <= 3 * 1024 * 1024) return file;

  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  // Calculate scaled dimensions (cap longest side at MAX_DIMENSION)
  let newWidth = width;
  let newHeight = height;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    newWidth = Math.round(width * scale);
    newHeight = Math.round(height * scale);
  }

  const canvas = new OffscreenCanvas(newWidth, newHeight);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);
  bitmap.close();

  const blob = await canvas.convertToBlob({
    type: "image/jpeg",
    quality: JPEG_QUALITY,
  });

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
  });
}
