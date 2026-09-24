# OptionWise — Product Spec (source of truth)

Product name: **OptionWise**. Tagline idea: "Smarter option entry, from rank to college." Use this name in the UI, README and docs. Never imply affiliation with KEA or any government body; show "Not affiliated with KEA" in the footer.

Helps Karnataka CET students: predict their rank, see which colleges and courses they can realistically get,
build a smart option-entry list, simulate allotment, compare colleges (fees, cutoffs, placements),
and talk to verified alumni. Includes a multi-agent AI counsellor built to enterprise standards.

This repo is PARTIALLY BUILT. Keep the existing stack and working code. Extend, don't rewrite.

## Users
- **Student** (mostly 17–18 years old): enters marks, category, quota, preferences.
- **Alumni** (18+, verified): answers questions about their college.
- **Admin**: uploads data, approves alumni, moderates.

## Data (accuracy is the product)
- Tables: College, Course (branch), CollegeCourse (college code + course code, fees, intake),
  Cutoff (year, round, category_code, closing_rank), PlacementStat (college, branch, year, median/avg/highest, % placed),
  User, AlumniProfile, Message, Report, AuditLog.
- EVERY data row has `source` (file/URL) and `is_sample` (bool).
- Real data comes from KEA cutoff PDFs placed in `data/raw/` and KEA rules/brochure docs in `data/docs/`.
- If real data is missing, generate a SMALL, clearly fake sample dataset with `is_sample=true`.
  The UI must show a visible "Sample data — not real cutoffs" banner whenever sample data is used.
- NEVER invent real-looking cutoffs, fees, or placement numbers and present them as real.
- Category/quota codes (GM, 1G, 2A, 2B, 3A, 3B, SC, ST with suffixes for general/rural/Kannada-medium/
  Hyderabad-Karnataka etc.) live in ONE config file (`config/categories`). Verify against KEA documents
  in data/docs if present; otherwise mark the file "UNVERIFIED" and note it in BLOCKED.md.

## Features
1. **Rank predictor**: merit score from KCET marks and board PCM % (weights in config, default 50/50,
   marked "verify against current KEA rules"). Maps score → rank using historical score-rank points with
   interpolation. Output is ALWAYS a range (optimistic / likely / conservative) plus confidence. Never a single number.
2. **College predictor**: for a rank range + category + quota + filters (location, fee cap, branches),
   classify each college-course as Safe / Target / Reach using multiple years and rounds of cutoffs,
   with a simple trend adjustment. Show the evidence (past closing ranks).
3. **Option-entry builder**: KEA allots the highest option on your list that you qualify for, so the list must be
   ordered by the student's TRUE preference, never by probability. The optimizer's job: remove options the
   student would never accept, warn when there are too few Safe options, flag Reach options placed where
   they waste nothing (fine) vs. Safe options placed above options they prefer (warn), and explain each entry.
   Drag-to-reorder UI.
4. **Allotment simulator**: simulate rounds against previous-year cutoffs for the student's list and rank range;
   show likely outcome per round. Labelled "simulation based on last year's data".
5. **Export**: printable PDF/CSV of the option list with college code + course code in order.
6. **College pages & compare**: fees, intake, cutoff trend chart, placement stats (with source + year), location.
7. **Alumni connect (safety first)**: alumni sign up → admin verification queue → approved badge.
   Students ask questions in-app only. No phone numbers, emails, or social handles may be exchanged
   (server-side filter). Report/block, rate limits, moderation queue, audit log. Alumni must be 18+.
8. **AI counsellor (multi-agent)**: chat that answers counselling questions.
   - Python service `services/ai` (FastAPI + LangGraph) unless the repo already has a Python backend to reuse.
   - Supervisor agent routes to specialist agents: RankAgent, CollegeAgent, OptionListAgent, RulesAgent (RAG over
     data/docs with ChromaDB), CollegeInfoAgent.
   - Agents get ALL numbers from deterministic tools/APIs (the predictors above). They never produce cutoffs,
     ranks or fees from their own knowledge.
   - LLM client abstraction: `AnthropicProvider` (API key from env) and `FakeProvider` for tests.
     ALL automated tests use FakeProvider. No live LLM calls in tests.

## UI / UX (a core feature, not decoration)

The bar: it should feel as smooth and considered as the best consumer apps students already use,
and clearly better than any existing college-predictor site. Every screen should be calm, fast, and obvious.

### Who we design for
- 17–18 year olds on mid-range Android phones, often on patchy mobile data, and their parents looking over their shoulder.
- They are anxious and deciding something big. The UI's job is to lower stress: clear answers, plain language, no clutter, no dark patterns.
- Mobile-first (design at 360px first), then tablet and desktop.

### Visual direction
- Identity: "calm confidence". Clean cool-white surfaces, deep ink text, one confident brand blue, and a
  three-colour chance system that the whole product is built around.
