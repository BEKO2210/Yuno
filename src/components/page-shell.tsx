type Props = {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
};

/** Shared header + container for inner pages. */
export function PageShell({ title, subtitle, children }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-20">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-xl text-muted">{subtitle}</p>
      <div className="mt-12">{children}</div>
    </div>
  );
}

/** Temporary empty-state until the Supabase library is wired up. */
export function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/40 text-center">
      <p className="text-lg font-medium">No {label} yet</p>
      <p className="mt-1 text-sm text-muted">
        Upload some from the{" "}
        <a href="/admin" className="underline hover:text-foreground">
          admin area
        </a>{" "}
        to fill this page.
      </p>
    </div>
  );
}
