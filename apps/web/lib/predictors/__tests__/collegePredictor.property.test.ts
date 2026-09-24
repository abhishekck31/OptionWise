import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { classifyCollegeCourse, type Chance } from "../collegePredictor";

const CHANCE_ORDER: Record<Chance, number> = { safe: 0, target: 1, reach: 2 };

const cutoffArb = fc.array(
  fc.record({
    year: fc.integer({ min: 2015, max: 2030 }),
    round: fc.integer({ min: 1, max: 5 }),
    closingRank: fc.integer({ min: 1, max: 300000 }),
  }),
  { minLength: 1, maxLength: 6 },
);
const rankArb = fc.integer({ min: 1, max: 300000 });

describe("classifyCollegeCourse (property tests)", () => {
  it("never gives a worse chance for a strictly better (lower) rank, same evidence", () => {
    fc.assert(
      fc.property(cutoffArb, rankArb, rankArb, (cutoffs, rankA, rankB) => {
        const resultA = classifyCollegeCourse(cutoffs, rankA);
        const resultB = classifyCollegeCourse(cutoffs, rankB);
        if (!resultA || !resultB) return; // no evidence for these years — nothing to compare

        if (rankA < rankB) {
          expect(CHANCE_ORDER[resultA.chance]).toBeLessThanOrEqual(CHANCE_ORDER[resultB.chance]);
        } else if (rankA > rankB) {
          expect(CHANCE_ORDER[resultB.chance]).toBeLessThanOrEqual(CHANCE_ORDER[resultA.chance]);
        }
      }),
      { numRuns: 500 },
    );
  });

  it("always returns evidence sorted ascending by year with no duplicate years", () => {
    fc.assert(
      fc.property(cutoffArb, rankArb, (cutoffs, rank) => {
        const result = classifyCollegeCourse(cutoffs, rank);
        if (!result) return;
        const years = result.evidence.map((e) => e.year);
        expect(years).toEqual([...years].sort((a, b) => a - b));
        expect(new Set(years).size).toBe(years.length);
      }),
      { numRuns: 500 },
    );
  });
});
