import { describe, expect, it } from "vitest";
import { classifyCollegeCourse } from "../collegePredictor";

describe("classifyCollegeCourse", () => {
  it("returns null when there is no cutoff evidence", () => {
    expect(classifyCollegeCourse([], 10000)).toBeNull();
  });

  it("classifies safe/target/reach around a single year's closing rank", () => {
    const cutoffs = [{ year: 2024, round: 2, closingRank: 10000 }];

    expect(classifyCollegeCourse(cutoffs, 5000)?.chance).toBe("safe");
    expect(classifyCollegeCourse(cutoffs, 10000)?.chance).toBe("target");
    expect(classifyCollegeCourse(cutoffs, 20000)?.chance).toBe("reach");
  });

  it("uses only the latest round of each year as evidence", () => {
    const cutoffs = [
      { year: 2024, round: 1, closingRank: 20000 },
      { year: 2024, round: 2, closingRank: 12000 },
      { year: 2024, round: 3, closingRank: 10000 },
    ];

    const result = classifyCollegeCourse(cutoffs, 9000);
    expect(result?.evidence).toEqual([{ year: 2024, round: 3, closingRank: 10000 }]);
    expect(result?.trendAdjustedRank).toBe(10000);
  });

  it("extrapolates an improving trend to a better (lower) adjusted rank", () => {
    const cutoffs = [
      { year: 2023, round: 2, closingRank: 20000 },
      { year: 2024, round: 2, closingRank: 10000 },
    ];
    // delta = 10000 - 20000 = -10000, trendWeight 0.5 -> adjusted = 10000 - 5000 = 5000
    const result = classifyCollegeCourse(cutoffs, 5000);
    expect(result?.trendAdjustedRank).toBe(5000);
    expect(result?.evidence).toHaveLength(2);
  });

  it("extrapolates a worsening trend to a worse (higher) adjusted rank", () => {
    const cutoffs = [
      { year: 2023, round: 2, closingRank: 10000 },
      { year: 2024, round: 2, closingRank: 20000 },
    ];
    // delta = 20000 - 10000 = 10000, trendWeight 0.5 -> adjusted = 20000 + 5000 = 25000
    const result = classifyCollegeCourse(cutoffs, 25000);
    expect(result?.trendAdjustedRank).toBe(25000);
  });

  it("never adjusts the trend below rank 1", () => {
    const cutoffs = [
      { year: 2023, round: 1, closingRank: 100 },
      { year: 2024, round: 1, closingRank: 10 },
    ];
    const result = classifyCollegeCourse(cutoffs, 1);
    expect(result?.trendAdjustedRank).toBeGreaterThanOrEqual(1);
  });
});
