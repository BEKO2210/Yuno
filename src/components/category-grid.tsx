"use client";

import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import wallpaperImg from "../../public/brand/cat-wallpaper.webp";
import ringtoneImg from "../../public/brand/cat-ringtone.webp";
import notificationImg from "../../public/brand/cat-notification.webp";

type Category = {
  href: string;
  title: string;
  desc: string;
  image: StaticImageData;
};

const categories: Category[] = [
  {
    href: "/wallpapers",
    title: "Wallpapers",
    desc: "Crisp, high-resolution backgrounds for phone and desktop.",
    image: wallpaperImg,
  },
  {
    href: "/ringtones",
    title: "Ringtones",
    desc: "Stand-out ringtones, from cinematic to minimal.",
    image: ringtoneImg,
  },
  {
    href: "/notifications",
    title: "Notifications",
    desc: "Short, clean notification sounds that don't annoy.",
    image: notificationImg,
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
              className="group relative block h-72 overflow-hidden rounded-2xl border border-border"
            >
              {/* example image */}
              <Image
                src={cat.image}
                alt={`${cat.title} example`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                placeholder="blur"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* legibility gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              <div className="relative flex h-full flex-col justify-end p-6">
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
