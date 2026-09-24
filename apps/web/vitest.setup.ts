import { existsSync } from "node:fs";
import path from "node:path";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// We import { describe, it, ... } explicitly from "vitest" rather than using
// Vitest's globals (test.globals is false), so @testing-library/react's own
// auto-cleanup (which only registers itself when it finds Jest/Vitest globals)
// never fires. Register it ourselves so DOM (and Radix portals) don't leak
// between tests in the same file.
afterEach(() => {
  cleanup();
});

const envPath = path.resolve(__dirname, ".env");
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

// Matches docker-compose.yml's db service / the local Postgres this repo expects
// for dev — lets DB-backed tests run without requiring a committed .env.
process.env.DATABASE_URL ??= "postgresql://optionwise:optionwise@localhost:5432/optionwise";
