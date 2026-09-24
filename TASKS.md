# Tasks — done top to bottom, one per session

## Foundation
- [x] AUDIT: read the whole repo; write AUDIT.md (stack, how to run, which SPEC features exist / partial / missing, known bugs). Add a Makefile with `make check` (lint/typecheck + tests), `make test`, `make dev`, `make seed`. Get existing tests passing without removing any
- [ ] Hygiene: .env.example, docker-compose for any DB/services needed, README setup steps that actually work, `make seed`
- [ ] Data model + migrations for all SPEC tables with `source` and `is_sample` on every data row; tests
- [ ] Category/quota config file; verify against data/docs if present, else mark UNVERIFIED and note in BLOCKED.md
- [ ] Ingestion: parse KEA cutoff PDFs from data/raw into Cutoff rows with a validation report (row counts, unknown codes, rejected rows). If data/raw is empty, create a small obviously-fake sample dataset (is_sample=true). Tests with small fixture files
- [ ] Sample-data banner: API exposes whether sample data is in use; UI shows a clear banner

## Core predictors
- [ ] Rank predictor (merit score from config weights + interpolation over score-rank points) returning optimistic/likely/conservative + confidence; property tests (higher score never gives worse rank)
- [ ] College predictor: Safe/Target/Reach per college-course across years and rounds with trend adjustment and evidence; tests
- [ ] Option-entry builder logic: preference-ordered list, warnings (too few Safe, Safe above preferred), per-entry explanations; tests
- [ ] Allotment simulator over previous-year rounds; tests
- [ ] Export option list to CSV and printable PDF with codes in order; tests

## Product UI
- [ ] Design system: tokens file (light + dark), fonts, type scale, spacing, core components (button, input, chip, sheet, toast, skeleton, empty/error states), chance chips with label + icon; a /design page showing them all
- [ ] i18n setup: English + Kannada translation files, language switcher, no hard-coded UI strings
- [ ] Onboarding flow: marks, board %, category, quota, preferences (location, fee cap, branches); mobile-first
- [ ] Results page: rank range with confidence + Safe/Target/Reach college list with filters and evidence
- [ ] Option ladder (signature screen): smooth drag-to-reorder with spring motion, keyboard/screen-reader reordering, inline warnings with one-tap fixes, live simulator panel, autosave, undo, export and 'Share with parents' link
- [ ] College page (fees, intake, cutoff trend chart, placement stats with source + year) and compare view (up to 3)

## Alumni connect
- [ ] Auth for student/alumni/admin roles with minimal data collection; authorization tests
- [ ] Alumni signup + admin verification queue + verified badge; 18+ check
- [ ] In-app Q&A/messaging with server-side contact-info filter, report/block, rate limits, moderation queue, audit log; tests

## AI counsellor (multi-agent)
- [ ] services/ai scaffold (FastAPI + LangGraph), LLM provider abstraction (AnthropicProvider + FakeProvider), tool clients for the predictor APIs; tests
- [ ] RulesAgent: ChromaDB RAG over data/docs with source citations (fixture docs in tests)
- [ ] Supervisor + specialist agents graph; agents only use tools for numbers; checkpointing; tests with FakeProvider
- [ ] Guardrails: numeric faithfulness guard, no seat guarantees, untrusted-content handling, token/cost budget, timeouts/retries; tests
- [ ] Observability: structured logs, optional LangSmith via env, cost per conversation stored
- [ ] Eval harness: 30+ golden questions, metrics (tool selection, numeric faithfulness, guarantee refusals), `make eval` offline writing eval/REPORT.md, `make eval-live` stub
- [ ] Counsellor chat UI with visible sources and disclaimers

## Finish
- [ ] UI polish pass: Playwright screenshots of every main page at 360/768/1280px in light and dark into design/screenshots/, review them, fix spacing, hierarchy, copy and states; rank-reveal animation; reduced-motion support
- [ ] Performance + accessibility pass: Lighthouse mobile ≥ 90 on main pages, PWA + offline saved list, axe accessibility checks in tests; fix findings
- [ ] Admin pages: data upload + ingestion report, alumni approvals, moderation queue
- [ ] End-to-end smoke test of main flow: onboarding → predictions → option list → simulate → export
- [ ] Security pass: input validation, rate limiting, authz tests, dependency audit; fix findings
- [ ] Docs: README, ARCHITECTURE.md (with agent graph), DEMO.md (5-minute demo script), known gaps in PROGRESS.md
