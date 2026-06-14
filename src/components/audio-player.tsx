"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { playExclusive, releaseAudio } from "@/lib/audio-manager";
import { setNowPlaying, clearNowPlaying } from "@/lib/now-playing";
import { waveformFor } from "@/lib/assets";

type Props = {
  src: string;
  /** unique id (drives now-playing ownership + waveform seed) */
  id: string;
  /** track title for the mini-player bar */
  title: string;
  /** themed accent colour (CSS value) */
  accent: string;
  /** known duration in seconds, if any (used until metadata loads) */
  duration?: number | null;
};

function fmt(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Custom, app-style audio player: round play/pause control, a clickable
 * waveform that doubles as a scrubber, live equalizer motion while playing,
 * and a current/total time read-out. Only one player plays at a time, and the
 * active track is mirrored to the global now-playing bar.
 */
export function AudioPlayer({ src, id, title, accent, duration }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [total, setTotal] = useState(duration ?? 0);
  const [ready, setReady] = useState(false);

  const bars = useMemo(() => waveformFor(id + title, 56), [id, title]);
  const progress = total > 0 ? time / total : 0;

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const publishControls = () => ({
      toggle: () => {
        if (el.paused) void el.play();
        else el.pause();
      },
      seek: (seconds: number) => {
        el.currentTime = seconds;
      },
      stop: () => {
        el.pause();
        el.currentTime = 0;
      },
    });

    const onTime = () => {
      setTime(el.currentTime);
      setNowPlaying({ time: el.currentTime });
    };
    const onMeta = () => {
      setTotal(el.duration);
      setReady(true);
    };
    const onPlay = () => {
      playExclusive(el);
      setPlaying(true);
      setNowPlaying(
        { id, title, accent, playing: true, time: el.currentTime, duration: el.duration || total },
        publishControls(),
      );
    };
    const onPause = () => {
      setPlaying(false);
      setNowPlaying({ playing: false });
    };
    const onEnd = () => {
      setPlaying(false);
      setTime(0);
      el.currentTime = 0;
      setNowPlaying({ playing: false, time: 0 });
    };

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnd);
      releaseAudio(el);
      clearNowPlaying(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, title, accent]);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  }

  function seekFromEvent(clientX: number, rect: DOMRect) {
    const el = audioRef.current;
    if (!el || !total) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    el.currentTime = ratio * total;
    setTime(el.currentTime);
  }

  return (
    <div className="flex items-center gap-3">
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

      {/* play / pause */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="group relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-background transition-transform hover:scale-105 active:scale-95"
        style={{ background: accent, boxShadow: `0 0 22px ${accent}66` }}
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
          </svg>
        )}
      </button>

      {/* waveform / scrubber */}
      <div className="min-w-0 flex-1">
        <div
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(total) || 0}
          aria-valuenow={Math.round(time)}
          tabIndex={0}
          onClick={(e) =>
            seekFromEvent(e.clientX, e.currentTarget.getBoundingClientRect())
          }
          onKeyDown={(e) => {
            const el = audioRef.current;
            if (!el) return;
            if (e.key === "ArrowRight") el.currentTime = Math.min(total, time + 5);
            if (e.key === "ArrowLeft") el.currentTime = Math.max(0, time - 5);
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              toggle();
            }
          }}
          className="flex h-10 cursor-pointer items-center gap-[2px] outline-none"
        >
          {bars.map((h, i) => {
            const filled = i / bars.length <= progress;
            const playingHere = playing && Math.abs(i / bars.length - progress) < 0.06;
            return (
              <span
                key={i}
                className={playingHere ? "eq-bar" : ""}
                style={{
                  flex: 1,
                  height: `${Math.round(h * 100)}%`,
                  borderRadius: 9999,
                  background: filled ? accent : "var(--border)",
                  opacity: filled ? 1 : 0.9,
                  animationDelay: `${(i % 6) * 0.08}s`,
                }}
              />
            );
          })}
        </div>
        <div className="mt-1 flex justify-between font-mono text-[11px] text-muted">
          <span>{fmt(time)}</span>
          <span>{fmt(total) || (ready ? "0:00" : "—:—")}</span>
        </div>
      </div>
    </div>
  );
}
