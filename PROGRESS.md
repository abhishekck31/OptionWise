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
