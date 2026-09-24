import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Defaults to .next. Set NEXT_DIST_DIR to build somewhere else, which is
  // useful when another process is holding the default directory open.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // The marks-to-rank predictor is retired and the explorer became the
  // year-wise cut-off browser; old links land on their replacements.
  async redirects() {
    return [
      { source: "/predict/rank", destination: "/predict/college", permanent: false },
      { source: "/explore", destination: "/cutoffs", permanent: false },
    ];
  },
};

export default nextConfig;
