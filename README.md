# OptionWise

Smarter option entry, from rank to college.

Helps Karnataka CET students predict their rank, see which colleges and courses they
can realistically get, build a smart option-entry list, simulate allotment, compare
colleges, and talk to verified alumni. **Not affiliated with KEA or any government
body.**

`SPEC.md` is the source of truth for the product. `TASKS.md` tracks build order.
`AUDIT.md` and `PROGRESS.md` track what actually exists and what changed, commit by
commit — read those before assuming a feature below is finished.

## Status

Early. The app shell, database schema/migrations, category/quota config, and a KEA
PDF ingestion pipeline (falling back to a small fake sample dataset) exist — see
`AUDIT.md` for the current, honest feature-by-feature status. There are **no
predictors, no UI beyond a placeholder home page, and no AI service yet**; those land
in upcoming tasks.

## Prerequisites

- Node.js 22+ and [pnpm](https://pnpm.io) 10+ (`corepack enable` will get you the
  right pnpm version from `packageManager` in `package.json`)
- Docker (for local Postgres, once something uses it)
- Python 3.11+ (only needed once `services/ai` exists)

## Setup

```bash
git clone https://github.com/abhishekck31/OptionWise.git
cd OptionWise
cp .env.example apps/web/.env   # apps/web (Next.js + Prisma) reads its own .env
pnpm install                     # or: make install
```

## Running

```bash
make dev            # Next.js dev server (apps/web) at http://localhost:3000
make docker-up       # start local Postgres via docker-compose
make docker-down     # stop it
make db-up           # make sure Postgres is reachable (starts it if not — see scripts/ensure-db.sh)
make db-migrate      # apply Prisma migrations
```

## Checks

```bash
make check           # lint + typecheck + all tests — must pass before any task is "done"
make lint
make typecheck
make test
make seed            # ingest data/raw/*.pdf, or write a small fake sample dataset if none
make build            # production build of apps/web
```

`make test`/`make check` need a reachable Postgres (they run `make db-migrate` first,
which starts one automatically via `scripts/ensure-db.sh` if possible).

## Repo layout

```
apps/web/       Next.js (App Router, TypeScript, Tailwind, Prisma) frontend + data layer
scripts/         Small repo-maintenance scripts (e.g. ensure-db.sh)
data/raw/        KEA cutoff PDFs go here — see data/raw/README.md (empty right now)
data/docs/       KEA rules/brochure docs go here — see data/docs/README.md (empty right now)
config/          Single-source config, e.g. categories.json (category/quota codes)
SPEC.md          Product spec — source of truth
TASKS.md         Build order, one unchecked item at a time
AUDIT.md         What exists vs. SPEC.md, written/updated as the repo grows
PROGRESS.md      Short log of what changed in each completed task
```

## Contributing / working style

This repo is built one `TASKS.md` item at a time, each as its own small commit with
tests, verified by `make check`. See `CLAUDE.md` for the exact rules this project is
developed under (data honesty, no live LLM calls in tests, minimal data collection for
minors, etc.).
