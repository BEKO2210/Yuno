import type { AssetKind } from "@/lib/types";

/** Which storage bucket an asset kind lives in. */
export function bucketFor(kind: AssetKind): "wallpapers" | "audio" {
  return kind === "wallpaper" ? "wallpapers" : "audio";
}

/** Public URL for a file stored in a public bucket. */
export function publicUrl(supabaseUrl: string, bucket: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

export const KIND_LABELS: Record<AssetKind, string> = {
  wallpaper: "Wallpaper",
  ringtone: "Ringtone",
  notification: "Notification sound",
};

/** CSS variable name for a kind's accent colour. */
export function accentVarFor(kind: AssetKind): string {
  return kind === "wallpaper"
    ? "var(--wallpaper)"
    : kind === "ringtone"
      ? "var(--ringtone)"
      : "var(--notification)";
}

/** Stable 32-bit hash of a string (for deterministic colours/waveforms). */
export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * A pleasing, deterministic two-stop gradient derived from a seed string.
 * Used as cover art for audio assets that have no preview image.
 */
export function gradientFor(seed: string): string {
  const h = hashString(seed);
  const a = h % 360;
  const b = (a + 40 + ((h >> 8) % 80)) % 360;
  return `linear-gradient(135deg, hsl(${a} 70% 22%) 0%, hsl(${b} 75% 14%) 100%)`;
}

/** Up to two uppercase initials from a title (for cover-art fallbacks). */
export function initialsOf(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "♪";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Deterministic pseudo-waveform: an array of bar heights (0.15–1) seeded from
 * the title. Looks like a real audio waveform without decoding the file.
 */
export function waveformFor(seed: string, bars = 48): number[] {
  let h = hashString(seed) || 1;
  const out: number[] = [];
  for (let i = 0; i < bars; i++) {
    // xorshift for a varied-but-stable sequence
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    const n = (h >>> 0) / 0xffffffff;
    // bias toward a centre-weighted, lively shape
    const env = Math.sin((i / bars) * Math.PI);
    out.push(0.18 + (0.25 + 0.55 * n) * (0.5 + 0.5 * env));
  }
  return out;
}

/** Accepted file types per kind for the upload input. */
export function acceptFor(kind: AssetKind): string {
  return kind === "wallpaper" ? "image/*" : "audio/*";
}

/** Build a safe, unique storage path. */
export function buildPath(kind: AssetKind, fileName: string, unique: string): string {
  const safe = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${kind}/${unique}-${safe}`;
}

/** File extension (without dot) from a storage path. */
export function fileExt(path: string): string {
  const m = path.match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : "";
}

/** A nice download filename: "<slugified title>.<ext>". */
export function downloadName(title: string, path: string): string {
  const ext = fileExt(path);
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "yuno";
  return ext ? `${base}.${ext}` : base;
}

/**
 * Public URL that forces a download with a friendly filename.
 * Supabase storage honours the `?download=` query param via Content-Disposition.
 */
export function downloadUrl(
  supabaseUrl: string,
  bucket: string,
  path: string,
  title: string,
): string {
  return `${publicUrl(supabaseUrl, bucket, path)}?download=${encodeURIComponent(downloadName(title, path))}`;
}
