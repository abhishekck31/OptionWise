import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { simulateAllotment, type SimulationOption } from "../allotmentSimulator";

const optionsArb = fc
  .array(
    fc.record({
      id: fc.uuid(),
      roundCutoffs: fc.array(
        fc.record({ round: fc.integer({ min: 1, max: 4 }), closingRank: fc.integer({ min: 1, max: 200000 }) }),
        { minLength: 0, maxLength: 4 },
      ),
    }),
    { minLength: 0, maxLength: 5 },
  )
  .map((list) => {
    // de-duplicate rounds within one option's cutoffs (last one wins), like a real
    // Cutoff table would (one row per round).
    const deduped = list.map((opt) => {
      const byRound = new Map(opt.roundCutoffs.map((rc) => [rc.round, rc]));
      return { ...opt, roundCutoffs: [...byRound.values()] };
    });
    const orderedOptionIds = deduped.map((o) => o.id);
    const options: Record<string, SimulationOption> = Object.fromEntries(deduped.map((o) => [o.id, o]));
    return { orderedOptionIds, options };
  });
const rankArb = fc.integer({ min: 1, max: 200000 });

describe("simulateAllotment (property tests)", () => {
  it("never loses a held seat, and only ever upgrades to a strictly more-preferred option", () => {
    fc.assert(
      fc.property(optionsArb, rankArb, ({ orderedOptionIds, options }, rank) => {
        const { rounds } = simulateAllotment(orderedOptionIds, options, rank);
        const positionOf = (id: string | null) => (id === null ? null : orderedOptionIds.indexOf(id));

        let previousPosition: number | null = null;
        for (const round of rounds) {
          const position = positionOf(round.allottedOptionId);
          if (previousPosition !== null) {
            // once holding a seat, never null again, and never a worse (higher) position
            expect(position).not.toBeNull();
            expect(position as number).toBeLessThanOrEqual(previousPosition);
          }
          previousPosition = position;
        }
      }),
      { numRuns: 300 },
    );
  });

  it("the final outcome always matches the last round's outcome", () => {
    fc.assert(
      fc.property(optionsArb, rankArb, ({ orderedOptionIds, options }, rank) => {
        const result = simulateAllotment(orderedOptionIds, options, rank);
        const last = result.rounds.at(-1);
        expect(result.finalOptionId).toBe(last ? last.allottedOptionId : null);
      }),
      { numRuns: 300 },
    );
  });
});
