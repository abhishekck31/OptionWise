import { describe, expect, it } from "vitest";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";
import { simulateOptionList } from "../simulate";

function item(collegeCode: string, evidence: { year: number; round: number; closingRank: number }[]): CollegePrediction {
  return {
    chance: "safe",
    trendAdjustedRank: 1000,
    evidence,
    collegeCode,
    courseCode: "CS",
    collegeName: `College ${collegeCode}`,
    courseName: "CS",
    city: null,
    feesInr: null,
  };
}

describe("simulateOptionList", () => {
  it("simulates against only the most recent year of each option's own evidence", () => {
    const list = [
      item("A", [
        { year: 2023, round: 1, closingRank: 1000 },
        { year: 2024, round: 1, closingRank: 20000 },
      ]),
      item("B", [{ year: 2024, round: 1, closingRank: 50000 }]),
    ];

    const result = simulateOptionList(list, 30000);
    // A's 2023 data (rank 1000) should be ignored in favour of 2024 (rank 20000),
    // so rank 30000 doesn't qualify for A in round 1 — B (50000) does.
    expect(result.rounds[0].allottedOptionId).toBe("B-CS");
  });

  it("returns no rounds for an empty list", () => {
    expect(simulateOptionList([], 10000)).toEqual({ rounds: [], finalOptionId: null });
  });
});
