#!/usr/bin/env bash
# Makes sure a local Postgres matching docker-compose.yml / .env.example is
# reachable, starting it if needed. Used by `make test` / `make check` so DB-backed
# tests don't require a human to have started anything first.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# apps/web (Next.js + Prisma) reads its own .env — bootstrap it from the template so
# `prisma migrate deploy` has a DATABASE_URL even on a fresh clone. Never overwrites
# an existing one.
if [ ! -f "$REPO_ROOT/apps/web/.env" ] && [ -f "$REPO_ROOT/.env.example" ]; then
  cp "$REPO_ROOT/.env.example" "$REPO_ROOT/apps/web/.env"
  echo "[db] Created apps/web/.env from .env.example."
fi

HOST="${PGHOST:-localhost}"
PORT="${PGPORT:-5432}"
DB_USER="optionwise"
DB_PASSWORD="optionwise"
DB_NAME="optionwise"

is_ready() {
  pg_isready -h "$HOST" -p "$PORT" >/dev/null 2>&1
}

if ! is_ready; then
  echo "[db] Postgres not reachable on $HOST:$PORT — trying to start it."
  service postgresql start >/dev/null 2>&1 || true
  if ! is_ready && command -v docker >/dev/null 2>&1; then
    (cd "$(dirname "$0")/.." && docker compose up -d db) >/dev/null 2>&1 || true
  fi
  for _ in $(seq 1 30); do
    is_ready && break
    sleep 1
  done
fi

if ! is_ready; then
  echo "[db] Postgres still not reachable. Start it yourself (service postgresql start, or make docker-up) and re-run." >&2
  exit 1
fi

if ! PGPASSWORD="$DB_PASSWORD" psql -h "$HOST" -p "$PORT" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT 1" >/dev/null 2>&1; then
  echo "[db] Creating role/database '$DB_NAME'."
  sudo -u postgres psql -v ON_ERROR_STOP=0 -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD' CREATEDB;" >/dev/null 2>&1 || true
  sudo -u postgres psql -v ON_ERROR_STOP=0 -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" >/dev/null 2>&1 || true
fi

echo "[db] Ready at postgresql://$DB_USER:***@$HOST:$PORT/$DB_NAME"
