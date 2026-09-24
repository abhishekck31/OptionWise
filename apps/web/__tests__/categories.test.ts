import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  CATEGORIES_VERIFIED,
  QUOTA_SUFFIXES,
  getCategory,
  isValidCategoryCode,
} from "@/lib/categories";

describe("category/quota config", () => {
  it("is explicitly marked unverified until checked against a real KEA document", () => {
    // This config was generated with no data/docs/ KEA brochure available — see
    // BLOCKED.md. If this ever flips to true, a `source` pointing at that document
    // should land alongside it.
    expect(CATEGORIES_VERIFIED).toBe(false);
  });

  it("covers every base category SPEC.md names, with a code for each quota suffix", () => {
    const bases = new Set(CATEGORIES.map((c) => c.base));
    expect(bases).toEqual(new Set(["GM", "1", "2A", "2B", "3A", "3B", "SC", "ST"]));

    for (const base of ["1", "2A", "2B", "3A", "3B", "SC", "ST"]) {
      for (const quota of QUOTA_SUFFIXES) {
        expect(isValidCategoryCode(`${base}${quota.code}`)).toBe(true);
      }
    }
  });

  it("validates known and rejects unknown category codes", () => {
    expect(isValidCategoryCode("GM")).toBe(true);
    expect(isValidCategoryCode("2AR")).toBe(true);
    expect(isValidCategoryCode("NOT_A_CODE")).toBe(false);
  });

  it("looks up a category's label and quota", () => {
    expect(getCategory("STH")).toMatchObject({
      base: "ST",
      quota: "H",
      label: "Scheduled Tribe — Hyderabad-Karnataka",
    });
    expect(getCategory("nope")).toBeUndefined();
  });
});
