"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { FINE_POINTER_DESKTOP, useMediaQuery } from "@/hooks/useMediaQuery";

type CursorState = "idle" | "interactive" | "button" | "hidden";

/** Anything that takes a click or a value counts as interactive. */
const INTERACTIVE =
  "a, button, input, select, textarea, label, summary, [role='button'], [role='slider'], [role='tab'], [role='checkbox']";

const SIZE: Record<CursorState, number> = {
  idle: 40,
  interactive: 60,
  button: 8,
  hidden: 40,
};

const SPRING = { stiffness: 380, damping: 32, mass: 0.6 };

function Follower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);
  const [state, setState] = useState<CursorState>("hidden");

  useEffect(() => {
    let current: CursorState = "hidden";
    const set = (next: CursorState) => {
      if (next !== current) {
        current = next;
        setState(next);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (current === "hidden") set("idle");
    };

    // One delegated listener instead of one per element: the state only
    // changes when the pointer crosses into a different kind of target.
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      if (target.closest("[data-cursor='button']")) set("button");
      else if (target.closest(INTERACTIVE)) set("interactive");
      else set("idle");
    };

    const onLeave = () => set("hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  const size = SIZE[state];

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] print:hidden"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="rounded-full"
        initial={false}
        animate={{
          width: size,
          height: size,
          x: -size / 2,
          y: -size / 2,
          opacity: state === "hidden" ? 0 : 1,
          backgroundColor:
            state === "button"
              ? "rgba(204, 61, 46, 1)"
              : state === "interactive"
                ? "rgba(204, 61, 46, 0.05)"
                : "rgba(204, 61, 46, 0)",
          borderColor:
            state === "button" ? "rgba(204, 61, 46, 0)" : "rgba(204, 61, 46, 0.3)",
        }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        style={{ borderWidth: 1, borderStyle: "solid" }}
      />
    </motion.div>
  );
}

/**
 * A ring that trails the mouse on a spring.
 *
 * It grows and tints over anything interactive, and collapses to a solid dot
 * over elements marked `data-cursor="button"`. The native cursor stays: this
 * is a companion to it, not a replacement, so nothing gets harder to aim.
 *
 * Mounted only for a fine pointer on a desktop-width screen, and never with
 * reduced motion, so phones and tablets never load its listeners at all.
 */
export function CursorFollower() {
  const desktop = useMediaQuery(FINE_POINTER_DESKTOP);
  const reduceMotion = useReducedMotion();
  if (!desktop || reduceMotion) return null;
  return <Follower />;
}

export default CursorFollower;
