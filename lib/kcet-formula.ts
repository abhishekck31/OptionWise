import type {
  ChanceLabel,
  Confidence,
  CutoffHistoryPoint,
  RankEstimate,
  StudentInput,
  Tier,
  Trend,
} from "@/types";

/**
 * KEA uses 50:50 weightage:
 * Board component = PCM% (Physics + Chemistry + Maths out of 300)
 * KCET component  = KCET score% (out of 180)
 * Final score     = (board% × 0.5) + (kcet% × 0.5)
 */

/** Board PCM is marked out of 100 per subject. */
export const BOARD_MAX = 300;

/** The KCET paper is 60 marks per subject across PCM. */
export const KCET_MAX = 180;

/** Roughly how many candidates sit the engineering paper each year. */
export const TOTAL_CANDIDATES = 310000;

/** Every percentage in this module is carried to four decimal places. */
const round4 = (value: number): number => Math.round(value * 10000) / 10000;

// ─── 1–3. Score ──────────────────────────────────────────────────────────────

export function calculateBoardPercent(
  physics: number,
  chemistry: number,
  maths: number
): number {
  return round4(((physics + chemistry + maths) / BOARD_MAX) * 100);
}

export function calculateKCETPercent(kcetScore: number): number {
  return round4((kcetScore / KCET_MAX) * 100);
}

export function calculateFinalScore(
  boardPercent: number,
  kcetPercent: number
): number {
  return round4(boardPercent * 0.5 + kcetPercent * 0.5);
}

// ─── 4. Score to rank ────────────────────────────────────────────────────────

/**
 * Score-to-rank bands derived from KEA historical data across roughly
 * 3.1 lakh candidates. Ordered high to low; the first band the score clears
 * is the one that applies.
 */
const RANK_BANDS: readonly { score: number; minRank: number; maxRank: number }[] = [
  { score: 99.5, minRank: 1, maxRank: 50 },
  { score: 99.0, minRank: 50, maxRank: 150 },
  { score: 98.5, minRank: 150, maxRank: 350 },
  { score: 98.0, minRank: 350, maxRank: 600 },
  { score: 97.5, minRank: 600, maxRank: 950 },
  { score: 97.0, minRank: 950, maxRank: 1400 },
  { score: 96.5, minRank: 1400, maxRank: 2000 },
  { score: 96.0, minRank: 2000, maxRank: 2800 },
  { score: 95.5, minRank: 2800, maxRank: 3800 },
  { score: 95.0, minRank: 3800, maxRank: 5000 },
  { score: 94.0, minRank: 5000, maxRank: 7000 },
  { score: 93.0, minRank: 7000, maxRank: 10000 },
  { score: 92.0, minRank: 10000, maxRank: 14000 },
  { score: 91.0, minRank: 14000, maxRank: 19000 },
  { score: 90.0, minRank: 19000, maxRank: 25000 },
  { score: 88.0, minRank: 25000, maxRank: 35000 },
  { score: 86.0, minRank: 35000, maxRank: 48000 },
  { score: 84.0, minRank: 48000, maxRank: 62000 },
  { score: 82.0, minRank: 62000, maxRank: 78000 },
  { score: 79.0, minRank: 78000, maxRank: 96000 },
  { score: 76.0, minRank: 96000, maxRank: 115000 },
  { score: 73.0, minRank: 115000, maxRank: 135000 },
] as const;

/** Anything below the last band. The ceiling is the size of the cohort. */
const FLOOR_BAND = { minRank: 135000, maxRank: TOTAL_CANDIDATES } as const;

/**
 * Both extremes of the curve are easier to call than the middle: the top is
 * thinly populated and the bottom is flat, while the bulk of candidates are
 * packed into the scores between.
 */
function confidenceFor(finalScore: number): Confidence {
  return finalScore >= 90 || finalScore <= 75 ? "High" : "Medium";
}

/**
 * Reads a rank band off the score.
 *
 * `boardPercent` and `kcetPercent` come back as 0 because a bare score does
 * not carry them — `estimateRank` fills them in from the marks.
 */
