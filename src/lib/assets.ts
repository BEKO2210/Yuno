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
