import { PageShell, EmptyState } from "@/components/page-shell";
import { AssetBrowser } from "@/components/gallery/asset-browser";
import { getAssets } from "@/lib/queries";

export const metadata = { title: "Wallpapers — Yuno" };
export const dynamic = "force-dynamic";

export default async function WallpapersPage() {
  const assets = await getAssets("wallpaper");
  return (
    <PageShell
      title="Wallpapers"
      subtitle="High-resolution backgrounds for phone and desktop. Free to download."
    >
      {assets.length === 0 ? (
        <EmptyState label="wallpapers" />
      ) : (
        <AssetBrowser assets={assets} variant="wallpaper" />
      )}
    </PageShell>
  );
}
