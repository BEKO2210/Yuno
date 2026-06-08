"use client";

import { bucketFor, downloadUrl, publicUrl } from "@/lib/assets";
import { DownloadButton } from "@/components/download-button";
import type { Asset } from "@/lib/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return "";
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SoundGallery({ assets }: { assets: Asset[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {assets.map((a) => {
        const bucket = bucketFor(a.kind);
        const src = publicUrl(SUPABASE_URL, bucket, a.file_path);
        const dl = downloadUrl(SUPABASE_URL, bucket, a.file_path, a.title);
        return (
          <div key={a.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{a.title}</p>
                {a.duration ? (
                  <p className="text-xs text-muted">{formatDuration(a.duration)}</p>
                ) : null}
              </div>
              <DownloadButton
                assetId={a.id}
                href={dl}
                className="shrink-0 rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-transform hover:scale-105"
              >
                ↓ Download
              </DownloadButton>
            </div>

            <audio controls preload="none" src={src} className="mt-4 w-full" />

            {a.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {a.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
