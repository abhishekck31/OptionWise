"use client";

import { useMemo } from "react";
import { predictColleges, suggestOptionList, type SuggestedList } from "@/lib/predict";
import { usePreferenceInput } from "@/hooks/useKCETStore";
import type { CollegePreferenceInput, PredictionResult } from "@/types";

/**
 * Every seat the current rank reaches, best chance first.
 *
 * Pass an override to run the prediction against different filters than the
 * ones in the store — the predictor page does this while the form is open.
 */
export function usePredictions(
  override?: Partial<CollegePreferenceInput>
): PredictionResult[] {
  const base = usePreferenceInput();
  const input: CollegePreferenceInput = { ...base, ...override };

  // The array fields are compared by content: a caller passing a fresh array
  // each render would otherwise recompute the whole list every time.
  const cities = input.preferredCities.join(",");
  const branches = input.preferredBranches.join(",");
  const types = input.collegeType.join(",");
  const { rank, category, gender, isHKRegion, maxFee, willingToHostel } = input;

  return useMemo(
    () =>
      predictColleges({
        rank,
        category,
        gender,
        isHKRegion,
        maxFee,
        willingToHostel,
        preferredCities: cities ? cities.split(",") : [],
        preferredBranches: branches
          ? (branches.split(",") as CollegePreferenceInput["preferredBranches"])
          : [],
        collegeType: types
          ? (types.split(",") as CollegePreferenceInput["collegeType"])
          : [],
      }),
    [rank, category, gender, isHKRegion, maxFee, willingToHostel, cities, branches, types]
  );
}

/** The suggested aspirational / moderate / safe split for option entry. */
export function useSuggestedOptions(
  override?: Partial<CollegePreferenceInput>
): SuggestedList {
  const base = usePreferenceInput();
  const input: CollegePreferenceInput = { ...base, ...override };

  const cities = input.preferredCities.join(",");
  const branches = input.preferredBranches.join(",");
  const types = input.collegeType.join(",");
  const { rank, category, gender, isHKRegion, maxFee, willingToHostel } = input;

  return useMemo(
    () =>
      suggestOptionList({
        rank,
        category,
        gender,
        isHKRegion,
        maxFee,
        willingToHostel,
        preferredCities: cities ? cities.split(",") : [],
        preferredBranches: branches
          ? (branches.split(",") as CollegePreferenceInput["preferredBranches"])
          : [],
        collegeType: types
          ? (types.split(",") as CollegePreferenceInput["collegeType"])
          : [],
      }),
    [rank, category, gender, isHKRegion, maxFee, willingToHostel, cities, branches, types]
  );
}

/** Counts per tier, for summary readouts. */
export function usePredictionSummary(predictions: PredictionResult[]) {
  return useMemo(() => {
    const safe = predictions.filter((p) => p.tier === "Safe").length;
    const moderate = predictions.filter((p) => p.tier === "Moderate").length;
    const aspirational = predictions.filter((p) => p.tier === "Aspirational").length;
    return { safe, moderate, aspirational, total: predictions.length };
  }, [predictions]);
}
