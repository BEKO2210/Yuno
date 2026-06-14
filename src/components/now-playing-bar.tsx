"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useNowPlaying, nowPlayingControls, clearNowPlaying } from "@/lib/now-playing";

function fmt(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Persistent mini-player. Appears once a track has started and mirrors / drives
 * the active player. Sits above the mobile tab bar; spans the bottom on desktop.
 */
export function NowPlayingBar() {
  const np = useNowPlaying();
  const visible = np.id !== null;
  const progress = np.duration > 0 ? np.time / np.duration : 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed inset-x-0 bottom-[72px] z-40 px-3 md:bottom-0 md:px-0"
        >
          <div className="glass mx-auto flex max-w-3xl items-center gap-3 rounded-2xl px-3 py-2.5 md:max-w-none md:rounded-none md:rounded-t-2xl md:px-6">
            {/* play / pause */}
            <button
              type="button"
              aria-label={np.playing ? "Pause" : "Play"}
              onClick={() => nowPlayingControls()?.toggle()}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-background transition-transform hover:scale-105 active:scale-95"
              style={{ background: np.accent, boxShadow: `0 0 18px ${np.accent}66` }}
            >
              {np.playing ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
                </svg>
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium">{np.title}</p>
                <span className="shrink-0 font-mono text-[11px] text-muted">
                  {fmt(np.time)} / {fmt(np.duration)}
                </span>
              </div>
              {/* progress / seek */}
              <div
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={Math.round(np.duration) || 0}
                aria-valuenow={Math.round(np.time)}
                tabIndex={0}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                  nowPlayingControls()?.seek(ratio * np.duration);
                }}
                className="group mt-1.5 h-2.5 cursor-pointer"
              >
                <div className="mt-[3px] h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-[width] duration-150"
                    style={{ width: `${progress * 100}%`, background: np.accent }}
                  />
                </div>
              </div>
            </div>

            {/* close */}
            <button
              type="button"
              aria-label="Stop"
              onClick={() => {
                nowPlayingControls()?.stop();
                if (np.id) clearNowPlaying(np.id);
              }}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
