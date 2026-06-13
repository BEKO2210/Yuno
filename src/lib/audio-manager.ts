"use client";

/**
 * Tiny global "now playing" coordinator so that starting one track pauses
 * whichever track was playing before — app-like, single-stream behaviour.
 */
let current: HTMLAudioElement | null = null;

export function playExclusive(el: HTMLAudioElement) {
  if (current && current !== el) {
    current.pause();
  }
  current = el;
}

export function releaseAudio(el: HTMLAudioElement) {
  if (current === el) current = null;
}
