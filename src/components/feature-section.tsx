"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { VideoBackground } from "@/components/video-background";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  video: string;
  poster?: string;
  align?: "left" | "center";
};

/** Full-height cinematic section with a video background and revealing copy. */
export function FeatureSection({
  eyebrow,
  title,
  description,
  href,
  cta,
  video,
  poster,
  align = "left",
}: Props) {
  return (
    <section className="relative flex min-h-[90svh] items-center overflow-hidden px-5 py-24">
      <VideoBackground src={video} poster={poster} parallax={100} opacity={0.55} overlay={0.6} />

      <div
        className={`relative z-10 mx-auto w-full max-w-7xl ${
          align === "center" ? "text-center" : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7 }}
          className={align === "center" ? "mx-auto max-w-2xl" : "max-w-xl"}
        >
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-accent">
            {eyebrow}
          </p>
          <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            {title}
          </h2>
          <p className="mt-5 text-pretty text-lg text-muted">{description}</p>
          <Link
            href={href}
            className="mt-8 inline-flex rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            {cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
