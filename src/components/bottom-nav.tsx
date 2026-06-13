"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const items: Item[] = [
  {
    href: "/",
    label: "Home",
    icon: (
      <path
        d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    href: "/wallpapers",
    label: "Walls",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="8.5" cy="8.5" r="1.6" fill="currentColor" />
        <path d="m4 17 4.5-4.5 4 4L16 13l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    ),
  },
  {
    href: "/ringtones",
    label: "Ringtones",
    icon: (
      <path
        d="M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    href: "/notifications",
    label: "Alerts",
    icon: (
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
];

/** Fixed app-style bottom tab bar (mobile only, like Zedge). */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-1 flex-col items-center gap-1 py-2.5"
            >
              <span
                className={`grid h-9 w-12 place-items-center rounded-full transition-all ${
                  active
                    ? "bg-gradient-to-r from-accent to-accent-2 text-background shadow-[0_0_18px_var(--glow)]"
                    : "text-muted group-hover:text-foreground"
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                  {item.icon}
                </svg>
              </span>
              <span
                className={`text-[10px] font-medium tracking-wide transition-colors ${
                  active ? "text-foreground" : "text-muted"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
