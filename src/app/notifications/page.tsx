import { PageShell, EmptyState } from "@/components/page-shell";
import { AssetBrowser } from "@/components/gallery/asset-browser";
import { getAssets } from "@/lib/queries";

export const metadata = { title: "Notification Sounds — Yuno" };
export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const assets = await getAssets("notification");
  return (
    <PageShell
      title="Notification Sounds"
      subtitle="Short, clean notification sounds that don't annoy. Preview and download."
    >
      {assets.length === 0 ? (
        <EmptyState label="notification sounds" />
      ) : (
        <AssetBrowser assets={assets} variant="sound" />
      )}
    </PageShell>
  );
}
