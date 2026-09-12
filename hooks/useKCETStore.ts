"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import type { Branch, CollegePreferenceInput } from "@/types";

export { useAppStore };

/** Kept so existing imports keep resolving; the state shape is AppStore. */
export const useKCETStore = useAppStore;

/** Used when nothing has been calculated yet. */
export const DEFAULT_RANK = 3500;

/**
 * Pulls the persisted store out of localStorage after mount.
 *
 * Returns false on the server and on the first client paint, so a component
 * can hold back anything rank-dependent until the real value has landed
 * instead of flashing the default.
 */
export function useKCETHydration(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    void useAppStore.persist.rehydrate();
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  return hydrated;
}

/* ─── State ─── */

export const useStudentInput = () => useAppStore((s) => s.studentInput);
export const useRankEstimate = () => useAppStore((s) => s.rankEstimate);
export const usePreferences = () => useAppStore((s) => s.preferences);
export const usePredictionResults = () => useAppStore((s) => s.predictions);
export const useOptionList = () => useAppStore((s) => s.optionList);
export const useIsCalculating = () => useAppStore((s) => s.isCalculating);
export const useIsPredicting = () => useAppStore((s) => s.isPredicting);

/** The rank everything on the site is measured against. */
export function useRank(): number {
  const preferences = usePreferences();
  const rankEstimate = useRankEstimate();
  return preferences?.rank ?? rankEstimate?.estimatedRank ?? DEFAULT_RANK;
}

/** The reservation category predictions run under. */
export function useCategory() {
  const preferences = usePreferences();
  const studentInput = useStudentInput();
  return preferences?.category ?? studentInput?.category ?? "GM";
}

/* ─── Actions ─── */

export const useSetStudentInput = () => useAppStore((s) => s.setStudentInput);
export const useSetRankEstimate = () => useAppStore((s) => s.setRankEstimate);
export const useSetPreferences = () => useAppStore((s) => s.setPreferences);
export const useSetPredictions = () => useAppStore((s) => s.setPredictions);
export const useSetOptionList = () => useAppStore((s) => s.setOptionList);
export const useAddToOptionList = () => useAppStore((s) => s.addToOptionList);
export const useRemoveFromOptionList = () =>
  useAppStore((s) => s.removeFromOptionList);
export const useReorderOptionList = () => useAppStore((s) => s.reorderOptionList);
export const useClearOptionList = () => useAppStore((s) => s.clearOptionList);
export const useUpdateOptionNote = () => useAppStore((s) => s.updateOptionNote);
export const useSetIsCalculating = () => useAppStore((s) => s.setIsCalculating);
export const useSetIsPredicting = () => useAppStore((s) => s.setIsPredicting);

/* ─── Derived ─── */

/**
 * Identifies a seat by what it is rather than by its entry id.
 *
 * Entry ids are random, so a card asking "is this already on my list?" has to
 * compare college and branch instead.
 */
export function optionKey(collegeId: string, branch: Branch): string {
  return `${collegeId}-${branch}`;
}

/** Seats already on the option list, for the "added" state on cards. */
export function useOptionKeys(): Set<string> {
  const optionList = useOptionList();
  return new Set(
    optionList.map((entry) =>
      optionKey(entry.prediction.college.id, entry.prediction.branch)
    )
  );
}

/** The full filter object the predictor takes, with sensible defaults. */
export function usePreferenceInput(): CollegePreferenceInput {
  const preferences = usePreferences();
  const studentInput = useStudentInput();
  const rankEstimate = useRankEstimate();

  if (preferences) return preferences;

  return {
    rank: rankEstimate?.estimatedRank ?? DEFAULT_RANK,
    category: studentInput?.category ?? "GM",
    gender: studentInput?.gender ?? "M",
    isHKRegion: studentInput?.isHKRegion ?? false,
    preferredCities: [],
    preferredBranches: [],
    willingToHostel: true,
    maxFee: null,
    collegeType: [],
  };
}
