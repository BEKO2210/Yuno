"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  {
    href: "/wallpapers",
    title: "Wallpapers",
    desc: "Crisp, high-resolution backgrounds for phone and desktop.",
    accent: "var(--accent)",
  },
  {
    href: "/ringtones",
    title: "Ringtones",
    desc: "Stand-out ringtones, from cinematic to minimal.",
    accent: "var(--accent-2)",
  },
  {
    href: "/notifications",
    title: "Notifications",
    desc: "Short, clean notification sounds that don't annoy.",
    accent: "#ff7ac6",
  },
];

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Pick your vibe.
      </motion.h2>

      <div className="grid gap-5 md:grid-cols-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.href}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Link
              href={cat.href}
              className="group relative block h-64 overflow-hidden rounded-2xl border border-border bg-surface p-6"
            >
              <div
                className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                style={{ background: cat.accent }}
              />
              <div className="relative flex h-full flex-col justify-end">
                <h3 className="text-2xl font-semibold">{cat.title}</h3>
                <p className="mt-2 max-w-xs text-sm text-muted">{cat.desc}</p>
                <span className="mt-4 text-sm text-muted transition-colors group-hover:text-foreground">
                  Browse →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
