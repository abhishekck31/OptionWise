import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
    // DB-backed tests share one real Postgres and TRUNCATE the same tables in
    // beforeAll/afterEach — running test files in parallel races those truncates
    // against each other. Keep this false until DB-backed tests get their own
    // isolated schema/transaction per file.
    fileParallelism: false,
  },
});
