"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether a media query matches, kept in sync as it changes.
 *
 * Reads false on the server and on the hydrating paint, so anything gated on
 * it (the cursor follower, magnetic pull) mounts only once the client knows.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** A mouse or trackpad on a screen wide enough to be a desktop. */
export const FINE_POINTER_DESKTOP = "(hover: hover) and (pointer: fine) and (min-width: 1024px)";

/** Fine pointer at any width: magnetic pull and tilt are fine on a small laptop. */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
