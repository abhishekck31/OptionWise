import type { Transition, Variants } from "framer-motion";

/**
 * The three curves every animation on the site draws from. They mirror the
 * --ease-* variables in globals.css so CSS and framer-motion move alike.
 */

/** Snappy out, smooth settle. The default for anything entering. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Material standard, for state changes that go both ways. */
export const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

/** A touch of overshoot, for things that should feel placed. */
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;

/** Every route enters the same way. */
export const pageTransition: Transition = { duration: 0.3, ease: EASE_OUT };

/** Delay between siblings in a revealed grid. */
export const STAGGER = 0.04;

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER } },
};

export const riseItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
};
