import { PageShell, EmptyState } from "@/components/page-shell";

export const metadata = { title: "Wallpapers — Yuno" };

export default function WallpapersPage() {
  return (
    <PageShell
      title="Wallpapers"
      subtitle="High-resolution backgrounds for phone and desktop. Free to download."
    >
      <EmptyState label="wallpapers" />
    </PageShell>
  );
}
