import type { RankPrediction } from "@/lib/predictors/rankPredictor";
import type { OnboardingAnswers } from "./schema";

const STORAGE_KEY = "optionwise:onboarding";

export interface StoredOnboarding {
  answers: OnboardingAnswers;
  categoryCode: string;
  prediction: RankPrediction;
}

/** No account/DB to save to yet (SPEC.md's Data model has no OptionList/session
 * table) — onboarding answers live in the browser only, until an Auth task changes
 * that. Client-only; call from "use client" components after mount. */
export function saveOnboarding(data: StoredOnboarding): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadOnboarding(): StoredOnboarding | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredOnboarding;
  } catch {
    return null;
  }
}
