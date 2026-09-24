import { buildOptionList, type OptionCandidate, type OptionEntry, type Warning } from "@/lib/optionBuilder/optionBuilder";
import { optionId } from "./storage";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";

export interface OptionListRowView {
  prediction: CollegePrediction;
  entry: OptionEntry;
}

/**
 * Runs the existing (pure) option-builder over the student's saved option list, in
 * its current order, and zips the result back up with the full CollegePrediction
 * each row needs to render (college/course names, fees, evidence). No option on this
 * screen is ever marked unacceptable — removal happens by deleting it from the list
 * outright (see storage.ts) — so `entries` is always the same length/order as
 * `orderedList`.
 */
export function buildOptionListView(orderedList: CollegePrediction[]): { rows: OptionListRowView[]; warnings: Warning[] } {
  const candidates: OptionCandidate[] = orderedList.map((p) => ({ id: optionId(p), chance: p.chance }));
  const { entries, warnings } = buildOptionList(candidates);
  const rows = orderedList.map((prediction, index) => ({ prediction, entry: entries[index] }));
  return { rows, warnings };
}

/**
 * The "one-tap fix" for a safe_above_reach warning: moves the shadowing Safe option
 * to just after the last Reach option it shadows, so it no longer sits above any
 * Reach option the student prefers. Leaves everything else's relative order intact.
 */
export function fixSafeAboveReach(
  orderedList: CollegePrediction[],
  warning: Extract<Warning, { type: "safe_above_reach" }>,
): CollegePrediction[] {
  const ids = orderedList.map(optionId);
  const safeIndex = ids.indexOf(warning.safeEntryId);
  const reachIndices = warning.reachEntryIds.map((id) => ids.indexOf(id)).filter((i) => i !== -1);
  if (safeIndex === -1 || reachIndices.length === 0) return orderedList;

  const lastReachIndex = Math.max(...reachIndices);
  const next = [...orderedList];
  const [safeItem] = next.splice(safeIndex, 1);
  // safeIndex is always < lastReachIndex (that's what the warning means), so removing
  // it first shifts everything after it down by one — inserting at lastReachIndex now
  // lands right after the reach option that used to be there.
  next.splice(lastReachIndex, 0, safeItem);
  return next;
}
