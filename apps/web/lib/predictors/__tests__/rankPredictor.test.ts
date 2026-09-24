import { describe, expect, it } from "vitest";
import { calculateMeritScore, interpolateRank, predictRank } from "../rankPredictor";

describe("calculateMeritScore", () => {
  it("weights KCET marks (out of 180) and board PCM% equally by default", () => {
    // 180/180 KCET (=100 scaled) and 100% board -> 50 + 50 = 100
    expect(calculateMeritScore(180, 100)).toBe(100);
    // 0 KCET and 0% board -> 0
    expect(calculateMeritScore(0, 0)).toBe(0);
    // 90/180 KCET (=50 scaled) and 50% board -> 25 + 25 = 50
    expect(calculateMeritScore(90, 50)).toBe(50);
  });

  it("rejects out-of-range inputs", () => {
    expect(() => calculateMeritScore(-1, 50)).toThrow();
    expect(() => calculateMeritScore(181, 50)).toThrow();
    expect(() => calculateMeritScore(90, -1)).toThrow();
    expect(() => calculateMeritScore(90, 101)).toThrow();
  });
});

describe("interpolateRank", () => {
  it("returns exact configured ranks at known points", () => {
    expect(interpolateRank(100)).toEqual({ rank: 1, extrapolated: false });
    expect(interpolateRank(0)).toEqual({ rank: 250000, extrapolated: false });
  });

  it("interpolates linearly between two known points", () => {
    // Halfway between meritScore=90 (rank 1000) and meritScore=95 (rank 250).
    const { rank, extrapolated } = interpolateRank(92.5);
    expect(rank).toBeCloseTo(625, 5);
    expect(extrapolated).toBe(false);
  });

  it("clamps instead of extrapolating outside the configured range", () => {
    expect(interpolateRank(150)).toEqual({ rank: 1, extrapolated: true });
    expect(interpolateRank(-10)).toEqual({ rank: 250000, extrapolated: true });
  });
});

describe("predictRank", () => {
  it("always returns a range (optimistic <= likely <= conservative), never a single number", () => {
    const prediction = predictRank(150, 85);
    expect(prediction.optimisticRank).toBeLessThanOrEqual(prediction.likelyRank);
    expect(prediction.conservativeRank).toBeGreaterThanOrEqual(prediction.likelyRank);
    expect(prediction).toHaveProperty("confidence");
  });

  it("flags predictions as based on sample data while config/rankPredictor.json is unverified", () => {
    expect(predictRank(150, 85).basedOnSampleData).toBe(true);
  });

  it("lowers confidence when the merit score falls outside the configured range", () => {
    // A merit score of exactly 100 is in-range (kcetMarks=180, board=100%).
    expect(predictRank(180, 100).confidence).toBe("medium");
  });

  it("never predicts a rank below 1", () => {
    expect(predictRank(180, 100).optimisticRank).toBeGreaterThanOrEqual(1);
  });
});
