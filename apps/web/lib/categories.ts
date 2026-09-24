import categoriesConfig from "../../../config/categories.json";

export interface QuotaSuffix {
  code: string;
  label: string;
}

export interface CategoryCode {
  code: string;
  label: string;
  base: string;
  quota: string | null;
}

export interface CategoriesConfig {
  verified: boolean;
  verificationNote: string;
  quotaSuffixes: QuotaSuffix[];
  categories: CategoryCode[];
}

const config = categoriesConfig as CategoriesConfig;

export const CATEGORIES: readonly CategoryCode[] = config.categories;
export const QUOTA_SUFFIXES: readonly QuotaSuffix[] = config.quotaSuffixes;
export const CATEGORIES_VERIFIED: boolean = config.verified;

const byCode = new Map(CATEGORIES.map((category) => [category.code, category]));

export function isValidCategoryCode(code: string): boolean {
  return byCode.has(code);
}

export function getCategory(code: string): CategoryCode | undefined {
  return byCode.get(code);
}

export interface CategoryBase {
  base: string;
  /** Whether this base needs a quota suffix chosen too (all except GM, which has no
   * suffixed variants in config/categories.json — see BLOCKED.md). */
  hasQuota: boolean;
}

/** The distinct category bases (e.g. "GM", "1", "2A", ...), in config file order. */
export function getCategoryBases(): CategoryBase[] {
  const seen = new Map<string, boolean>();
  for (const category of CATEGORIES) {
    if (!seen.has(category.base)) {
      seen.set(category.base, category.quota !== null);
    }
  }
  return [...seen.entries()].map(([base, hasQuota]) => ({ base, hasQuota }));
}

/** Combines a category base + quota suffix (as chosen separately in onboarding) back
 * into the single categoryCode used everywhere else (Cutoff rows, predictors). */
export function findCategoryByBaseAndQuota(base: string, quota: string | null): CategoryCode | undefined {
  return CATEGORIES.find((c) => c.base === base && c.quota === quota);
}
