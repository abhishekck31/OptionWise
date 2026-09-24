import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { buildOptionList, type OptionCandidate } from "../optionBuilder";
import type { Chance } from "../../predictors/collegePredictor";

const chanceArb: fc.Arbitrary<Chance> = fc.constantFrom("safe", "target", "reach");
const candidatesArb: fc.Arbitrary<OptionCandidate[]> = fc
  .array(chanceArb, { minLength: 0, maxLength: 15 })
  .map((chances) => chances.map((chance, i) => ({ id: `c${i}`, chance })));

describe("buildOptionList (property tests)", () => {
  it("flags exactly the Safe entries that have at least one Reach entry later in the list", () => {
    fc.assert(
      fc.property(candidatesArb, (candidates) => {
        const result = buildOptionList(candidates);
        const expectedFlagged = result.entries
          .filter((e) => e.chance === "safe")
          .filter((safeEntry) => result.entries.some((e) => e.chance === "reach" && e.position > safeEntry.position))
          .map((e) => e.id)
          .sort();

        const actualFlagged = result.warnings
          .filter((w) => w.type === "safe_above_reach")
          .map((w) => (w.type === "safe_above_reach" ? w.safeEntryId : ""))
          .sort();

        expect(actualFlagged).toEqual(expectedFlagged);
      }),
      { numRuns: 300 },
    );
  });

  it("never loses or duplicates an acceptable candidate", () => {
    fc.assert(
      fc.property(candidatesArb, (candidates) => {
        const result = buildOptionList(candidates);
        expect(result.entries.map((e) => e.id).sort()).toEqual(candidates.map((c) => c.id).sort());
      }),
      { numRuns: 300 },
    );
  });
});
