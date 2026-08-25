import "server-only";
import path from "node:path";
import crypto from "node:crypto";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "image/gif"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB
export const MAX_VIDEO_UPLOAD_BYTES = 50 * 1024 * 1024;

export class UploadValidationError extends Error {}

export async function saveUploadedFile(file: File): Promise<{
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}> {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
  if (!isImage && !isVideo) {
    throw new UploadValidationError(`Unsupported file type: ${file.type}`);
  }
  const maxBytes = isVideo ? MAX_VIDEO_UPLOAD_BYTES : MAX_UPLOAD_BYTES;
  if (file.size > maxBytes) {
    throw new UploadValidationError(`File exceeds the ${isVideo ? "50MB video" : "8MB image"} upload limit.`);
  }

  const ext = path.extname(file.name).toLowerCase() || guessExtension(file.type);
  const safeName = `${crypto.randomUUID()}${ext}`;
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "media";
  if (!supabaseUrl || !serviceRoleKey) {
    throw new UploadValidationError("Supabase Storage is not configured.");
  }

  const response = await fetch(`${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${safeName}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": file.type,
      "x-upsert": "false",
    },
    body: await file.arrayBuffer(),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new UploadValidationError(`Upload failed: ${message || response.statusText}`);
  }

  return {
    url: `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${safeName}`,
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
    case "video/mp4":
      return ".mp4";
    case "video/webm":
      return ".webm";
    case "video/quicktime":
      return ".mov";
    default:
      return "";
  }
}
