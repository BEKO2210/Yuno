"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { downloadUrl, publicUrl } from "@/lib/assets";
import { DownloadButton } from "@/components/download-button";
import type { Asset } from "@/lib/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return `${n}`;
}

export function WallpaperGallery({ assets }: { assets: Asset[] }) {
  const [active, setActive] = useState<Asset | null>(null);

  // lock scroll + allow Esc to close while the lightbox is open
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
        {assets.map((a, i) => {
          const src = publicUrl(SUPABASE_URL, "wallpapers", a.file_path);
          const dl = downloadUrl(SUPABASE_URL, "wallpapers", a.file_path, a.title);
          return (
            <button
              key={a.id}
              onClick={() => setActive(a)}
              className="animate-rise group relative block w-full break-inside-avoid overflow-hidden rounded-2xl border border-border bg-surface text-left transition-colors hover:border-white/25"
              style={{ animationDelay: `${Math.min(i, 16) * 30}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={a.title}
                loading="lazy"
                className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/95 via-background/25 to-transparent p-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="truncate text-sm font-medium">{a.title}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted">
                    {a.download_count > 0 ? `${formatCount(a.download_count)} ↓` : "New"}
                  </span>
                  <DownloadButton
                    assetId={a.id}
                    href={dl}
                    className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-transform hover:scale-105"
                  >
                    Download
                  </DownloadButton>
                </div>
              </div>
              {/* tiny "expand" affordance */}
              <span className="pointer-events-none absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-background/50 text-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M9 3H3v6m12-6h6v6M9 21H3v-6m18 0v6h-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          );
        })}
      </div>

      {/* lightbox / detail view */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <div className="absolute inset-0 bg-background/85 backdrop-blur-xl" />
            <motion.div
              className="glass relative z-10 flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl md:flex-row"
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex min-h-0 flex-1 items-center justify-center bg-black/40 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicUrl(SUPABASE_URL, "wallpapers", active.file_path)}
                  alt={active.title}
                  className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain md:max-h-[82vh]"
                />
              </div>
              <div className="flex w-full shrink-0 flex-col gap-4 p-6 md:w-80">
                <h2 className="font-display text-2xl font-semibold leading-tight">
                  {active.title}
                </h2>
                <div className="flex flex-wrap gap-3 text-sm text-muted">
                  {active.width && active.height && (
                    <span>
                      {active.width} × {active.height}
                    </span>
                  )}
                  <span>{formatCount(active.download_count)} downloads</span>
                </div>
                {active.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {active.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-muted ring-1 ring-inset ring-white/10"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <DownloadButton
                  assetId={active.id}
                  href={downloadUrl(SUPABASE_URL, "wallpapers", active.file_path, active.title)}
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Download
                </DownloadButton>
              </div>

              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-background/90"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
