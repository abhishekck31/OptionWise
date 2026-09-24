import { afterEach, describe, expect, it } from "vitest";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";
import { addToOptionList, loadOptionList, optionId, removeFromOptionList, saveOptionList } from "../storage";

afterEach(() => {
  window.localStorage.clear();
});

function item(collegeCode: string, courseCode: string): CollegePrediction {
  return {
    chance: "safe",
    trendAdjustedRank: 1000,
    evidence: [],
    collegeCode,
    courseCode,
    collegeName: `College ${collegeCode}`,
    courseName: `Course ${courseCode}`,
    city: null,
    feesInr: null,
  };
}

describe("option list storage", () => {
  it("starts empty", () => {
    expect(loadOptionList()).toEqual([]);
  });

  it("round-trips a saved list, preserving order", () => {
    saveOptionList([item("A", "1"), item("B", "2")]);
    expect(loadOptionList().map((i) => i.collegeCode)).toEqual(["A", "B"]);
  });

  it("adds an option without duplicating an existing one", () => {
    addToOptionList(item("A", "1"));
    const after = addToOptionList(item("A", "1"));
    expect(after).toHaveLength(1);
  });

  it("removes an option by college+course code", () => {
    saveOptionList([item("A", "1"), item("B", "2")]);
    const after = removeFromOptionList("A", "1");
    expect(after.map(optionId)).toEqual(["B-2"]);
  });

  it("returns [] instead of throwing for corrupted storage", () => {
    window.localStorage.setItem("optionwise:optionList", "not json");
    expect(loadOptionList()).toEqual([]);
  });
});
