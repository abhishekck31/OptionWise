"use client";

import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/** Every scroll reveal fires once, a little before the element is fully in. */
export const VIEWPORT = { once: true, margin: "-80px" } as const;

const VARIANTS: Record<"text" | "card" | "fade", Variants> = {
  text: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
  },
  card: {
    hidden: { opacity: 0, y: 32, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE_OUT } },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8, ease: EASE_OUT } },
  },
};

export const revealText = VARIANTS.text;
export const revealCard = VARIANTS.card;

/** Staggers its Reveal children in order. */
export const revealGroup = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

type RevealProps = Omit<HTMLMotionProps<"div">, "variants"> & {
  kind?: keyof typeof VARIANTS;
  delay?: number;
  /** Set when a parent group drives the timing. */
  inherit?: boolean;
};

/**
 * Scroll-triggered entrance, built on `whileInView` so there is no scroll
 * listener anywhere: framer-motion hands the work to IntersectionObserver.
 */
export function Reveal({
  kind = "text",
  delay = 0,
  inherit = false,
  children,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  // A transition inside a variant outranks the component's own, so the delay
  // is folded into the variant rather than passed alongside it.
  const base = VARIANTS[kind];
  const variants: Variants = delay
    ? {
        ...base,
        show: {
          ...(base.show as object),
          transition: { ...((base.show as { transition?: object }).transition ?? {}), delay },
        },
      }
    : base;

  if (inherit) {
    return (
      <motion.div variants={variants} {...props}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={variants}
      initial={reduceMotion ? false : "hidden"}
      whileInView="show"
      viewport={VIEWPORT}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
