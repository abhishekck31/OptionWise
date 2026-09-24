.PHONY: install check lint typecheck test dev seed build docker-up docker-down db-up db-migrate

# Install all workspace dependencies.
install:
	pnpm install

# Start local dev services (currently just Postgres; nothing uses it yet).
docker-up:
	docker compose up -d

# Stop local dev services.
docker-down:
	docker compose down

# Lint the web app.
lint:
	pnpm run lint

# Type-check the web app.
typecheck:
	pnpm run typecheck

# Make sure a local Postgres matching .env.example is reachable (starts one if not).
db-up:
	bash scripts/ensure-db.sh

# Apply pending Prisma migrations.
db-migrate: db-up
	pnpm --filter web exec prisma migrate deploy

# Run all tests (FakeProvider / fixtures only — never live LLMs or external APIs).
test: db-migrate
	pnpm run test

# Everything CI / a human should run before calling a task done.
check: lint typecheck test

# Start the local dev server(s).
dev:
	pnpm run dev

# Populate local dev data: ingest data/raw/*.pdf, or a small fake sample dataset if
# there are none. Writes data/ingestion-report.json. See apps/web/prisma/seed.ts.
seed: db-migrate
	pnpm --filter web exec tsx prisma/seed.ts

# Production build of the web app.
build:
	pnpm run build
