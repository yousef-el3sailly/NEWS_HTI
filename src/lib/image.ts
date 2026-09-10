/**
 * Client-side image optimization: validate → resize → compress → WebP.
 * Keeps Supabase Storage & egress small without touching visual quality.
 */

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export type OptimizedImage = {
  file: File;
  originalSize: number;
  optimizedSize: number;
  width: number;
  height: number;
  previewUrl: string;
};

export type OptimizeOptions = {
  maxWidth: number;
  maxHeight: number;
  /** target bytes; quality steps down until reached (best effort) */
  targetBytes?: number;
  quality?: number;
  fileName?: string;
};

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateImageFile(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return "نوع الملف غير مدعوم. اختر صورة JPG أو PNG أو WEBP.";
  }
  if (file.size > 15 * 1024 * 1024) {
    return "الصورة كبيرة جدًا (أكثر من 15 ميجابايت). اختر صورة أصغر.";
  }
  return null;
}

async function loadBitmap(file: File) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      /* fall through */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("image-decode-failed"));
      el.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Resize + compress to WebP (falls back to JPEG when WebP is unavailable). */
export async function optimizeImage(file: File, opts: OptimizeOptions): Promise<OptimizedImage> {
  const { maxWidth, maxHeight, targetBytes, quality = 0.82 } = opts;
  const source = await loadBitmap(file);
  const sw = "width" in source ? source.width : 0;
  const sh = "height" in source ? source.height : 0;
  const ratio = Math.min(1, maxWidth / sw, maxHeight / sh);
  const width = Math.max(1, Math.round(sw * ratio));
  const height = Math.max(1, Math.round(sh * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-unavailable");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source as CanvasImageSource, 0, 0, width, height);
  if ("close" in source && typeof source.close === "function") source.close();

  const type = canvas.toDataURL("image/webp").startsWith("data:image/webp")
    ? "image/webp"
    : "image/jpeg";

  let q = quality;
  let blob = await canvasToBlob(canvas, type, q);
  // Step quality down (never below 0.6) until we approach the size target.
  while (blob && targetBytes && blob.size > targetBytes && q > 0.6) {
    q = Math.round((q - 0.07) * 100) / 100;
    blob = await canvasToBlob(canvas, type, q);
  }
  if (!blob) throw new Error("image-encode-failed");

  const ext = type === "image/webp" ? "webp" : "jpg";
  const base = (opts.fileName ?? "image").replace(/\.[^.]+$/, "");
  const optimized = new File([blob], `${base}.${ext}`, { type });

  return {
    file: optimized,
    originalSize: file.size,
    optimizedSize: optimized.size,
    width,
    height,
    previewUrl: URL.createObjectURL(optimized),
  };
}

/** Deterministic content hash → avoids duplicate files in Storage. */
export async function hashFile(file: File) {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const IMAGE_PRESETS = {
  news: { maxWidth: 1920, maxHeight: 1080, targetBytes: 450 * 1024, quality: 0.82 },
  newsThumb: { maxWidth: 640, maxHeight: 400, targetBytes: 90 * 1024, quality: 0.8 },
  avatar: { maxWidth: 800, maxHeight: 800, targetBytes: 250 * 1024, quality: 0.82 },
} satisfies Record<string, OptimizeOptions>;
