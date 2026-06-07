"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type Props = {
  /** path under /public, e.g. "/video/hero.mp4" */
  src: string;
  /** optional poster image shown before/instead of the video */
  poster?: string;
  /** how strongly the video drifts on scroll (px) */
  parallax?: number;
  /** base opacity of the video layer */
  opacity?: number;
  /** tint/overlay strength for text legibility (0–1) */
  overlay?: number;
  className?: string;
};

/**
 * Cinematic full-bleed video background with scroll-driven parallax + fade.
 * One clip can feel like several by varying parallax / opacity / overlay /
 * CSS filters per section. Falls back to a static poster when the user
 * prefers reduced motion.
 */
export function VideoBackground({
  src,
  poster,
  parallax = 120,
  opacity = 0.5,
  overlay = 0.55,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-parallax, parallax]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden
    >
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y, scale }}>
        {reduce ? (
          poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className="h-full w-full object-cover" />
          )
        ) : (
          <video
            className="h-full w-full object-cover"
            style={{ opacity }}
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
      </motion.div>

      {/* legibility overlay: darken + brand tint + vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(6,6,8,${overlay * 0.9}) 0%, rgba(6,6,8,${overlay * 0.4}) 45%, rgba(6,6,8,${overlay}) 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, transparent 40%, rgba(6,6,8,0.85) 100%)",
        }}
      />
    </div>
  );
}
