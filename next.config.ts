import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Defaults to .next. Set NEXT_DIST_DIR to build somewhere else, which is
  // useful when another process is holding the default directory open.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
