import { describe, expect, it } from "vitest";
import { isValidCategoryCode } from "@/lib/categories";
import {
  SAMPLE_COLLEGES,
  SAMPLE_COLLEGE_COURSES,
  SAMPLE_COURSES,
  SAMPLE_CUTOFFS,
} from "../sampleDataset";

describe("sample dataset", () => {
  it("is obviously fake and small", () => {
    for (const college of SAMPLE_COLLEGES) {
      expect(college.name.toLowerCase()).toContain("sample");
    }
    expect(SAMPLE_COLLEGES.length).toBeLessThanOrEqual(5);
    expect(SAMPLE_CUTOFFS.length).toBeLessThanOrEqual(50);
  });

  it("only references college/course codes that exist in the dataset", () => {
    const collegeCodes = new Set(SAMPLE_COLLEGES.map((c) => c.code));
    const courseCodes = new Set(SAMPLE_COURSES.map((c) => c.code));

    for (const cc of SAMPLE_COLLEGE_COURSES) {
      expect(collegeCodes.has(cc.collegeCode)).toBe(true);
      expect(courseCodes.has(cc.courseCode)).toBe(true);
    }
    for (const cutoff of SAMPLE_CUTOFFS) {
      expect(collegeCodes.has(cutoff.collegeCode)).toBe(true);
      expect(courseCodes.has(cutoff.courseCode)).toBe(true);
    }
  });

  it("only uses valid category codes and positive ranks", () => {
    for (const cutoff of SAMPLE_CUTOFFS) {
      expect(isValidCategoryCode(cutoff.categoryCode)).toBe(true);
      expect(cutoff.closingRank).toBeGreaterThan(0);
    }
  });
});
