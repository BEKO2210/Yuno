"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageShell } from "@/components/page-shell";
import { ADMIN_EMAIL } from "@/lib/admin";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <PageShell title="Admin sign in" subtitle="Get a magic link by email — no password needed.">
      <div className="max-w-md rounded-2xl border border-border bg-surface p-8">
        {status === "sent" ? (
          <div>
            <p className="text-lg font-medium">Check your inbox ✉️</p>
            <p className="mt-2 text-sm text-muted">
              We sent a sign-in link to <span className="text-foreground">{email}</span>.
              Open it on this device to continue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm text-muted" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={ADMIN_EMAIL}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-accent"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send magic link"}
            </button>
            {status === "error" && (
              <p className="text-sm text-red-400">{message}</p>
            )}
            <p className="pt-2 text-xs text-muted">
              Only the site owner can upload. Other accounts can sign in but
              cannot make changes.
            </p>
          </form>
        )}
      </div>
    </PageShell>
  );
}
