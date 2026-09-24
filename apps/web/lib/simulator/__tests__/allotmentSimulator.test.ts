import { describe, expect, it } from "vitest";
import { simulateAllotment, type SimulationOption } from "../allotmentSimulator";

describe("simulateAllotment", () => {
  it("allots the most-preferred option the student clears in round 1", () => {
    const options: Record<string, SimulationOption> = {
      a: { id: "a", roundCutoffs: [{ round: 1, closingRank: 1000 }] },
      b: { id: "b", roundCutoffs: [{ round: 1, closingRank: 50000 }] },
    };
    const result = simulateAllotment(["a", "b"], options, 20000);
    expect(result.rounds).toEqual([{ round: 1, allottedOptionId: "b" }]);
    expect(result.finalOptionId).toBe("b");
  });

  it("upgrades to a more-preferred option in a later round if the cutoff relaxes", () => {
    const options: Record<string, SimulationOption> = {
      a: {
        id: "a",
        roundCutoffs: [
          { round: 1, closingRank: 10000 },
          { round: 2, closingRank: 25000 },
        ],
      },
      b: {
        id: "b",
        roundCutoffs: [
          { round: 1, closingRank: 50000 },
          { round: 2, closingRank: 50000 },
        ],
      },
    };
    const result = simulateAllotment(["a", "b"], options, 20000);
    expect(result.rounds).toEqual([
      { round: 1, allottedOptionId: "b" },
      { round: 2, allottedOptionId: "a" },
    ]);
    expect(result.finalOptionId).toBe("a");
  });

  it("never downgrades to a less-preferred option in a later round", () => {
    const options: Record<string, SimulationOption> = {
      a: {
        id: "a",
        roundCutoffs: [{ round: 1, closingRank: 25000 }],
        // no round 2 cutoff at all for "a" — student still keeps it
      },
      b: {
        id: "b",
        roundCutoffs: [
          { round: 1, closingRank: 50000 },
          { round: 2, closingRank: 50000 },
        ],
      },
    };
    const result = simulateAllotment(["a", "b"], options, 20000);
    expect(result.rounds).toEqual([
      { round: 1, allottedOptionId: "a" },
      { round: 2, allottedOptionId: "a" },
    ]);
  });

  it("returns null allottedOptionId for rounds where the student qualifies for nothing yet", () => {
    const options: Record<string, SimulationOption> = {
      a: {
        id: "a",
        roundCutoffs: [
          { round: 1, closingRank: 1000 },
          { round: 2, closingRank: 25000 },
        ],
      },
    };
    const result = simulateAllotment(["a"], options, 20000);
    expect(result.rounds).toEqual([
      { round: 1, allottedOptionId: null },
      { round: 2, allottedOptionId: "a" },
    ]);
  });

  it("handles an empty option list", () => {
    expect(simulateAllotment([], {}, 1000)).toEqual({ rounds: [], finalOptionId: null });
  });
});
