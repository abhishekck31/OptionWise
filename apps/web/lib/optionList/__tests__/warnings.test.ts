import { describe, expect, it } from "vitest";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";
import type { Chance } from "@/lib/predictors/collegePredictor";
import { buildOptionListView, fixSafeAboveReach } from "../warnings";

function item(collegeCode: string, chance: Chance): CollegePrediction {
  return {
    chance,
    trendAdjustedRank: 1000,
    evidence: [],
    collegeCode,
    courseCode: "CS",
    collegeName: `College ${collegeCode}`,
    courseName: "CS",
    city: null,
    feesInr: null,
  };
}

describe("buildOptionListView", () => {
  it("zips each prediction with its explained, positioned entry, preserving order", () => {
    const list = [item("A", "reach"), item("B", "safe"), item("C", "safe"), item("D", "safe")];
    const { rows, warnings } = buildOptionListView(list);
    expect(rows.map((r) => r.prediction.collegeCode)).toEqual(["A", "B", "C", "D"]);
    expect(rows.map((r) => r.entry.position)).toEqual([0, 1, 2, 3]);
    expect(rows.every((r) => r.entry.explanation.length > 0)).toBe(true);
    expect(warnings).toEqual([]);
  });

  it("surfaces a safe_above_reach warning matching the option-builder's own logic", () => {
    const list = [item("A", "safe"), item("B", "reach"), item("E", "safe"), item("F", "safe")];
    const { warnings } = buildOptionListView(list);
    expect(warnings).toEqual([
      { type: "safe_above_reach", safeEntryId: "A-CS", safeEntryPosition: 0, reachEntryIds: ["B-CS"] },
    ]);
  });
});

describe("fixSafeAboveReach", () => {
  it("moves the shadowing safe option to just after the last reach option it shadows", () => {
    const list = [item("A", "safe"), item("B", "reach"), item("C", "reach")];
    const fixed = fixSafeAboveReach(list, {
      type: "safe_above_reach",
      safeEntryId: "A-CS",
      safeEntryPosition: 0,
      reachEntryIds: ["B-CS", "C-CS"],
    });
    expect(fixed.map((p) => p.collegeCode)).toEqual(["B", "C", "A"]);
  });

  it("leaves other rows in between untouched, in their original relative order", () => {
    const list = [item("A", "safe"), item("X", "target"), item("B", "reach")];
    const fixed = fixSafeAboveReach(list, {
      type: "safe_above_reach",
      safeEntryId: "A-CS",
      safeEntryPosition: 0,
      reachEntryIds: ["B-CS"],
    });
    expect(fixed.map((p) => p.collegeCode)).toEqual(["X", "B", "A"]);
  });

  it("is a no-op if the referenced ids are no longer in the list", () => {
    const list = [item("A", "safe"), item("B", "reach")];
    const fixed = fixSafeAboveReach(list, {
      type: "safe_above_reach",
      safeEntryId: "gone",
      safeEntryPosition: 0,
      reachEntryIds: ["B-CS"],
    });
    expect(fixed).toBe(list);
  });

  it("applying the fix actually resolves the warning", () => {
    const list = [item("A", "safe"), item("B", "reach")];
    const { warnings } = buildOptionListView(list);
    const warning = warnings.find((w) => w.type === "safe_above_reach");
    expect(warning).toBeDefined();
    const fixed = fixSafeAboveReach(list, warning as Extract<typeof warning, { type: "safe_above_reach" }>);
    const after = buildOptionListView(fixed);
    expect(after.warnings.some((w) => w.type === "safe_above_reach")).toBe(false);
  });
});
