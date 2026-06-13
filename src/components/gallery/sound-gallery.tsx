"use client";

import {
  accentVarFor,
  bucketFor,
  downloadUrl,
  gradientFor,
  initialsOf,
  publicUrl,
} from "@/lib/assets";
import { AudioPlayer } from "@/components/audio-player";
import { DownloadButton } from "@/components/download-button";
import type { Asset } from "@/lib/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return `${n}`;
}

export function SoundGallery({ assets }: { assets: Asset[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {assets.map((a, i) => {
        const bucket = bucketFor(a.kind);
        const src = publicUrl(SUPABASE_URL, bucket, a.file_path);
        const dl = downloadUrl(SUPABASE_URL, bucket, a.file_path, a.title);
        const accent = accentVarFor(a.kind);
        const cover = a.preview_path
          ? publicUrl(SUPABASE_URL, bucketFor("wallpaper"), a.preview_path)
          : null;

        return (
          <article
            key={a.id}
            className="glass animate-rise group flex flex-col gap-4 rounded-2xl p-4 transition-colors hover:border-white/20"
            style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
          >
            <div className="flex items-center gap-3">
              {/* cover art */}
              <div
                className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl text-lg font-semibold text-white/90"
                style={cover ? undefined : { backgroundImage: gradientFor(a.title) }}
              >
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-display">{initialsOf(a.title)}</span>
                )}
                <span
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
                  aria-hidden
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-medium">{a.title}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {a.download_count > 0
                    ? `${formatCount(a.download_count)} downloads`
                    : "New"}
                </p>
              </div>

              <DownloadButton
                assetId={a.id}
                href={dl}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-white/30 hover:bg-white/5"
              >
                <span className="sr-only">Download {a.title}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </DownloadButton>
            </div>

            <AudioPlayer src={src} seed={a.id + a.title} accent={accent} duration={a.duration} />

            {a.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {a.tags.slice(0, 5).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-muted ring-1 ring-inset ring-white/10"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
