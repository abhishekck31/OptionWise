import { describe, expect, it } from "vitest";
import { buildOptionList, type OptionCandidate } from "../optionBuilder";

describe("buildOptionList", () => {
  it("removes options marked unacceptable and reports their ids", () => {
    const candidates: OptionCandidate[] = [
      { id: "a", chance: "safe" },
      { id: "b", chance: "target", acceptable: false },
      { id: "c", chance: "reach" },
    ];
    const result = buildOptionList(candidates);
    expect(result.entries.map((e) => e.id)).toEqual(["a", "c"]);
    expect(result.removedIds).toEqual(["b"]);
  });

  it("assigns 0-based positions after filtering, not before", () => {
    const candidates: OptionCandidate[] = [
      { id: "a", chance: "safe", acceptable: false },
      { id: "b", chance: "target" },
      { id: "c", chance: "reach" },
    ];
    const result = buildOptionList(candidates);
    expect(result.entries.map((e) => [e.id, e.position])).toEqual([
      ["b", 0],
      ["c", 1],
    ]);
  });

  it("explains every entry with tier-appropriate text", () => {
    const result = buildOptionList([
      { id: "a", chance: "safe" },
      { id: "b", chance: "target" },
      { id: "c", chance: "reach" },
    ]);
    expect(result.entries[0].explanation).toMatch(/safe/i);
    expect(result.entries[1].explanation).toMatch(/target/i);
    expect(result.entries[2].explanation).toMatch(/reach/i);
  });

  it("warns when there are fewer than the configured minimum of Safe options", () => {
    const result = buildOptionList([
      { id: "a", chance: "target" },
      { id: "b", chance: "reach" },
    ]);
    expect(result.warnings).toContainEqual({ type: "too_few_safe", safeCount: 0, minimum: 3 });
  });

  it("does not warn about too few Safe options once the minimum is met", () => {
    const result = buildOptionList([
      { id: "a", chance: "safe" },
      { id: "b", chance: "safe" },
      { id: "c", chance: "safe" },
    ]);
    expect(result.warnings.some((w) => w.type === "too_few_safe")).toBe(false);
  });

  it("warns when a Safe option is placed above a Reach option (shadowing it)", () => {
    const result = buildOptionList([
      { id: "safe1", chance: "safe" },
      { id: "reach1", chance: "reach" },
      { id: "reach2", chance: "reach" },
    ]);
    expect(result.warnings).toContainEqual({
      type: "safe_above_reach",
      safeEntryId: "safe1",
      safeEntryPosition: 0,
      reachEntryIds: ["reach1", "reach2"],
    });
  });

  it("does not warn when Reach options are placed above Safe options (the intended pattern)", () => {
    const result = buildOptionList([
      { id: "reach1", chance: "reach" },
      { id: "target1", chance: "target" },
      { id: "safe1", chance: "safe" },
    ]);
    expect(result.warnings.some((w) => w.type === "safe_above_reach")).toBe(false);
  });

  it("does not treat Target options as shadowed by an earlier Safe option", () => {
    const result = buildOptionList([
      { id: "safe1", chance: "safe" },
      { id: "target1", chance: "target" },
    ]);
    expect(result.warnings.some((w) => w.type === "safe_above_reach")).toBe(false);
  });
});
