import { PageShell } from "@/components/page-shell";

export const metadata = { title: "Admin — Yuno" };

export default function AdminPage() {
  return (
    <PageShell
      title="Admin"
      subtitle="Sign in to upload and manage wallpapers and sounds."
    >
      <div className="rounded-2xl border border-border bg-surface p-8">
        <p className="text-muted">
          The admin area (login + drag-&-drop upload) will live here once the
          Supabase project is connected. Next steps:
        </p>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-muted">
          <li>Create a Supabase project and run <code>supabase/schema.sql</code>.</li>
          <li>Add the keys to <code>.env.local</code> (see <code>.env.example</code>).</li>
          <li>Wire up email login + the upload form.</li>
        </ol>
      </div>
    </PageShell>
  );
}
