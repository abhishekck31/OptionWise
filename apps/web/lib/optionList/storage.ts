import type { CollegePrediction } from "@/lib/predictors/predictColleges";

const STORAGE_KEY = "optionwise:optionList";

export function optionId(item: Pick<CollegePrediction, "collegeCode" | "courseCode">): string {
  return `${item.collegeCode}-${item.courseCode}`;
}

export function loadOptionList(): CollegePrediction[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CollegePrediction[]) : [];
  } catch {
    return [];
  }
}

export function saveOptionList(list: CollegePrediction[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/** Adds an option if it isn't already on the list (no-op, doesn't duplicate). */
export function addToOptionList(item: CollegePrediction): CollegePrediction[] {
  const current = loadOptionList();
  if (current.some((existing) => optionId(existing) === optionId(item))) {
    return current;
  }
  const next = [...current, item];
  saveOptionList(next);
  return next;
}

export function removeFromOptionList(collegeCode: string, courseCode: string): CollegePrediction[] {
  const current = loadOptionList();
  const next = current.filter((item) => !(item.collegeCode === collegeCode && item.courseCode === courseCode));
  saveOptionList(next);
  return next;
}
