# data/raw

Put real KEA cutoff PDFs here (one per year/round, or however KEA publishes them).

`make seed` (`apps/web/prisma/seed.ts`) looks here first. If this directory has no
`.pdf` files — as it doesn't yet — it falls back to writing a small, obviously-fake
sample dataset instead (see `apps/web/lib/ingestion/sampleDataset.ts`), per SPEC.md's
data-honesty rule.

The parser (`apps/web/lib/ingestion/parseCutoffRows.ts`) currently expects a specific
extracted-text layout that's a documented placeholder, not something derived from a
real KEA PDF (none was available to inspect — see `AUDIT.md`). Once a real PDF lands
here, check its actual extracted text shape and adjust the parser to match.

PDF files placed here are not committed to git by default treatment of the repo (they
can be large and are source data, not code) unless you decide otherwise for this repo.
