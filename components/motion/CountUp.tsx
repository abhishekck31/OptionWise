"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A figure that counts up from zero the first time it scrolls into view.
 *
 * The server renders the real value, so the number is correct without
 * JavaScript and for anything reading the markup; the count only replays it.
 */
export function CountUp({
  value,
  duration = 1.2,
  className,
  format = (n) => Math.round(n).toLocaleString("en-IN"),
}: {
  value: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const formatRef = useRef(format);
  formatRef.current = format;

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        node.textContent = formatRef.current(latest);
      },
      onComplete: () => {
        node.textContent = formatRef.current(value);
      },
    });
    return () => controls.stop();
  }, [inView, value, duration, reduceMotion]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(value)}
    </span>
  );
}

export default CountUp;
