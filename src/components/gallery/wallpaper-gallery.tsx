import { bucketFor, downloadUrl, publicUrl } from "@/lib/assets";
import { DownloadButton } from "@/components/download-button";
import type { Asset } from "@/lib/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export function WallpaperGallery({ assets }: { assets: Asset[] }) {
  return (
    <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
      {assets.map((a) => {
        const bucket = bucketFor(a.kind);
        const src = publicUrl(SUPABASE_URL, bucket, a.file_path);
        const dl = downloadUrl(SUPABASE_URL, bucket, a.file_path, a.title);
        return (
          <div
            key={a.id}
            className="group relative break-inside-avoid overflow-hidden rounded-xl border border-border bg-surface"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={a.title}
              loading="lazy"
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/90 via-background/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="truncate text-sm font-medium">{a.title}</p>
              <DownloadButton
                assetId={a.id}
                href={dl}
                className="pointer-events-auto mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-transform hover:scale-105"
              >
                ↓ Download
              </DownloadButton>
            </div>
          </div>
        );
      })}
    </div>
  );
}
