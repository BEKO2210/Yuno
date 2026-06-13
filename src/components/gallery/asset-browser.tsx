"use client";

import { useMemo, useState } from "react";
import { WallpaperGallery } from "@/components/gallery/wallpaper-gallery";
import { SoundGallery } from "@/components/gallery/sound-gallery";
import type { Asset } from "@/lib/types";

type Props = {
  assets: Asset[];
  variant: "wallpaper" | "sound";
};

type Sort = "new" | "popular";

const CHIP_LIMIT = 24;

/**
 * App-like browse experience: a sticky search + sort bar, a horizontally
 * scrollable row of category pills (most-used tags first), and a live result
 * grid. The search box still matches every tag and the title.
 */
export function AssetBrowser({ assets, variant }: Props) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [sort, setSort] = useState<Sort>("new");

  // tag → how many assets use it, sorted by frequency then name
  const rankedTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of assets) {
      for (const t of a.tags) {
        const key = t.trim();
        if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count }));
  }, [assets]);

  const visibleTags = showAllTags ? rankedTags : rankedTags.slice(0, CHIP_LIMIT);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = assets.filter((a) => {
      const matchesQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));
      const matchesTags =
        active.length === 0 || a.tags.some((t) => active.includes(t));
      return matchesQuery && matchesTags;
    });
    return [...list].sort((a, b) =>
      sort === "popular"
        ? b.download_count - a.download_count
        : +new Date(b.created_at) - +new Date(a.created_at),
    );
  }, [assets, query, active, sort]);

  function toggleTag(tag: string) {
    setActive((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function clearAll() {
    setActive([]);
    setQuery("");
  }

  const hasFilters = active.length > 0 || query.trim() !== "";

  return (
    <div>
      {/* sticky search + sort bar */}
      <div className="sticky top-16 z-30 -mx-5 mb-5 border-b border-border bg-background/70 px-5 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${variant === "wallpaper" ? "wallpapers" : "sounds"} & tags…`}
              className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>

          {/* sort segmented control */}
          <div className="hidden shrink-0 rounded-full border border-border bg-surface p-1 sm:flex">
            {(["new", "popular"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                aria-pressed={sort === s}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  sort === s ? "bg-foreground text-background" : "text-muted hover:text-foreground"
                }`}
              >
                {s === "new" ? "Newest" : "Popular"}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="shrink-0 rounded-full border border-border px-4 py-2.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* category pills — horizontally scrollable, app-style */}
      {rankedTags.length > 0 && (
        <div className="mb-7">
          <div
            className={`scroll-x flex gap-2 overflow-x-auto pb-1 ${
              showAllTags ? "flex-wrap overflow-visible" : "fade-x flex-nowrap"
            }`}
          >
            <button
              onClick={() => setActive([])}
              aria-pressed={active.length === 0}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                active.length === 0
                  ? "bg-gradient-to-r from-accent to-accent-2 text-background shadow-[0_0_20px_var(--glow)]"
                  : "border border-border text-muted hover:text-foreground"
              }`}
            >
              All
            </button>
            {visibleTags.map(({ tag, count }) => {
              const on = active.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={on}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all ${
                    on
                      ? "bg-gradient-to-r from-accent to-accent-2 text-background shadow-[0_0_20px_var(--glow)]"
                      : "border border-border text-muted hover:border-white/25 hover:text-foreground"
                  }`}
                >
                  <span>#{tag}</span>
                  <span className={`text-[11px] ${on ? "text-background/70" : "text-muted/60"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
            {rankedTags.length > CHIP_LIMIT && (
              <button
                onClick={() => setShowAllTags((s) => !s)}
                className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-accent transition-colors hover:underline"
              >
                {showAllTags ? "Show less" : `+${rankedTags.length - CHIP_LIMIT} more`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* result count */}
      <p className="mb-5 text-sm text-muted">
        <span className="font-medium text-foreground">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "result" : "results"}
        {hasFilters && ` of ${assets.length}`}
      </p>

      {/* results */}
      {filtered.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/40 text-center">
          <p className="text-lg font-medium">No matches</p>
          <p className="mt-1 text-sm text-muted">Try a different search or tag.</p>
        </div>
      ) : variant === "wallpaper" ? (
        <WallpaperGallery assets={filtered} />
      ) : (
        <SoundGallery assets={filtered} />
      )}
    </div>
  );
}
