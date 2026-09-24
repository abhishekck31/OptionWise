# Rules for this repo (unattended overnight run — nobody can answer questions)

- SPEC.md is the source of truth. AUDIT.md (written in task 1) describes what already exists.
- Keep the existing stack and working code. Extend, don't rewrite. Never delete working features.
- ONE task per session: the first unchecked `- [ ]` line in TASKS.md.
- Done = code + tests, and `make check` passes (lint/typecheck + all tests).
- When done: tick it (`- [x]`), append 2–4 lines to PROGRESS.md (what changed, what the human should verify), git commit.
- If blocked after a real attempt: leave everything compiling, explain in BLOCKED.md, commit, stop.
- Data honesty: never fabricate real-looking cutoffs, ranks, fees or placement numbers. Sample data must have is_sample=true and be obviously fake.
- Tests never call real LLMs or external APIs. Use FakeProvider and fixtures. Never spend API credits in tests.
- Never commit secrets. Use .env.example with placeholders.
- Never weaken or delete tests to make them pass.
- Users are minors: collect minimal personal data, no contact details exchanged via alumni chat.
- Keep commits small and focused. Don't reformat unrelated files.
- UI work follows the 'UI / UX' section of SPEC.md: use the design tokens only (no ad-hoc colours or fonts), mobile-first at 360px, every user-facing string through the translation files, and take Playwright screenshots to check your UI work visually.
