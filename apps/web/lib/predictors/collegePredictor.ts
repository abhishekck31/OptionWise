import collegePredictorConfig from "../../../../config/collegePredictor.json";

export type Chance = "safe" | "target" | "reach";

export interface CutoffRecord {
  year: number;
  round: number;
  closingRank: number;
}

export interface ClassificationResult {
  chance: Chance;
  /** The (trend-adjusted) closing rank this classification was computed against. */
  trendAdjustedRank: number;
  /** Past closing ranks used as evidence — the latest round of each year, ascending. */
  evidence: CutoffRecord[];
}

interface CollegePredictorConfig {
  safeMarginFraction: number;
  reachMarginFraction: number;
  trendWeight: number;
}

const config = collegePredictorConfig as CollegePredictorConfig;

/** KEA publishes multiple rounds per year; the last round is the most complete
 * closing rank for that year, so that's what each year contributes as evidence. */
function latestRoundPerYear(cutoffs: CutoffRecord[]): CutoffRecord[] {
  const byYear = new Map<number, CutoffRecord>();
  for (const cutoff of cutoffs) {
    const existing = byYear.get(cutoff.year);
    if (!existing || cutoff.round > existing.round) {
      byYear.set(cutoff.year, cutoff);
    }
  }
  return [...byYear.values()].sort((a, b) => a.year - b.year);
}

/**
 * Classifies a single college-course as Safe / Target / Reach for a given rank,
 * given that college-course's historical cutoffs for one category. Returns null if
 * there's no cutoff evidence at all for this category (nothing to classify against).
 *
 * Trend adjustment: with 2+ years of evidence, extrapolates from the two most recent
 * years' closing ranks (dampened by `trendWeight`) rather than using the latest year
 * alone — a "simple trend adjustment" per SPEC.md, not a full regression.
 */
export function classifyCollegeCourse(cutoffs: CutoffRecord[], rank: number): ClassificationResult | null {
  const evidence = latestRoundPerYear(cutoffs);
  if (evidence.length === 0) {
    return null;
  }

  let trendAdjustedRank: number;
  if (evidence.length === 1) {
    trendAdjustedRank = evidence[0].closingRank;
  } else {
    const latest = evidence[evidence.length - 1];
    const previous = evidence[evidence.length - 2];
    const delta = latest.closingRank - previous.closingRank;
    trendAdjustedRank = Math.max(1, Math.round(latest.closingRank + delta * config.trendWeight));
  }

  const safeThreshold = trendAdjustedRank * (1 - config.safeMarginFraction);
  const reachThreshold = trendAdjustedRank * (1 + config.reachMarginFraction);

  let chance: Chance;
  if (rank <= safeThreshold) {
    chance = "safe";
  } else if (rank <= reachThreshold) {
    chance = "target";
  } else {
    chance = "reach";
  }

  return { chance, trendAdjustedRank, evidence };
}
