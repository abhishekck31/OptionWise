"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** How long each digit spins before it lands. */
const DIGIT_DURATION = 800;
/** The gap between one digit landing and the next, left to right. */
const DIGIT_STAGGER = 110;
/** Frames per second the reels tick at — fast enough to blur, slow enough to read. */
const TICK = 1000 / 24;

/**
 * A formatted number that spins in like a slot machine.
 *
 * Every digit cycles 0–9 and settles on its target one after another, left to
 * right; separators (commas, the decimal point) sit still from the start, so
 * the shape of the number is there before its value is.
 *
 * Returns the string to render. Ticks at 24fps for well under two seconds,
 * then stops; with reduced motion it returns the final value straight away.
 */
export function useSlotMachine(
  target: string,
  { delay = 0, duration = DIGIT_DURATION }: { delay?: number; duration?: number } = {}
): string {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(target);
      return;
    }

    const chars = [...target];
    const digitIndexes = chars
      .map((c, i) => (/\d/.test(c) ? i : -1))
      .filter((i) => i >= 0);

    const start = performance.now() + delay;
    const total = duration + (digitIndexes.length - 1) * DIGIT_STAGGER;
    let timer = 0;

    const tick = () => {
      const elapsed = performance.now() - start;
      if (elapsed < 0) {
        setDisplay(chars.map((c) => (/\d/.test(c) ? "0" : c)).join(""));
        timer = window.setTimeout(tick, TICK);
        return;
      }

      const next = chars.slice();
      digitIndexes.forEach((charIndex, order) => {
        const landsAt = duration + order * DIGIT_STAGGER;
        if (elapsed < landsAt) {
          next[charIndex] = String(Math.floor(Math.random() * 10));
        }
      });
      setDisplay(next.join(""));

      if (elapsed < total) timer = window.setTimeout(tick, TICK);
      else setDisplay(target);
    };

    tick();
    return () => window.clearTimeout(timer);
  }, [target, delay, duration, reduceMotion]);

  return display;
}
