import Link from "next/link";
import { YunoLogo } from "@/components/yuno-logo";

const nav = [
  { href: "/wallpapers", label: "Wallpapers" },
  { href: "/ringtones", label: "Ringtones" },
  { href: "/notifications", label: "Notifications" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" aria-label="Yuno — home">
          <YunoLogo size={30} />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
