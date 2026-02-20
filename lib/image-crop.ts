import sharp from "sharp";

const TARGET_ASPECT = 2 / 3; // width / height

/**
 * Center-crops an image buffer to 2:3 aspect ratio.
 * Returns the cropped buffer as JPEG for consistent output.
 */
export async function cropTo2x3(buffer: Buffer, mimeType: string): Promise<{
  buffer: Buffer;
  mimeType: string;
}> {
  // First pass: apply EXIF rotation so the pixel data matches what the user sees.
  // We must materialise the rotated buffer before reading metadata, because
  // .metadata() returns pre-rotation dimensions on the original input.
  const rotatedBuffer = await sharp(buffer).rotate().toBuffer();

  const { width, height } = await sharp(rotatedBuffer).metadata();

  if (!width || !height) {
    throw new Error("Could not read image dimensions.");
  }

  const sourceAspect = width / height;
  let extractLeft = 0;
  let extractTop = 0;
  let extractWidth = width;
  let extractHeight = height;

  // Target is 2:3 (portrait). Crop to fit.
  if (sourceAspect > TARGET_ASPECT) {
    // Source is wider — crop sides, keep full height.
    extractWidth = Math.round(height * TARGET_ASPECT);
    extractLeft = Math.round((width - extractWidth) / 2);
  } else {
    // Source is taller — crop top/bottom, keep full width.
    extractHeight = Math.round(width / TARGET_ASPECT);
    extractTop = Math.round((height - extractHeight) / 2);
  }

  const cropped = await sharp(rotatedBuffer)
    .extract({
      left: Math.max(0, extractLeft),
      top: Math.max(0, extractTop),
      width: extractWidth,
      height: extractHeight,
    })
    .jpeg({ quality: 90 })
    .toBuffer();

  return { buffer: cropped, mimeType: "image/jpeg" };
}
