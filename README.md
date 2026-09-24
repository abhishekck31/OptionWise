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

Early. Only the app shell and dev tooling exist so far — see `AUDIT.md` for the
current, honest feature-by-feature status. There is **no database wiring, no
predictors, and no AI service yet**; those land in upcoming tasks.

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
make docker-up       # start local Postgres (nothing reads from it yet)
make docker-down     # stop it
```

## Checks

```bash
make check           # lint + typecheck + all tests — must pass before any task is "done"
make lint
make typecheck
make test
make seed            # currently a no-op placeholder; see scripts/seed.mjs
make build            # production build of apps/web
```

## Repo layout

```
apps/web/       Next.js (App Router, TypeScript, Tailwind) frontend
scripts/         Small repo-maintenance scripts (e.g. seed.mjs)
data/raw/        KEA cutoff PDFs go here (not yet used)
data/docs/       KEA rules/brochure docs go here (not yet used)
config/          Single-source config, e.g. category/quota codes (not yet created)
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
