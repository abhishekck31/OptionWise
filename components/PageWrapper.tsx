"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * The enter animation every route shares.
 *
 * Mounted inside each page rather than the layout, so it replays on
 * navigation. Pass `py-0` through `className` for a page that opens on a
 * full-bleed hero.
 */
export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("py-8 md:py-12", className)}
    >
      {children}
    </motion.div>
  );
}

export default PageWrapper;
