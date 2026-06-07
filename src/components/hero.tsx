"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { VideoBackground } from "@/components/video-background";
import { YunoLogo } from "@/components/yuno-logo";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // cinematic parallax: content drifts up & fades as you scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5"
    >
      <VideoBackground
        src="/video/hero.mp4"
        poster="/video/hero.jpg"
        parallax={140}
        opacity={0.7}
        overlay={0.5}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8 flex justify-center"
        >
          <YunoLogo size={76} withWordmark={false} animated />
        </motion.div>

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
            className="rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            Explore sounds
          </Link>
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        Scroll
      </motion.div>
    </section>
  );
}
