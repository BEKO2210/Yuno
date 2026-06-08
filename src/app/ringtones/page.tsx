import { PageShell, EmptyState } from "@/components/page-shell";
import { AssetBrowser } from "@/components/gallery/asset-browser";
import { getAssets } from "@/lib/queries";

export const metadata = { title: "Ringtones — Yuno" };
export const dynamic = "force-dynamic";

export default async function RingtonesPage() {
  const assets = await getAssets("ringtone");
  return (
    <PageShell
      title="Ringtones"
      subtitle="Stand-out ringtones, from cinematic to minimal. Preview and download."
    >
      {assets.length === 0 ? (
        <EmptyState label="ringtones" />
      ) : (
        <AssetBrowser assets={assets} variant="sound" />
      )}
    </PageShell>
  );
}
