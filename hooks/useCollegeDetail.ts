"use client";

import { useMemo } from "react";
import { getCollegeById } from "@/lib/data/colleges";
import { getCutoffHistory, CUTOFF_DATA_YEAR } from "@/lib/data/cutoffs";
import { predictForCollege } from "@/lib/predict";
import { useCategory, useRank } from "@/hooks/useKCETStore";
import type {
  Branch,
  Category,
  College,
  CutoffHistoryPoint,
  PredictionResult,
} from "@/types";

export interface CollegeDetail {
  college: College | undefined;
  branches: Branch[];
  category: Category;
  rank: number;
  year: number;
  /** One prediction per branch the college offers. */
  predictions: PredictionResult[];
  /** Cutoffs over time for one branch, ready for the trend chart. */
  historyFor: (branch: Branch) => CutoffHistoryPoint[];
  predictionFor: (branch: Branch) => PredictionResult | undefined;
}

export function useCollegeDetail(collegeId: string): CollegeDetail {
  const rank = useRank();
  const category = useCategory();

  const college = useMemo(() => getCollegeById(collegeId), [collegeId]);

  const predictions = useMemo(
    () => predictForCollege(collegeId, rank, category),
    [collegeId, rank, category]
  );

  return useMemo(() => {
    const branches = college?.availableBranches ?? [];

    return {
      college,
      branches,
      category,
      rank,
      year: CUTOFF_DATA_YEAR,
      predictions,
      historyFor: (branch: Branch) =>
        getCutoffHistory(collegeId, branch, category),
      predictionFor: (branch: Branch) =>
        predictions.find((p) => p.branch === branch),
    };
  }, [college, collegeId, category, rank, predictions]);
}
