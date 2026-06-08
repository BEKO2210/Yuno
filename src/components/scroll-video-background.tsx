"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  /** darkening overlay strength for legibility (0–1) */
  overlay?: number;
};

/**
 * Full-viewport fixed video whose playback position is driven by scroll:
 * scrolling down scrubs the video forward, scrolling up rewinds it.
 * The video is encoded all-intra so seeking to any frame is instant; we lerp
 * toward the target time each frame for buttery motion. Falls back to a static
 * poster when the user prefers reduced motion.
 */
export function ScrollVideoBackground({ src, poster, overlay = 0.72 }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    let target = 0;
    let current = 0;

    const updateTarget = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      target = p * (video.duration || 0);
    };

    const tick = () => {
      // ease current toward target for smooth scrubbing
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.001) current = target;
      if (video.readyState >= 1 && Number.isFinite(current)) {
        try {
          video.currentTime = current;
        } catch {
          /* seeking not ready yet */
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      updateTarget();
      current = target;
      raf = requestAnimationFrame(tick);
    };

    if (video.readyState >= 1) start();
    else video.addEventListener("loadedmetadata", start, { once: true });

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
      />
      {/* legibility: darken + vignette so gallery content stays readable */}
      <div
        className="absolute inset-0"
        style={{ background: `rgba(6,6,8,${overlay})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 30%, transparent 40%, rgba(6,6,8,0.85) 100%)",
        }}
      />
    </div>
  );
}
