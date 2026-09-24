import { existsSync } from "node:fs";
import path from "node:path";
import "@testing-library/jest-dom/vitest";

const envPath = path.resolve(__dirname, ".env");
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

// Matches docker-compose.yml's db service / the local Postgres this repo expects
// for dev — lets DB-backed tests run without requiring a committed .env.
process.env.DATABASE_URL ??= "postgresql://optionwise:optionwise@localhost:5432/optionwise";
