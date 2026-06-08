"use client";

import { useMemo, useState } from "react";
import { WallpaperGallery } from "@/components/gallery/wallpaper-gallery";
import { SoundGallery } from "@/components/gallery/sound-gallery";
import type { Asset } from "@/lib/types";

type Props = {
  assets: Asset[];
  variant: "wallpaper" | "sound";
};

const CHIP_LIMIT = 18;

/**
 * Search box + tag filter on top of a wallpaper grid or sound list.
 * Tag chips are the most-used tags first (so 50-tag SEO dumps don't flood the
 * UI); the search box still matches every tag and the title.
 */
export function AssetBrowser({ assets, variant }: Props) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);

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
      .map(([tag]) => tag);
  }, [assets]);

  const visibleTags = showAllTags ? rankedTags : rankedTags.slice(0, CHIP_LIMIT);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter((a) => {
      const matchesQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));
      const matchesTags =
        active.length === 0 || a.tags.some((t) => active.includes(t));
      return matchesQuery && matchesTags;
    });
  }, [assets, query, active]);

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
      {/* search */}
      <div className="mb-5 flex items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${variant === "wallpaper" ? "wallpapers" : "sounds"} & tags…`}
          className="w-full rounded-full border border-border bg-surface px-5 py-3 text-sm outline-none transition-colors focus:border-accent"
        />
        {hasFilters && (
          <button
            onClick={clearAll}
            className="shrink-0 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      {/* tag chips */}
      {visibleTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {visibleTags.map((tag) => {
            const on = active.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                aria-pressed={on}
                className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${
                  on
                    ? "bg-foreground text-background"
                    : "border border-border text-muted hover:text-foreground"
                }`}
              >
                #{tag}
              </button>
            );
          })}
          {rankedTags.length > CHIP_LIMIT && (
            <button
              onClick={() => setShowAllTags((s) => !s)}
              className="rounded-full px-3.5 py-1.5 text-xs text-accent transition-colors hover:underline"
            >
              {showAllTags ? "Show less" : `+${rankedTags.length - CHIP_LIMIT} more`}
            </button>
          )}
        </div>
      )}

      {/* result count */}
      <p className="mb-5 text-sm text-muted">
        {filtered.length} {filtered.length === 1 ? "result" : "results"}
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
