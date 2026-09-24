import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** A loading placeholder shaped like the real content (SPEC.md "UI / UX" -> Skeleton
 * loaders shaped like the real content). Respects prefers-reduced-motion via
 * motion-reduce: (no pulsing, just a static tint). */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-ink/10 motion-reduce:animate-none", className)}
      {...props}
    />
  );
}