export function estimateRankFromScore(finalScore: number): RankEstimate {
  const band = RANK_BANDS.find((b) => finalScore >= b.score) ?? FLOOR_BAND;

  return {
    minRank: band.minRank,
    maxRank: band.maxRank,
    estimatedRank: Math.round((band.minRank + band.maxRank) / 2),
    confidence: confidenceFor(finalScore),
    boardPercent: 0,
    kcetPercent: 0,
    finalScore: round4(finalScore),
  };
}

/** Marks in, rank band out — composes the four functions above. */
export function estimateRank(input: StudentInput): RankEstimate {
  const boardPercent = calculateBoardPercent(
    input.physicsMarks,
    input.chemistryMarks,
    input.mathsMarks
  );
  const kcetPercent = calculateKCETPercent(input.kcetScore);
  const finalScore = calculateFinalScore(boardPercent, kcetPercent);

  return { ...estimateRankFromScore(finalScore), boardPercent, kcetPercent };
}

// ─── 5–7. Chance, label, tier ────────────────────────────────────────────────

/**
 * How likely this rank is to clear a given closing rank.
 *
 * Comfortably inside the cutoff is close to certain; the odds fall away
 * sharply either side of the line itself.
 */
export function calculateChancePercent(
  studentRank: number,
  closingRank: number
): number {
  if (closingRank <= 0) return 3;

  if (studentRank <= closingRank * 0.6) return 98;
  if (studentRank <= closingRank * 0.75) return 92;
  if (studentRank <= closingRank * 0.85) return 82;
  if (studentRank <= closingRank * 0.92) return 70;
  if (studentRank <= closingRank * 0.97) return 55;
  if (studentRank <= closingRank * 1.0) return 40;
  if (studentRank <= closingRank * 1.05) return 25;
  if (studentRank <= closingRank * 1.1) return 12;
  return 3;
}

export function getChanceLabel(chancePercent: number): ChanceLabel {
  if (chancePercent >= 70) return "High";
  if (chancePercent >= 45) return "Moderate";
  return "Low";
}

export function getTier(chancePercent: number): Tier {
  if (chancePercent < 45) return "Aspirational";
  if (chancePercent < 72) return "Moderate";
  return "Safe";
}

// ─── 8. Trend ────────────────────────────────────────────────────────────────

/** Movement of at least this many ranks a year counts as a real shift. */
const TREND_THRESHOLD = 50;

/**
 * Which way a cutoff has been moving, read off the final round.
 *
 * Only R3 is compared, because that is where a seat actually closed. A
 * closing rank falling year on year means fewer ranks got in, so the seat
 * tightened. `delta` is the size of the average yearly move, without sign —
 * `trend` carries the direction.
 */
export function getTrend(history: CutoffHistoryPoint[]): {
  trend: Trend;
  delta: number;
} {
  const finalRounds = history
    .filter((point) => point.round === "R3")
    .sort((a, b) => a.year - b.year)
    .slice(-3);

  if (finalRounds.length < 2) return { trend: "stable", delta: 0 };

  const changes: number[] = [];
  for (let i = 1; i < finalRounds.length; i++) {
    changes.push(finalRounds[i].closingRank - finalRounds[i - 1].closingRank);
  }

  const averageChange =
    changes.reduce((total, change) => total + change, 0) / changes.length;

  const trend: Trend =
    averageChange < -TREND_THRESHOLD
      ? "tightening"
      : averageChange > TREND_THRESHOLD
        ? "relaxing"
        : "stable";

  return { trend, delta: Math.round(Math.abs(averageChange)) };
}

// ─── Readouts ────────────────────────────────────────────────────────────────

/** Where this rank sits in the state, as a percentile. */
export function percentileFor(rank: number): number {
  const percentile = (1 - rank / TOTAL_CANDIDATES) * 100;
  return round4(Math.min(99.99, Math.max(1, percentile)));
}

/** A one-line read on what a rank is competitive for. */
export function standingFor(rank: number): string {
  if (rank < 1000) return "Top 0.5% — in range for RVCE and BMSCE CSE";
  if (rank < 5000) return "Top 2% — in range for tier 1 CSE and ECE";
  if (rank < 15000) return "Top 6% — strong options in CSE at tier 2 colleges";
  if (rank < 35000) return "Above average — top tier 2 IT and core branches";
  return "Around the state average — good private autonomous options";
}

export { RANK_BANDS };
