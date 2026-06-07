"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import logoMark from "../../public/brand/logo-mark.webp";

type Props = {
  /** size of the mark in px */
  size?: number;
  withWordmark?: boolean;
  className?: string;
  /** gentle continuous glow pulse (use on the hero, not in the header) */
  animated?: boolean;
};

/**
 * Yuno logo: the AI-generated glowing "Y" mark + wordmark.
 * The mark sits on pure black, so `mix-blend-mode: screen` drops the black
 * and leaves only the glow on our dark background.
 */
export function YunoLogo({
  size = 32,
  withWordmark = true,
  className,
  animated = false,
}: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <motion.span
        className="relative inline-block shrink-0 mix-blend-screen"
        style={{ width: size, height: size }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          animated
            ? { opacity: 1, scale: 1, filter: ["brightness(1)", "brightness(1.18)", "brightness(1)"] }
            : { opacity: 1, scale: 1 }
        }
        transition={
          animated
            ? { opacity: { duration: 0.6 }, scale: { duration: 0.6 }, filter: { duration: 4, repeat: Infinity, ease: "easeInOut" } }
            : { duration: 0.5 }
        }
      >
        <Image
          src={logoMark}
          alt="Yuno"
          fill
          sizes={`${size}px`}
          priority
          className="object-contain"
        />
      </motion.span>

      {withWordmark && (
        <motion.span
          className="text-xl font-semibold tracking-tight"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Yuno
        </motion.span>
      )}
    </span>
  );
}
