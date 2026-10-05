import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { resolveStorageUrl, thumbPath } from "@/lib/storage";
import { cn } from "@/lib/utils";

/**
 * Bandwidth-friendly image:
 * - prefers the small (-thumb) rendition for cards, falls back to the full image
 * - lazy-loads by default, shows a NEWS-branded skeleton then a clean fallback
 */
export function SmartImage({
  bucket,
  path,
  alt,
  className,
  variant = "full",
  eager = false,
  fallbackIconClassName,
}: {
  bucket: string;
  path?: string | null;
  alt: string;
  className?: string;
  variant?: "full" | "thumb";
  eager?: boolean;
  fallbackIconClassName?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [useFull, setUseFull] = useState(variant === "full");

  useEffect(() => {
    let active = true;
    setLoaded(false);
    setFailed(false);
    setUseFull(variant === "full");
    if (!path) {
      setSrc(null);
      return;
    }
    void resolveStorageUrl(bucket, variant === "thumb" ? thumbPath(path) : path).then((u) => {
      if (!active) return;
      if (u) {
        setSrc(u);
        return;
      }
      // no small rendition (older uploads) → use the original
      setUseFull(true);
      void resolveStorageUrl(bucket, path).then((full) => {
        if (active) setSrc(full);
      });
    });
    return () => {
      active = false;
    };
  }, [bucket, path, variant]);

  const onError = () => {
    if (!useFull && path) {
      // thumbnail missing (older uploads) → fall back to the original
      setUseFull(true);
      void resolveStorageUrl(bucket, path).then(setSrc);
      return;
    }
    setFailed(true);
  };

  if (!path || failed || (src === null && !path)) {
    if (!path || failed) {
      return (
        <div
          className={cn(
            "flex size-full items-center justify-center bg-secondary text-muted-foreground",
            className,
          )}
        >
          <ImageOff className={cn("size-8", fallbackIconClassName)} />
        </div>
      );
    }
  }

  return (
    <>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-secondary" aria-hidden />}
      {src && (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={onError}
          className={cn(className, !loaded && "opacity-0")}
        />
      )}
    </>
  );
}
