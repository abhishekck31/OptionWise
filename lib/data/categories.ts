import { CATEGORIES, CATEGORY_KEYS, type Category } from "@/types";

export { CATEGORIES, CATEGORY_KEYS };
export type { Category };

/** The printable name for a category, e.g. "General Merit". */
export function getCategoryLabel(category: Category): string {
  return CATEGORIES[category];
}

/** Ready to feed a <select>. */
export const CATEGORY_OPTIONS = CATEGORY_KEYS.map((id) => ({
  id,
  label: `${CATEGORIES[id]} (${id})`,
}));

/**
 * Every category in the union appears in the KEA reports, so all of them can
 * be predicted against.
 */
export const PREDICTABLE_CATEGORIES: Category[] = CATEGORY_KEYS;
