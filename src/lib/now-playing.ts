"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny global "now playing" store so a persistent mini-player bar can reflect
 * and control whichever track the user last started — app-like single-stream
 * playback (see audio-manager for the "only one plays" guarantee).
 */
export type NowPlaying = {
  id: string | null;
  title: string;
  accent: string;
  playing: boolean;
  time: number;
  duration: number;
};

export type NowPlayingControls = {
  toggle: () => void;
  seek: (seconds: number) => void;
  stop: () => void;
};

const initial: NowPlaying = {
  id: null,
  title: "",
  accent: "var(--accent)",
  playing: false,
  time: 0,
  duration: 0,
};

let state: NowPlaying = initial;
let controls: NowPlayingControls | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function setNowPlaying(
  next: Partial<NowPlaying>,
  ctrl?: NowPlayingControls,
) {
  state = { ...state, ...next };
  if (ctrl) controls = ctrl;
  emit();
}

/** Called by a player when it is torn down, if it still owns the bar. */
export function clearNowPlaying(id: string) {
  if (state.id !== id) return;
  state = initial;
  controls = null;
  emit();
}

export function nowPlayingControls() {
  return controls;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useNowPlaying(): NowPlaying {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initial,
  );
}
