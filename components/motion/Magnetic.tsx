"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { FINE_POINTER, useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/** How far outside the element the pull starts. */
const REACH = 60;
/** The furthest the element travels towards the pointer. */
const MAX_SHIFT = 8;

/**
 * Pulls its child a few pixels towards a nearby mouse.
 *
 * Once the pointer is within 60px of the element's edge, the element leans
 * towards it — at most 8px — and springs home when the pointer leaves. The
 * listener only exists on a fine pointer without reduced motion; everywhere
 * else this renders a plain inline-block wrapper.
 */
export function Magnetic({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = useMediaQuery(FINE_POINTER);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  useEffect(() => {
    if (!enabled || reduceMotion) return;
    const node = ref.current;
    if (!node) return;

    const onMove = (e: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const inside =
        e.clientX > rect.left - REACH &&
        e.clientX < rect.right + REACH &&
        e.clientY > rect.top - REACH &&
        e.clientY < rect.bottom + REACH;

      if (!inside) {
        x.set(0);
        y.set(0);
        return;
      }

      // Normalised against the reach box, so the pull is strongest at the
      // centre line and eases off towards the edge of the field.
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2 + REACH);
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2 + REACH);
      x.set(Math.max(-1, Math.min(1, dx)) * MAX_SHIFT);
      y.set(Math.max(-1, Math.min(1, dy)) * MAX_SHIFT);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      x.set(0);
      y.set(0);
    };
  }, [enabled, reduceMotion, x, y]);

  return (
    <motion.span
      ref={ref}
      style={{ x: springX, y: springY }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  );
}

export default Magnetic;
