import { findCategoryByBaseAndQuota } from "@/lib/categories";

export interface OnboardingAnswers {
  kcetMarks: string;
  boardPcmPercent: string;
  categoryBase: string;
  categoryQuota: string;
  location: string;
  maxFeesInr: string;
  branches: string;
}

export const EMPTY_ANSWERS: OnboardingAnswers = {
  kcetMarks: "",
  boardPcmPercent: "",
  categoryBase: "",
  categoryQuota: "",
  location: "",
  maxFeesInr: "",
  branches: "",
};

/** Every error message this module can return, as an i18n key under the
 * "Onboarding" namespace (not an English string — the UI translates them). Listing
 * them as a union (matching messages/en.json's "errors" keys exactly) lets
 * next-intl's typed `t()` check these calls at compile time, same as any other
 * translation key. */
export type OnboardingErrorKey =
  | "errors.kcetMarksRequired"
  | "errors.kcetMarksRange"
  | "errors.boardPcmPercentRequired"
  | "errors.boardPcmPercentRange"
  | "errors.categoryBaseRequired"
  | "errors.categoryQuotaRequired"
  | "errors.categoryInvalid"
  | "errors.maxFeesInrRange";

export type FieldErrors = Partial<Record<keyof OnboardingAnswers, OnboardingErrorKey>>;

function validateRequiredNumber(
  raw: string,
  min: number,
  max: number,
  requiredKey: OnboardingErrorKey,
  rangeKey: OnboardingErrorKey,
): OnboardingErrorKey | undefined {
  if (raw.trim() === "") return requiredKey;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) return rangeKey;
  return undefined;
}

export function validateMarksStep(answers: OnboardingAnswers): FieldErrors {
  const errors: FieldErrors = {};
  const kcetError = validateRequiredNumber(answers.kcetMarks, 0, 180, "errors.kcetMarksRequired", "errors.kcetMarksRange");
  if (kcetError) errors.kcetMarks = kcetError;
  const boardError = validateRequiredNumber(
    answers.boardPcmPercent,
    0,
    100,
    "errors.boardPcmPercentRequired",
    "errors.boardPcmPercentRange",
  );
  if (boardError) errors.boardPcmPercent = boardError;
  return errors;
}

export function validateCategoryStep(answers: OnboardingAnswers): FieldErrors {
  const errors: FieldErrors = {};
  if (answers.categoryBase.trim() === "") {
    errors.categoryBase = "errors.categoryBaseRequired";
    return errors;
  }
  const quota = answers.categoryBase === "GM" ? null : answers.categoryQuota || null;
  if (answers.categoryBase !== "GM" && !quota) {
    errors.categoryQuota = "errors.categoryQuotaRequired";
    return errors;
  }
  if (!findCategoryByBaseAndQuota(answers.categoryBase, quota)) {
    errors.categoryBase = "errors.categoryInvalid";
  }
  return errors;
}

function validateOptionalNumber(raw: string, min: number, rangeKey: OnboardingErrorKey): OnboardingErrorKey | undefined {
  if (raw.trim() === "") return undefined;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min) return rangeKey;
  return undefined;
}

export function validatePreferencesStep(answers: OnboardingAnswers): FieldErrors {
  const errors: FieldErrors = {};
  const feeError = validateOptionalNumber(answers.maxFeesInr, 0, "errors.maxFeesInrRange");
  if (feeError) errors.maxFeesInr = feeError;
  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** The categoryCode this repo's predictors expect (config/categories.json), derived
 * from the separately-chosen base + quota. */
export function resolveCategoryCode(answers: OnboardingAnswers): string | undefined {
  const quota = answers.categoryBase === "GM" ? null : answers.categoryQuota || null;
  return findCategoryByBaseAndQuota(answers.categoryBase, quota)?.code;
}
