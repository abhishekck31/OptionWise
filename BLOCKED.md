# Blocked items

Not a stop-the-run blocker — noted here because the "Category/quota config file" task
in `TASKS.md` explicitly says to do this when `data/docs/` has nothing to verify
against, and to keep going. Everything still compiles and `make check` passes.

## `config/categories.json` is UNVERIFIED

`data/docs/` doesn't exist in this repo — there's no KEA rules/brochure document to
check the category/quota codes against. `config/categories.json` was built by
mechanically expanding SPEC.md's own example list ("GM, 1G, 2A, 2B, 3A, 3B, SC, ST
with suffixes for general/rural/Kannada-medium/Hyderabad-Karnataka etc.") into the 29
codes that pattern implies (GM standalone, plus each of 1/2A/2B/3A/3B/SC/ST × G/R/K/H).
That's a reasonable reading of the spec and matches the general shape of real KCET
category codes, but it is **not sourced from an official KEA document** and must not
be trusted as authoritative — in particular:

- Whether GM itself ever takes a quota suffix (GMK/GMR/etc.) in current KEA rules is
  unknown; this file only defines bare `GM`.
- The "etc." in SPEC.md's own wording hints at possibly more categories/quotas
  (e.g. PWD, NCC, sports, defence, NRI) that aren't represented here at all.
- Exact current-year label text, eligibility rules, and whether every base × suffix
  combination is actually valid for every KEA round are all unverified.

**What should happen next**: a human places a real KEA rules/brochure PDF (or similar
official document) into `data/docs/`. A future session — or a human — should then
re-derive `config/categories.json` from it, set `"verified": true`, and add a `source`
field pointing at that document. Until then, nothing downstream should treat this file
as ground truth for real students; it's a structurally-correct placeholder.

## `config/rankPredictor.json` is UNVERIFIED

Same root cause: no `data/docs/` KEA rules document and no real historical
score-to-rank results were available. Two things in this file are unverified:

- The 50/50 KCET-marks/board-PCM% weighting and the 180-mark KCET scale — these
  follow SPEC.md's own description of the merit-score formula (which itself says
  "verify against current KEA rules"), not an official document.
- `scoreRankPoints` — the (meritScore, rank) points the rank predictor interpolates
  between are **entirely fabricated**, round, obviously-placeholder numbers (rank 1 at
  merit 100, rank 250000 at merit 0, etc.), not real historical KCET results. The
  interpolation logic (`apps/web/lib/predictors/rankPredictor.ts`) is real and tested;
  the curve it interpolates over is not.

**What should happen next**: once real historical score-vs-rank data (or at least a
real KEA rules document with the actual formula) is available, replace
`scoreRankPoints` and the weights, and set `"verified": true` with a `source`. Until
then, `rankPredictor.ts` returns a `basedOnSampleData: true` flag on every result so
callers (and eventually the UI) can surface that the prediction isn't backed by real
data yet.

## `messages/kn.json`'s Kannada text is an LLM best-effort translation

Same shape of caveat as the two entries above, different reason: `messages/kn.json`
(next-intl's Kannada translation file) was written by this session without a native
Kannada speaker to check it. The strings are small and simple right now (a handful of
sentences), so the risk is lower than fabricated cutoff data, but this product is
specifically for Karnataka students — translation quality (grammar, natural phrasing,
whether product/KEA-specific terms should stay in English) genuinely matters and
hasn't been verified by anyone who speaks the language natively.

**What should happen next**: a native Kannada speaker reviews `messages/kn.json`
before this ships to real users, and reviews it again each time new keys are added
(see `messages/README.md`).
