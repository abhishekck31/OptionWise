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

// jsdom doesn't implement the Pointer Capture APIs at all, which Radix primitives
// (e.g. Toast's swipe-to-dismiss gesture) call unconditionally on pointer events —
// without these no-op stubs, clicking inside such a component throws
// "target.hasPointerCapture is not a function" in jsdom-based tests.
if (typeof Element !== "undefined") {
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.setPointerCapture ??= () => {};
  Element.prototype.releasePointerCapture ??= () => {};
}

const envPath = path.resolve(__dirname, ".env");
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

// Matches docker-compose.yml's db service / the local Postgres this repo expects
// for dev — lets DB-backed tests run without requiring a committed .env.
process.env.DATABASE_URL ??= "postgresql://optionwise:optionwise@localhost:5432/optionwise";
