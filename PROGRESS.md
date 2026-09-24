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

## Task 6 — Sample-data banner

Added `GET /api/sample-data-status` and a `SampleDataBanner` Server Component
(mounted in `app/layout.tsx`, `dynamic = "force-dynamic"` since it reads live DB
state) that shows SPEC.md's exact "Sample data — not real cutoffs" notice whenever
any `Cutoff` row has `isSample: true`. Verified with `make build` (still succeeds)
and a real screenshot (`design/screenshots/home-with-sample-banner.png`) after
running `make seed`. Added 4 of SPEC.md's design tokens (Ink/Surface/Card/Brand,
light mode only) to `app/globals.css` for the banner to use instead of ad-hoc colours.

Human should verify: dark-mode styling on the banner is a Tailwind stopgap, not
derived tokens — revisit once the "Design system" task lands real dark-mode values.

## Core predictors: Rank predictor

Added `apps/web/lib/predictors/rankPredictor.ts` (merit score from KCET marks/board
PCM%, piecewise-linear interpolation over `config/rankPredictor.json`, always
optimistic/likely/conservative + confidence, never a single number) and
`config/rankPredictor.json` (weights + score-rank curve). 11 example tests + 2
`fast-check` property tests (500 runs each): higher merit score never yields a worse
likely rank, and optimistic ≤ likely ≤ conservative always holds.

Human should verify: `config/rankPredictor.json`'s `scoreRankPoints` are fabricated
placeholder numbers, not real historical KCET results — see `BLOCKED.md`. Every
prediction carries `basedOnSampleData: true` until that's replaced with real data.

## Core predictors: College predictor

Added `apps/web/lib/predictors/collegePredictor.ts` (pure Safe/Target/Reach
classifier: latest-round-per-year evidence, simple two-year trend extrapolation,
configurable safe/reach margins) and `predictColleges.ts` (DB-facing: rank + category
+ location/fee/branch filters -> classified college-courses with evidence). 15 tests:
6 example-based, 2 `fast-check` property tests (better rank never gets a worse
classification, evidence always sorted/deduped by year), and 3 DB-integration tests
against real Postgres (classification, filters, "no evidence" skip).

Human should verify: the 15%/15%/0.5 threshold and trend-weight constants in
`config/collegePredictor.json` are reasonable defaults, not validated against real
admission outcomes.

## Core predictors: Option-entry builder logic

Added `apps/web/lib/optionBuilder/optionBuilder.ts` (`buildOptionList`): filters
unacceptable candidates, explains each remaining entry by tier, and warns on too few
Safe options or a Safe option shadowing a later Reach option. 10 tests: 8
example-based, 2 `fast-check` property tests (warnings exactly match a from-scratch
reference computation; filtering never drops/duplicates a candidate).

Human should verify: SPEC.md's "Safe options placed above options they prefer"
wording is genuinely ambiguous — see AUDIT.md's Option-entry builder notes for the
specific reading implemented (Safe-before-Reach only) and why. If that's not the
intended product behavior, this needs revisiting, not just extending.

## Core predictors: Allotment simulator

Added `apps/web/lib/simulator/allotmentSimulator.ts` (pure, round-by-round,
upgrade-only allotment simulation) and `simulateAllotmentForStudent.ts` (DB wrapper:
finds the most recent cutoff year for the given college-courses/category and
simulates against it). 10 tests: 5 example-based, 2 `fast-check` property tests (a
held seat is never lost or downgraded round over round), 3 DB-integration tests
(most-recent-year selection, no-data case, a real two-round upgrade scenario).

Human should verify: nothing new — this task didn't introduce any unverified data,
just simulation logic over cutoffs that already exist in the DB.

## Core predictors: Export (CSV + PDF)

Added `apps/web/lib/export/exportOptionList.ts`: `optionListToCsv` and
`optionListToPdf` (real PDF via `pdfkit`, now a production dependency), both pure
functions over an option-entry array, college code + course code in list order per
SPEC.md. 6 tests, including one that round-trips the generated PDF through
`pdf-parse` to verify codes actually appear in order in the rendered text.

This completes TASKS.md's "Core predictors" section.

Human should verify: nothing new to flag — no download route/button exists yet
(that's the "Option ladder" UI task's job), just the generation logic.

## Design system

Full light+dark token set in `app/globals.css` (Ink/Surface/Card/Brand/Safe/Target/
Reach/Error), Bricolage Grotesque/Manrope/Noto Sans Kannada fonts, and 8 core
components (`apps/web/components/ui/`: button, input, chip + chance chip, sheet,
toast, skeleton, empty state, error state) built on newly-added `radix-ui` + `motion`
+ `clsx`/`tailwind-merge`. `/design` page shows/exercises them all. Updated the
existing home page and sample-data banner to use real tokens instead of ad-hoc
Tailwind colours. 15 new component tests (91 total now). Screenshots at 360/1280px,
light+dark, plus Sheet-open/Toast-open, in `design/screenshots/`.

Human should verify: SPEC's literal Safe/Target chance colours fail WCAG AA contrast
for text on their own — see AUDIT.md's Task 17 notes for the exact numbers and the
darkened `-text` variants used instead (this is a disclosed, deliberate deviation
from the literal hex values, made in favor of SPEC's equally-explicit AA requirement,
not an oversight). Dark-mode token values are this session's own derivation, not
literally specified anywhere — sanity-check them against a real device if possible.

## i18n setup

`next-intl` with full App Router locale routing (`/en/...`, `/kn/...`, default
`en`), not just a message catalog — `app/` restructured to `app/[locale]/...`.
`messages/en.json` + `messages/kn.json`, a `LanguageSwitcher` in the root layout (so
it's on every page), and every current product string (home page, sample-data
banner, chance chip labels) now goes through translations. Verified live in a real
browser, not just tests: `/` redirects to `/en`, `/kn` renders fully in Kannada with
the correct font, and clicking the switcher actually navigates `/en` → `/kn`
(screenshots in `design/screenshots/`). Also fixed a real Next.js 16 deprecation
(`middleware.ts` → `proxy.ts`) noticed along the way.

Human should verify: `messages/kn.json`'s Kannada text is an LLM best-effort
translation, not reviewed by a native speaker — see `messages/README.md` and
`BLOCKED.md`. Also note `/design` itself stays English-only on purpose (it's a
developer tool, not product UI) — see AUDIT.md's Task 18 notes.
