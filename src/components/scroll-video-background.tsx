"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  src: string;
  poster?: string;
  /** darkening overlay strength for legibility (0–1) */
  overlay?: number;
};

/**
 * True only on devices where per-frame video seeking is smooth: pointer-fine,
 * larger screens, motion allowed. Reads a media query without effect-setState
 * (hydration-safe; assumes "static poster" on the server).
 */
const NO_SCRUB_QUERY =
  "(prefers-reduced-motion: reduce), (hover: none), (pointer: coarse), (max-width: 768px)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(NO_SCRUB_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function useScrubCapable() {
  return useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(NO_SCRUB_QUERY).matches,
    () => false,
  );
}

/**
 * Full-viewport fixed cinematic video background.
 *
 * On desktop (pointer-fine, large screens, motion allowed) playback is scrubbed
 * by scroll — scrolling scrubs the clip forward/back for a cinematic effect.
 * On touch / small screens, per-frame `currentTime` seeking is janky, so the
 * video simply **autoplays on a loop** instead: it keeps running smoothly
 * without stuttering the page. Reduced-motion users get a still poster.
 */
export function ScrollVideoBackground({ src, poster, overlay = 0.72 }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrub = useScrubCapable();
  const reduce = useReducedMotion();

  // Scroll-driven scrubbing (desktop only).
  useEffect(() => {
    if (!scrub) return;
    const video = videoRef.current;
    if (!video) return;

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
  }, [scrub]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {reduce ? (
        poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className="h-full w-full object-cover" />
        )
      ) : scrub ? (
        // desktop: playback position scrubbed by scroll
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
      ) : (
        // mobile/touch: just let it play on a loop — smooth, no scroll seeking
        <video
          className="h-full w-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
        />
      )}
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
