"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const MAX_TILT = 3;
const SPRING = { stiffness: 300, damping: 30, mass: 0.5 };

/**
 * A card that tilts towards the mouse, up to 3° on each axis.
 *
 * Only a mouse moves it — `pointerType` is checked on every event, so a tap on
 * a phone or a pen on a tablet never leaves a card stuck at an angle.
 */
export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  // -0.5 … 0.5 across the card.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hover = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), SPRING);
  const scale = useSpring(useTransform(hover, [0, 1], [1, 1.005]), SPRING);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("[transform-style:preserve-3d]", className)}
      style={{ rotateX, rotateY, scale, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - rect.left) / rect.width - 0.5);
        py.set((e.clientY - rect.top) / rect.height - 0.5);
        hover.set(1);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
        hover.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export default TiltCard;
