import rankPredictorConfig from "../../../../config/rankPredictor.json";

export interface ScoreRankPoint {
  meritScore: number;
  rank: number;
}

interface RankPredictorConfig {
  verified: boolean;
  verificationNote: string;
  kcetMaxMarks: number;
  weights: { kcetMarksWeight: number; boardPcmPercentWeight: number };
  conservativeSpreadFraction: number;
  scoreRankPoints: ScoreRankPoint[];
}

const config = rankPredictorConfig as RankPredictorConfig;

// Ascending by meritScore, required for interpolateRank below.
const sortedPoints = [...config.scoreRankPoints].sort((a, b) => a.meritScore - b.meritScore);

export type Confidence = "low" | "medium";

export interface RankPrediction {
  meritScore: number;
  /** Best-case rank (lower is better). Always <= likelyRank. */
  optimisticRank: number;
  likelyRank: number;
  /** Worst-case rank (higher is worse). Always >= likelyRank. */
  conservativeRank: number;
  confidence: Confidence;
  /** True while config/rankPredictor.json is unverified — see BLOCKED.md. */
  basedOnSampleData: boolean;
}

/** Merit score on a 0-100 scale from KCET marks (out of kcetMaxMarks) and board PCM%,
 * weighted per config/rankPredictor.json (default 50/50 — see BLOCKED.md). */
export function calculateMeritScore(kcetMarks: number, boardPcmPercent: number): number {
  if (!Number.isFinite(kcetMarks) || kcetMarks < 0 || kcetMarks > config.kcetMaxMarks) {
    throw new Error(`kcetMarks must be between 0 and ${config.kcetMaxMarks}, got ${kcetMarks}`);
  }
  if (!Number.isFinite(boardPcmPercent) || boardPcmPercent < 0 || boardPcmPercent > 100) {
    throw new Error(`boardPcmPercent must be between 0 and 100, got ${boardPcmPercent}`);
  }

  const kcetScaledTo100 = (kcetMarks / config.kcetMaxMarks) * 100;
  const { kcetMarksWeight, boardPcmPercentWeight } = config.weights;
  return kcetScaledTo100 * kcetMarksWeight + boardPcmPercent * boardPcmPercentWeight;
}

/**
 * Piecewise-linear interpolation over config/rankPredictor.json's scoreRankPoints.
 * Clamps to the nearest configured point for a meritScore outside the configured
 * range rather than extrapolating past it, so the result is never more optimistic
 * than the best configured point or more conservative than the worst.
 */
export function interpolateRank(meritScore: number): { rank: number; extrapolated: boolean } {
  if (sortedPoints.length === 0) {
    throw new Error("no scoreRankPoints configured");
  }

  const first = sortedPoints[0];
  if (meritScore <= first.meritScore) {
    return { rank: first.rank, extrapolated: meritScore < first.meritScore };
  }

  const last = sortedPoints[sortedPoints.length - 1];
  if (meritScore >= last.meritScore) {
    return { rank: last.rank, extrapolated: meritScore > last.meritScore };
  }

  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const lower = sortedPoints[i];
    const upper = sortedPoints[i + 1];
    if (meritScore >= lower.meritScore && meritScore <= upper.meritScore) {
      const t = (meritScore - lower.meritScore) / (upper.meritScore - lower.meritScore);
      const rank = lower.rank + t * (upper.rank - lower.rank);
      return { rank, extrapolated: false };
    }
  }

  /* istanbul ignore next -- unreachable given the boundary checks above */
  throw new Error(`could not interpolate rank for meritScore ${meritScore}`);
}

/** Always returns a range (optimistic/likely/conservative) plus a confidence — never
 * a single number, per SPEC.md's rank predictor requirement. */
export function predictRank(kcetMarks: number, boardPcmPercent: number): RankPrediction {
  const meritScore = calculateMeritScore(kcetMarks, boardPcmPercent);
  const { rank: interpolated, extrapolated } = interpolateRank(meritScore);
  const likelyRank = Math.max(1, Math.round(interpolated));

  const spread = config.conservativeSpreadFraction;
  const optimisticRank = Math.max(1, Math.round(likelyRank * (1 - spread)));
  const conservativeRank = Math.max(likelyRank, Math.round(likelyRank * (1 + spread)));

  return {
    meritScore,
    optimisticRank,
    likelyRank,
    conservativeRank,
    confidence: extrapolated ? "low" : "medium",
    basedOnSampleData: !config.verified,
  };
}
