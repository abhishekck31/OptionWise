# Progress log

## Task 1 — AUDIT

The GitHub repo was actually empty (0 commits), contradicting `SPEC.md`'s "partially
built" claim — see `AUDIT.md` for details. Bootstrapped the foundation instead of
auditing existing code: committed `SPEC.md`/`TASKS.md`/`CLAUDE.md`, scaffolded a pnpm
workspace with `apps/web` (Next.js 16 App Router + TypeScript + Tailwind v4 + Vitest),
and added a root `Makefile` (`check`/`test`/`dev`/`seed`, the last a placeholder until
a data model exists). `make check` (lint + typecheck + one smoke test) is green.

Human should verify: the stack choice in `AUDIT.md` (pnpm/Next.js/Tailwind v4 for the
frontend; DB/ORM and `services/ai` deliberately left undecided for later tasks) matches
what you want before more UI/data work lands on top of it.

## Task 2 — Hygiene

Added `.env.example` (DATABASE_URL, ANTHROPIC_API_KEY, LangSmith vars,
NEXT_TELEMETRY_DISABLED), `docker-compose.yml` (single Postgres 16 service — first
concrete DB choice), a real root `README.md` with setup/run/check steps, and
`make docker-up`/`make docker-down`.

Human should verify: `docker compose up -d` actually reaches a healthy Postgres on
your machine — the build sandbox had no usable Docker daemon so this piece is
untested end-to-end (see AUDIT.md). Nothing in the app depends on it yet.

## Task 3 — Data model + migrations

Added a Prisma 6.19.3 schema (`apps/web/prisma/schema.prisma`) for all 10 SPEC
tables with `source`/`isSample` on every one, an initial migration applied and
verified against a real local Postgres, a `lib/db.ts` client singleton, and
`prisma/__tests__/schema.test.ts` (6 tests: source/isSample persistence, unique
constraints, cascade deletes, alumni 1:1 + PENDING default, message/report/audit-log
shape) — all running against that real Postgres via a new `make db-up`/`db-migrate`
auto-bootstrap (`scripts/ensure-db.sh`), not a mock.

Human should verify: the Prisma 6.x pin (see AUDIT.md — 7/8 changed config format and
8 is still an RC) is the version you want to build on; `Cutoff.categoryCode` is an
unvalidated string until the category/quota config task lands.

## Task 4 — Category/quota config file

Added `config/categories.json` (29 codes: GM + {1,2A,2B,3A,3B,SC,ST} × {G,R,K,H} per
SPEC.md's own example list) and a typed loader (`apps/web/lib/categories.ts`,
`isValidCategoryCode`/`getCategory`) with tests. `data/docs/` doesn't exist in this
repo, so there's nothing to verify against — marked `verified: false` in the file
itself and explained in `BLOCKED.md` (not a stop-the-run blocker, per the task's own
instructions).

Human should verify: get a real KEA rules/brochure PDF into `data/docs/` and re-derive
this file from it before trusting it for a real student — see `BLOCKED.md` for exactly
what's uncertain (GM's suffix variants, possible extra quota categories).

## Task 5 — Ingestion + sample dataset

Added `apps/web/lib/ingestion/` (PDF text extraction via `pdf-parse`, a row parser,
the fake sample dataset, and an orchestrator) and wired `make seed` to run it for
real (`apps/web/prisma/seed.ts`), writing `data/ingestion-report.json`. `data/raw/`
has no PDFs, so `make seed` currently writes the small fake sample dataset (12
cutoff rows, isSample=true) — verified by actually running it against a real local
Postgres. 8 new tests, including two that generate a real PDF with `pdfkit` at test
time and round-trip it through `pdf-parse` (caught and fixed two real extraction
bugs — see AUDIT.md).

Human should verify: the parsed-text format (`# year: N round: N` header +
pipe-delimited rows) is an invented placeholder, not derived from a real KEA PDF —
adjust `parseCutoffRows.ts` once a real one is available to check against (see
`AUDIT.md` Task 5 notes, `BLOCKED.md`).
