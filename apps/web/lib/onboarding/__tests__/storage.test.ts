import { afterEach, describe, expect, it } from "vitest";
import { EMPTY_ANSWERS } from "../schema";
import { loadOnboarding, saveOnboarding, type StoredOnboarding } from "../storage";

afterEach(() => {
  window.localStorage.clear();
});

const sample: StoredOnboarding = {
  answers: { ...EMPTY_ANSWERS, kcetMarks: "150", boardPcmPercent: "88", categoryBase: "GM" },
  categoryCode: "GM",
  prediction: {
    meritScore: 80,
    optimisticRank: 5000,
    likelyRank: 6000,
    conservativeRank: 7000,
    confidence: "medium",
    basedOnSampleData: true,
  },
};

describe("onboarding storage", () => {
  it("returns null when nothing has been saved", () => {
    expect(loadOnboarding()).toBeNull();
  });

  it("round-trips saved data", () => {
    saveOnboarding(sample);
    expect(loadOnboarding()).toEqual(sample);
  });

  it("returns null for corrupted stored data instead of throwing", () => {
    window.localStorage.setItem("optionwise:onboarding", "not json");
    expect(loadOnboarding()).toBeNull();
  });
});
