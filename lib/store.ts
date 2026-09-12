import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  CollegePreferenceInput,
  OptionEntry,
  PredictionResult,
  RankEstimate,
  StudentInput,
} from "@/types";

/** Moves one item to a new index, returning a new array. */
export function arrayMove<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  if (
    from < 0 ||
    to < 0 ||
    from >= next.length ||
    to >= next.length ||
    from === to
  ) {
    return next;
  }

  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/** randomUUID needs a secure context, so fall back where it is unavailable. */
function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `opt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export interface AppStore {
  // Student inputs (persisted across pages)
  studentInput: StudentInput | null;
  setStudentInput: (input: StudentInput) => void;

  // Rank estimate result
  rankEstimate: RankEstimate | null;
  setRankEstimate: (estimate: RankEstimate) => void;

  // College predictor preferences
  preferences: CollegePreferenceInput | null;
  setPreferences: (prefs: CollegePreferenceInput) => void;

  // Prediction results
  predictions: PredictionResult[];
  setPredictions: (results: PredictionResult[]) => void;

  // Option entry list
  optionList: OptionEntry[];
  /** Replaces the whole list — used when a drag also re-tiers the entries. */
  setOptionList: (entries: OptionEntry[]) => void;
  addToOptionList: (prediction: PredictionResult) => void;
  removeFromOptionList: (id: string) => void;
  reorderOptionList: (from: number, to: number) => void;
  clearOptionList: () => void;
  updateOptionNote: (id: string, note: string) => void;

  // UI state
  isCalculating: boolean;
  setIsCalculating: (v: boolean) => void;
  isPredicting: boolean;
  setIsPredicting: (v: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      studentInput: null,
      setStudentInput: (studentInput) => set({ studentInput }),

      rankEstimate: null,
      setRankEstimate: (rankEstimate) => set({ rankEstimate }),

      preferences: null,
      setPreferences: (preferences) => set({ preferences }),

      predictions: [],
      setPredictions: (predictions) => set({ predictions }),

      optionList: [],

      setOptionList: (optionList) => set({ optionList }),

      addToOptionList: (prediction) =>
        set((state) => {
          // KEA takes each college and branch once, so adding the same seat
          // twice is ignored rather than duplicated down the list.
          const alreadyListed = state.optionList.some(
            (entry) =>
              entry.prediction.college.id === prediction.college.id &&
              entry.prediction.branch === prediction.branch
          );
          if (alreadyListed) return state;

          const entry: OptionEntry = {
            id: createId(),
            prediction,
            tier: prediction.tier,
            userNote: "",
            addedAt: Date.now(),
          };

          return { optionList: [...state.optionList, entry] };
        }),

      removeFromOptionList: (id) =>
        set((state) => ({
          optionList: state.optionList.filter((entry) => entry.id !== id),
        })),

      reorderOptionList: (from, to) =>
        set((state) => ({ optionList: arrayMove(state.optionList, from, to) })),

      clearOptionList: () => set({ optionList: [] }),

      updateOptionNote: (id, note) =>
        set((state) => ({
          optionList: state.optionList.map((entry) =>
            entry.id === id ? { ...entry, userNote: note } : entry
          ),
        })),

      isCalculating: false,
      setIsCalculating: (isCalculating) => set({ isCalculating }),

      isPredicting: false,
      setIsPredicting: (isPredicting) => set({ isPredicting }),
    }),
    {
      name: "kcet-predictor",
      storage: createJSONStorage(() => localStorage),
      // Rehydrated by hand on mount so the server and first client paint match.
      skipHydration: true,
      version: 3,
      // Predictions are derived from the inputs, and the two loading flags are
      // momentary, so neither is worth carrying across a reload.
      partialize: (state) => ({
        studentInput: state.studentInput,
        rankEstimate: state.rankEstimate,
        preferences: state.preferences,
        optionList: state.optionList,
      }),
    }
  )
);