- Design tokens (single source in one file, light + dark themes):
  - Ink `#1B1F3B` (text), Surface `#F5F7FA` (background), Card `#FFFFFF`, Brand `#2E4BD6`
  - Chance colours: Safe `#1F8A5B`, Target `#C98A12`, Reach `#7A4FD6`; Error `#C8412F`
  - Chance is NEVER shown by colour alone: always a label + icon too (colour-blind safe).
  - Dark theme derived from the same tokens with AA contrast.
- Type: **Bricolage Grotesque** for headings, **Manrope** for UI and body, **Noto Sans Kannada** for Kannada.
  Tabular figures for all ranks, cutoffs and fees so numbers align. A clear type scale; sentence case everywhere.
- Spacing on a 4px grid; radius varies by hierarchy (sheets and modals larger, chips small), not one radius on everything.
- Avoid template clichés: no ALL-CAPS eyebrow labels over every heading, no identical card grids with the same
  grey shadow everywhere, no gradient washes as decoration, no "→" appended to every button.

### The signature moment: the option ladder
The option-entry builder is where we spend our boldness. It should feel like physically arranging a ranked list:
- Smooth drag-to-reorder with spring physics and haptic feedback on mobile (where supported).
- Each row shows college + course, a chance chip, and a one-line reason. Tap to expand for cutoff evidence.
- Warnings appear inline on the exact row that causes them ("This safe option sits above 3 colleges you prefer"),
  with a one-tap fix.
- The simulator sits right under the list and updates live as the student reorders.
- Full keyboard and screen-reader support for reordering (move up / move down buttons, announced positions).

### Key flows and how they should feel
- **Onboarding:** 3 short steps with a progress indicator, under 60 seconds. Smart defaults, number inputs with
  the right mobile keyboard, inline validation, and a "why we ask" hint for category and quota.
- **Rank reveal:** the one orchestrated animation in the app. The rank range builds in with a short, satisfying
  motion, then reads in plain words: "You'll most likely get a rank between 8,200 and 11,500."
- **College list:** filter chips that stick while scrolling, a Safe / Target / Reach segmented view, instant
  filtering, and a compare tray (up to 3) that slides up from the bottom.
- **College page:** fees, cutoff trend chart, placement numbers with source and year, all scannable in one screen on mobile.
- **Counsellor chat:** streaming responses, visible sources for every number, suggested follow-up questions.
- **Sharing:** "Share with parents" creates a clean read-only link and a printable PDF of the option list.

### Interaction quality
- Motion: purposeful and quick (150–250ms), only in response to user actions plus the single rank reveal.
  Respect `prefers-reduced-motion`.
- Skeleton loaders shaped like the real content; optimistic updates; autosave of the option list; undo for every destructive action.
- Empty states tell the student what to do next; errors say what happened and how to fix it, never vague.
- Copy: plain student language, active voice, sentence case. Buttons say exactly what happens ("Save my list", "Compare 3 colleges").
  Jargon like "round", "category" and "quota" gets a short inline explainer.
- English and Kannada, switchable anywhere, with all strings in translation files (no hard-coded UI text).

### Quality floor (must be checked, not assumed)
- WCAG 2.2 AA: contrast, visible focus rings, labels, 44px minimum touch targets.
- Performance on a mid-range phone over 4G: LCP under 2.5s, no layout shift, small JS bundles, lazy-loaded charts.
- Installable PWA; the saved option list works offline.
- Lighthouse (mobile) ≥ 90 for Performance, Accessibility, Best Practices and SEO on the main pages.
- Playwright screenshots of every main page at 360px, 768px and 1280px, in light and dark, saved to `design/screenshots/`,
  reviewed and improved in a dedicated polish pass.
- If the repo already uses a component library (for example shadcn/ui + Radix), build on it; otherwise use Radix
  primitives for accessible behaviour and style them with the tokens above. Framer Motion (or the existing
  animation library) for motion.

## Enterprise-readiness layer (must exist, must be tested)
- Numeric faithfulness guard: every number in a final answer must appear in that turn's tool outputs, else the answer is regenerated or the number removed.
- Refuses to guarantee seats; always states uncertainty.
- Alumni and user content is untrusted input (prompt-injection hygiene).
- Per-conversation token/cost budget, timeouts, retries with backoff, LangGraph checkpointing.
- Structured logs; optional LangSmith tracing via env; cost per conversation recorded.
- Evaluation harness `eval/`: golden set (30+ questions) checking tool selection, numeric faithfulness,
  refusal-of-guarantees; RAG eval with RAGAS when live. `make eval` runs offline with FakeProvider and writes eval/REPORT.md.
  `make eval-live` exists but is NOT run overnight.

## Non-goals (for now)
Payments, mobile apps, COMEDK/JoSAA, scraping websites at scale.
