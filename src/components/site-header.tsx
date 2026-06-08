"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { YunoLogo } from "@/components/yuno-logo";

const nav = [
  { href: "/wallpapers", label: "Wallpapers" },
  { href: "/ringtones", label: "Ringtones" },
  { href: "/notifications", label: "Notifications" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" aria-label="Yuno — home" onClick={() => setOpen(false)}>
          <YunoLogo size={36} />
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => {
            const activeLink = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative font-display text-sm font-medium tracking-wide text-muted transition-colors hover:text-foreground"
              >
                <span className={activeLink ? "text-foreground" : ""}>
                  {item.label}
                </span>
                {/* animated gradient underline */}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-gradient-to-r from-accent to-accent-2 transition-all duration-300 ${
                    activeLink ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden rounded-full border border-border px-4 py-1.5 font-display text-sm tracking-wide text-muted transition-colors hover:text-foreground md:inline-block"
          >
            Admin
          </Link>

          {/* mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground md:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="relative h-4 w-5">
              <motion.span
                className="absolute left-0 block h-0.5 w-5 rounded bg-foreground"
                animate={open ? { top: 7, rotate: 45 } : { top: 2, rotate: 0 }}
                style={{ top: 2 }}
              />
              <motion.span
                className="absolute left-0 top-[7px] block h-0.5 w-5 rounded bg-foreground"
                animate={open ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span
                className="absolute left-0 block h-0.5 w-5 rounded bg-foreground"
                animate={open ? { top: 7, rotate: -45 } : { top: 12, rotate: 0 }}
                style={{ top: 12 }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col px-5 py-2">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block border-b border-border/60 py-4 font-display text-lg tracking-wide transition-colors ${
                      pathname === item.href
                        ? "text-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="py-4 font-display text-lg tracking-wide text-accent"
              >
                Admin
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
