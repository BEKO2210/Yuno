"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // cinematic parallax: content drifts up & fades as you scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-5"
    >
      {/* animated glow orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--glow), transparent 60%)", scale }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 inline-block rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted"
        >
          Free · Open Source
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
        >
          Wallpapers & sounds,{" "}
          <span className="text-gradient">made to be downloaded.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted"
        >
          A free, open library of high-quality wallpapers, ringtones and
          notification sounds. No paywalls. No clutter. Just download.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/wallpapers"
            className="rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
          >
            Browse wallpapers
          </Link>
          <Link
            href="/ringtones"
            className="rounded-full border border-border px-7 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Explore sounds
          </Link>
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        Scroll
      </motion.div>
    </section>
  );
}
