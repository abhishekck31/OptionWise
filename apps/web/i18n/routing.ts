import { defineRouting } from "next-intl/routing";

// SPEC.md "UI / UX": "English and Kannada, switchable anywhere."
export const routing = defineRouting({
  locales: ["en", "kn"],
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];
