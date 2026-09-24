import { describe, expect, it } from "vitest";
import {
  EMPTY_ANSWERS,
  hasErrors,
  resolveCategoryCode,
  validateCategoryStep,
  validateMarksStep,
  validatePreferencesStep,
  type OnboardingAnswers,
} from "../schema";

function answers(overrides: Partial<OnboardingAnswers>): OnboardingAnswers {
  return { ...EMPTY_ANSWERS, ...overrides };
}

describe("validateMarksStep", () => {
  it("requires both fields", () => {
    const errors = validateMarksStep(answers({}));
    expect(errors.kcetMarks).toBe("errors.kcetMarksRequired");
    expect(errors.boardPcmPercent).toBe("errors.boardPcmPercentRequired");
  });

  it("rejects out-of-range values", () => {
    const errors = validateMarksStep(answers({ kcetMarks: "200", boardPcmPercent: "-5" }));
    expect(errors.kcetMarks).toBe("errors.kcetMarksRange");
    expect(errors.boardPcmPercent).toBe("errors.boardPcmPercentRange");
  });

  it("accepts valid values with no errors", () => {
    const errors = validateMarksStep(answers({ kcetMarks: "150", boardPcmPercent: "88.5" }));
    expect(hasErrors(errors)).toBe(false);
  });
});

describe("validateCategoryStep", () => {
  it("requires a category base", () => {
    expect(validateCategoryStep(answers({})).categoryBase).toBe("errors.categoryBaseRequired");
  });

  it("requires a quota for non-GM bases", () => {
    const errors = validateCategoryStep(answers({ categoryBase: "2A" }));
    expect(errors.categoryQuota).toBe("errors.categoryQuotaRequired");
  });

  it("does not require a quota for GM", () => {
    expect(hasErrors(validateCategoryStep(answers({ categoryBase: "GM" })))).toBe(false);
  });

  it("accepts a valid base + quota combination", () => {
    expect(hasErrors(validateCategoryStep(answers({ categoryBase: "2A", categoryQuota: "R" })))).toBe(false);
  });
});

describe("validatePreferencesStep", () => {
  it("has no errors when everything is left blank (all optional)", () => {
    expect(hasErrors(validatePreferencesStep(answers({})))).toBe(false);
  });

  it("rejects a negative fee cap", () => {
    expect(validatePreferencesStep(answers({ maxFeesInr: "-1" })).maxFeesInr).toBe("errors.maxFeesInrRange");
  });
});

describe("resolveCategoryCode", () => {
  it("combines base + quota into the categoryCode predictors expect", () => {
    expect(resolveCategoryCode(answers({ categoryBase: "2A", categoryQuota: "R" }))).toBe("2AR");
  });

  it("resolves GM without needing a quota", () => {
    expect(resolveCategoryCode(answers({ categoryBase: "GM" }))).toBe("GM");
  });

  it("returns undefined for an incomplete selection", () => {
    expect(resolveCategoryCode(answers({}))).toBeUndefined();
  });
});
