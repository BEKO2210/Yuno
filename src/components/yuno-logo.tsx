"use client";

import { motion } from "framer-motion";

type Props = {
  /** size of the mark in px */
  size?: number;
  withWordmark?: boolean;
  className?: string;
};

/**
 * Animated Yuno logo.
 * A glowing "Y" mark that draws itself in, paired with the wordmark.
 */
export function YunoLogo({ size = 32, withWordmark = true, className }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        initial="hidden"
        animate="visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="yuno-grad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        {/* soft circle backing */}
        <motion.circle
          cx="24"
          cy="24"
          r="22"
          stroke="url(#yuno-grad)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          variants={{
            hidden: { scale: 0.6, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
          }}
          style={{ transformOrigin: "center" }}
        />
        {/* the Y, drawn in */}
        <motion.path
          d="M16 15 L24 26 L32 15 M24 26 L24 34"
          stroke="url(#yuno-grad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1, ease: "easeInOut", delay: 0.2 },
            },
          }}
        />
      </motion.svg>

      {withWordmark && (
        <motion.span
          className="text-xl font-semibold tracking-tight"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Yuno
        </motion.span>
      )}
    </span>
  );
}
