import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Images are kept in private buckets, so stored references are bucket paths.
 * External absolute URLs are used as-is.
 */
export function isExternal(value?: string | null) {
  return Boolean(value && /^https?:\/\//i.test(value));
}

const SIGNED_TTL_SECONDS = 60 * 60 * 6; // 6h — fewer signing requests
const SAFETY_MS = 5 * 60 * 1000;

type CacheEntry = { url: string; expiresAt: number };
const memoryCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<string | null>>();
const STORE_KEY = "news:signed-urls:v1";

function loadPersisted(): Record<string, CacheEntry> {
  if (typeof sessionStorage === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY) ?? "{}") as Record<string, CacheEntry>;
  } catch {
    return {};
  }
}

function persist(key: string, entry: CacheEntry) {
  if (typeof sessionStorage === "undefined") return;
  try {
    const all = loadPersisted();
    all[key] = entry;
    sessionStorage.setItem(STORE_KEY, JSON.stringify(all));
  } catch {
    /* quota — ignore */
  }
}

function readCache(key: string) {
  const now = Date.now();
  const mem = memoryCache.get(key);
  if (mem && mem.expiresAt > now) return mem.url;
  const persisted = loadPersisted()[key];
  if (persisted && persisted.expiresAt > now) {
    memoryCache.set(key, persisted);
    return persisted.url;
  }
  return null;
}

/** Thumbnail sibling path for a stored image (news/abc.webp → news/abc-thumb.webp). */
export function thumbPath(value?: string | null) {
  if (!value || isExternal(value)) return value ?? null;
  return value.replace(/(\.[a-z0-9]+)$/i, "-thumb$1");
}

export async function resolveStorageUrl(bucket: string, value?: string | null) {
  if (!value) return null;
  if (isExternal(value)) return value;
  const key = `${bucket}/${value}`;
  const cached = readCache(key);
  if (cached !== null) return cached || null;
  const pending = inflight.get(key);
  if (pending) return pending;

  const promise = (async () => {
    const { data } = await supabase.storage.from(bucket).createSignedUrl(value, SIGNED_TTL_SECONDS);
    const url = data?.signedUrl ?? null;
    // cache misses too, so a missing rendition isn't re-signed on every render
    const entry = {
      url: url ?? "",
      expiresAt: Date.now() + (url ? SIGNED_TTL_SECONDS * 1000 - SAFETY_MS : 30 * 60 * 1000),
    };
    memoryCache.set(key, entry);
    persist(key, entry);
    inflight.delete(key);
    return url;
  })();
  inflight.set(key, promise);
  return promise;
}

export function useStorageUrl(bucket: string, value?: string | null) {
  const [url, setUrl] = useState<string | null>(() => {
    if (!value) return null;
    if (isExternal(value)) return value;
    return readCache(`${bucket}/${value}`) || null;
  });

  useEffect(() => {
    let active = true;
    if (!value) {
      setUrl(null);
      return;
    }
    if (isExternal(value)) {
      setUrl(value);
      return;
    }
    const cached = readCache(`${bucket}/${value}`);
    if (cached !== null) {
      setUrl(cached || null);
      return;
    }
    void resolveStorageUrl(bucket, value).then((u) => {
      if (active) setUrl(u);
    });
    return () => {
      active = false;
    };
  }, [bucket, value]);

  return url;
}

export async function uploadFile(bucket: string, path: string, file: File) {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
    cacheControl: "31536000",
  });
  if (error) throw error;
  return path;
}

/** Best-effort cleanup so replaced images don't linger in Storage. */
export async function removeFiles(bucket: string, paths: (string | null | undefined)[]) {
  const clean = paths.filter((p): p is string => Boolean(p) && !isExternal(p));
  if (clean.length === 0) return;
  try {
    await supabase.storage.from(bucket).remove(clean);
  } catch {
    /* ignore cleanup failures */
  }
}
