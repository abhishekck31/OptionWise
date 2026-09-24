import optionBuilderConfig from "../../../../config/optionBuilder.json";
import type { Chance } from "../predictors/collegePredictor";

export interface OptionCandidate {
  /** Stable identifier, e.g. a college-course id. */
  id: string;
  chance: Chance;
  /** false = the student marked this "I would never accept this" — removed entirely,
   * not just deprioritized. Defaults to true. */
  acceptable?: boolean;
}

export interface OptionEntry extends OptionCandidate {
  /** 0-based position in the final (filtered) list — this is allotment priority. */
  position: number;
  explanation: string;
}

export type Warning =
  | { type: "too_few_safe"; safeCount: number; minimum: number }
  | {
      type: "safe_above_reach";
      safeEntryId: string;
      safeEntryPosition: number;
      reachEntryIds: string[];
    };

export interface OptimizedOptionList {
  entries: OptionEntry[];
  /** ids removed because acceptable:false ("remove options the student would never
   * accept" — SPEC.md). */
  removedIds: string[];
  warnings: Warning[];
}

interface OptionBuilderConfig {
  minSafeOptions: number;
}

const config = optionBuilderConfig as OptionBuilderConfig;

function explainEntry(chance: Chance): string {
  switch (chance) {
    case "safe":
      return "Safe pick — your rank is comfortably better than recent cutoffs here.";
    case "target":
      return "Target — your rank is close to recent cutoffs here; a real possibility.";
    case "reach":
      return "Reach — recent cutoffs were better than your rank, but ranking it high costs you nothing.";
  }
}

/**
 * Optimizes a student's TRUE-preference-ordered option list (SPEC.md: "the list must
 * be ordered by the student's TRUE preference, never by probability"):
 * - drops options marked unacceptable
 * - explains each remaining entry
 * - warns when there are too few Safe options
 * - warns when a Safe option sits above (is prioritized over) a Reach option later in
 *   the list. Reach options placed early cost nothing — KEA only allots you a Reach
 *   option if you actually clear its cutoff, so putting reach picks first is "fine".
 *   But a Safe option ahead of a later Reach option always wins the allotment over
 *   it, so if that Reach option is one the student actually wants, the Safe option
 *   ahead of it is quietly shadowing it — hence the warning.
 */
export function buildOptionList(candidates: OptionCandidate[]): OptimizedOptionList {
  const removedIds = candidates.filter((c) => c.acceptable === false).map((c) => c.id);
  const kept = candidates.filter((c) => c.acceptable !== false);

  const entries: OptionEntry[] = kept.map((candidate, position) => ({
    ...candidate,
    position,
    explanation: explainEntry(candidate.chance),
  }));

  const warnings: Warning[] = [];

  const safeEntries = entries.filter((e) => e.chance === "safe");
  if (safeEntries.length < config.minSafeOptions) {
    warnings.push({ type: "too_few_safe", safeCount: safeEntries.length, minimum: config.minSafeOptions });
  }

  const reachEntries = entries.filter((e) => e.chance === "reach");
  for (const safeEntry of safeEntries) {
    const shadowedReach = reachEntries.filter((r) => r.position > safeEntry.position);
    if (shadowedReach.length > 0) {
      warnings.push({
        type: "safe_above_reach",
        safeEntryId: safeEntry.id,
        safeEntryPosition: safeEntry.position,
        reachEntryIds: shadowedReach.map((r) => r.id),
      });
    }
  }

  return { entries, removedIds, warnings };
}
