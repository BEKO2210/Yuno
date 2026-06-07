import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Yuno — free & open source. Made by Belkis Aslani.
        </p>
        <div className="flex gap-6">
          <Link href="/wallpapers" className="hover:text-foreground">
            Wallpapers
          </Link>
          <Link href="/ringtones" className="hover:text-foreground">
            Ringtones
          </Link>
          <Link href="/notifications" className="hover:text-foreground">
            Notifications
          </Link>
          <a
            href="https://github.com/BEKO2210/Yuno"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
