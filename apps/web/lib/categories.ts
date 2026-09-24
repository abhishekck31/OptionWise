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
