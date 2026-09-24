.PHONY: install check lint typecheck test dev seed build docker-up docker-down

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

# Run all tests (FakeProvider / fixtures only — never live LLMs or external APIs).
test:
	pnpm run test

# Everything CI / a human should run before calling a task done.
check: lint typecheck test

# Start the local dev server(s).
dev:
	pnpm run dev

# Populate local dev data. Currently a no-op placeholder — see scripts/seed.mjs.
seed:
	node scripts/seed.mjs

# Production build of the web app.
build:
	pnpm run build
