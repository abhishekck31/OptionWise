import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { predictRank } from "../rankPredictor";

const kcetMarks = fc.float({ min: 0, max: 180, noNaN: true });
const boardPcmPercent = fc.float({ min: 0, max: 100, noNaN: true });

describe("predictRank (property tests)", () => {
  it("never gives a strictly worse (higher) likely rank for a strictly higher merit score", () => {
    fc.assert(
      fc.property(kcetMarks, boardPcmPercent, kcetMarks, boardPcmPercent, (k1, b1, k2, b2) => {
        const p1 = predictRank(k1, b1);
        const p2 = predictRank(k2, b2);
        if (p1.meritScore < p2.meritScore) {
          expect(p2.likelyRank).toBeLessThanOrEqual(p1.likelyRank);
        } else if (p1.meritScore > p2.meritScore) {
          expect(p1.likelyRank).toBeLessThanOrEqual(p2.likelyRank);
        }
      }),
      { numRuns: 500 },
    );
  });

  it("always orders optimistic <= likely <= conservative", () => {
    fc.assert(
      fc.property(kcetMarks, boardPcmPercent, (k, b) => {
        const prediction = predictRank(k, b);
        expect(prediction.optimisticRank).toBeLessThanOrEqual(prediction.likelyRank);
        expect(prediction.likelyRank).toBeLessThanOrEqual(prediction.conservativeRank);
        expect(prediction.optimisticRank).toBeGreaterThanOrEqual(1);
      }),
      { numRuns: 500 },
    );
  });
});
