# messages/

Translation files for `next-intl` — one JSON file per locale (`en.json`, `kn.json`),
same key structure in both.

**`kn.json`'s Kannada text is a best-effort LLM translation, not reviewed by a native
Kannada speaker.** This product is specifically for Karnataka students, so translation
accuracy matters a lot — a native speaker should review `kn.json` (grammar, tone,
whether "OptionWise" / KEA-specific terms should stay in English, etc.) before this
ships to real users. Flagging this the same way `config/categories.json` and
`config/rankPredictor.json` flag their own unverified assumptions (see `BLOCKED.md`).

Add new keys to **both** files together — never let `kn.json` fall behind `en.json`.
