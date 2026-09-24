"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { formatCount, formatRank } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * A rank that springs from its last value to the next one. Writes to the node
 * directly, so dragging a slider that feeds it never re-renders per frame.
 */
export function SpringNumber({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduceMotion || previous.current === value) {
      node.textContent = formatRank(value);
      previous.current = value;
      return;
    }
    const controls = animate(previous.current, value, {
      type: "spring",
      stiffness: 90,
      damping: 20,
      restDelta: 1,
      onUpdate: (latest) => {
        node.textContent = formatCount(Math.max(0, Math.round(latest)));
      },
      onComplete: () => {
        node.textContent = formatRank(value);
      },
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, reduceMotion]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {formatRank(value)}
    </span>
  );
}

export default SpringNumber;
