import { PageShell, EmptyState } from "@/components/page-shell";

export const metadata = { title: "Notification Sounds — Yuno" };

export default function NotificationsPage() {
  return (
    <PageShell
      title="Notification Sounds"
      subtitle="Short, clean notification sounds that don't annoy. Preview and download."
    >
      <EmptyState label="notification sounds" />
    </PageShell>
  );
}
