import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { PageShell } from "@/components/page-shell";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import type { Asset } from "@/lib/types";

export const metadata = { title: "Admin — Yuno" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAdminEmail(user.email)) {
    return (
      <PageShell title="Not authorized" subtitle="This account can browse but not manage Yuno.">
        <div className="max-w-md rounded-2xl border border-border bg-surface p-8">
          <p className="text-muted">
            You&apos;re signed in as{" "}
            <span className="text-foreground">{user.email}</span>, which isn&apos;t the
            owner account.
          </p>
          <form action="/auth/signout" method="post" className="mt-4">
            <button className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-background">
              Sign out
            </button>
          </form>
          <Link href="/" className="mt-4 inline-block text-sm text-muted hover:text-foreground">
            ← Back to site
          </Link>
        </div>
      </PageShell>
    );
  }

  const { data: assets } = await supabase
    .from("assets")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <PageShell title="Admin" subtitle={`Signed in as ${user.email}. Upload and manage your library.`}>
      <AdminDashboard initialAssets={(assets as Asset[]) ?? []} />
    </PageShell>
  );
}
