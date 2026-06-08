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
 * The mark is a free-standing transparent PNG/WebP (alpha baked from the
 * glow), so it sits cleanly on any background — no blend tricks needed.
 */
export function YunoLogo({
  size = 32,
  withWordmark = true,
  className,
  animated = false,
}: Props) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className ?? ""}`}>
      <motion.span
        className="relative inline-block shrink-0"
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
          // The mark already *is* the "Y", so the wordmark is just "uno".
          className="font-display text-[1.4rem] font-semibold leading-none tracking-tight"
          style={{
            marginLeft: "-0.04em",
            backgroundImage:
              "linear-gradient(90deg, var(--foreground) 0%, var(--accent) 35%, var(--accent-2) 60%, var(--foreground) 100%)",
            backgroundSize: "220% auto",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
          }}
          initial={{ opacity: 0, x: -4 }}
          animate={{
            opacity: 1,
            x: 0,
            backgroundPositionX: ["0%", "-220%"],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 0.25 },
            x: { duration: 0.5, delay: 0.25 },
            backgroundPositionX: { duration: 7, repeat: Infinity, ease: "linear" },
          }}
        >
          uno
        </motion.span>
      )}
    </span>
  );
}
