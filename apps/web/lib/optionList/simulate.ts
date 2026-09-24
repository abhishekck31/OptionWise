import { simulateAllotment, type SimulationOption, type SimulationResult } from "@/lib/simulator/allotmentSimulator";
import { optionId } from "./storage";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";

/**
 * Runs the (pure, client-side) allotment simulator directly against the evidence
 * already fetched for each option — no extra API round-trip needed. Uses only the
 * most recent year present in each option's own evidence (which may differ option to
 * option, since each was fetched independently); this is a reasonable approximation
 * for a *live* preview while reordering, not a guarantee every option's "most recent
 * year" lines up — `simulateAllotmentForStudent` (server-side, used elsewhere) picks
 * one single most-recent year across the whole list instead.
 */
export function simulateOptionList(orderedList: CollegePrediction[], rank: number): SimulationResult {
  const orderedIds = orderedList.map(optionId);
  const options: Record<string, SimulationOption> = {};

  for (const item of orderedList) {
    const years = item.evidence.map((e) => e.year);
    const mostRecentYear = years.length > 0 ? Math.max(...years) : null;
    options[optionId(item)] = {
      id: optionId(item),
      roundCutoffs: item.evidence
        .filter((e) => e.year === mostRecentYear)
        .map((e) => ({ round: e.round, closingRank: e.closingRank })),
    };
  }

  return simulateAllotment(orderedIds, options, rank);
}
