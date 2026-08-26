import "server-only";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "image/gif"];
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB

export class UploadValidationError extends Error {}

/**
 * Local-disk storage adapter for /public/uploads. Swap this module's
 * implementation for an S3/R2-backed one in production — every caller only
 * depends on `saveUploadedFile`'s return shape, not the disk layout.
 */
export async function saveUploadedFile(file: File): Promise<{
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new UploadValidationError(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadValidationError("File exceeds the 8MB upload limit.");
  }

  const ext = path.extname(file.name).toLowerCase() || guessExtension(file.type);
  const safeName = `${crypto.randomUUID()}${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, safeName), buffer);

  return {
    url: `/uploads/${safeName}`,
    filename: file.name,
    mimeType: file.type,
    size: file.size,
  };
}

function guessExtension(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/avif":
      return ".avif";
    case "image/svg+xml":
      return ".svg";
    case "image/gif":
      return ".gif";
    default:
      return "";
  }
}
