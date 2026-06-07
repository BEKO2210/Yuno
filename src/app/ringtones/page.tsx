import { PageShell, EmptyState } from "@/components/page-shell";

export const metadata = { title: "Ringtones — Yuno" };

export default function RingtonesPage() {
  return (
    <PageShell
      title="Ringtones"
      subtitle="Stand-out ringtones, from cinematic to minimal. Preview and download."
    >
      <EmptyState label="ringtones" />
    </PageShell>
  );
}
