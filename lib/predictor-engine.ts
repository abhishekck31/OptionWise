import { College, BranchCutoff, CategoryKey, KCET_COLLEGES } from "./kcet-data";

export interface MarksInput {
  boardPhysics: number;
  boardChemistry: number;
  boardMath: number;
  kcetPhysics: number;
  kcetChemistry: number;
  kcetMath: number;
}

export interface PredictionResult {
  boardTotal: number;
  boardPercentage: number;
  kcetTotal: number;
  kcetPercentage: number;
  aggregateScore: number;
  predictedRank: number;
  predictedRankMin: number;
  predictedRankMax: number;
  percentile: number;
  competitiveStanding: string;
}

export interface CollegeMatch {
  college: College;
  branch: BranchCutoff;
  category: CategoryKey;
  round1Cutoff: number;
  round2Cutoff: number;
  extendedCutoff: number;
  admissionChance: number; // 0 to 100%
  tier: "Safe" | "Target" | "Reach";
  rankDifference: number; // candidateRank - cutoff
  scoreMargin: number;
}

/**
 * Stable identifier for a college match
 */
type ChoiceIdInput =
  | string
  | {
      id?: string;
      college?: { code?: string; id?: string };
      branch?: string | { branchCode?: string; shortName?: string };
    }
  | null
  | undefined;

export function choiceId(match: ChoiceIdInput): string {
  if (!match) return "";
  if (typeof match === "string") return match;
  if (match.id) return match.id;

  const col = match.college?.code || match.college?.id || "COL";
  const branch =
    typeof match.branch === "string"
      ? match.branch
      : match.branch?.branchCode || match.branch?.shortName || "BR";

  return `${col}-${branch}`;
}

/**
 * Calculates aggregate score according to KEA 50:50 rules
 */
export function calculateScores(marks: MarksInput): {
  boardTotal: number;
  boardPercentage: number;
  kcetTotal: number;
  kcetPercentage: number;
  aggregateScore: number;
} {
  const boardTotal = Math.min(300, Math.max(0, marks.boardPhysics + marks.boardChemistry + marks.boardMath));
  const boardPercentage = (boardTotal / 300) * 100;

  const kcetTotal = Math.min(180, Math.max(0, marks.kcetPhysics + marks.kcetChemistry + marks.kcetMath));
  const kcetPercentage = (kcetTotal / 180) * 100;

  // 50% Board + 50% KCET
  const aggregateScore = Number(((boardPercentage * 0.5) + (kcetPercentage * 0.5)).toFixed(3));

  return {
    boardTotal,
    boardPercentage: Number(boardPercentage.toFixed(2)),
    kcetTotal,
    kcetPercentage: Number(kcetPercentage.toFixed(2)),
    aggregateScore
  };
}

const SCORE_RANK_BENCHMARKS = [
  { score: 99.0, rank: 65, spread: 25 },
  { score: 97.5, rank: 250, spread: 60 },
  { score: 96.0, rank: 600, spread: 120 },
  { score: 94.5, rank: 1150, spread: 200 },
  { score: 93.0, rank: 1950, spread: 350 },
  { score: 91.5, rank: 3100, spread: 500 },
  { score: 90.0, rank: 4600, spread: 700 },
  { score: 88.0, rank: 7200, spread: 950 },
  { score: 86.0, rank: 10500, spread: 1300 },
  { score: 84.0, rank: 14600, spread: 1700 },
  { score: 82.0, rank: 19500, spread: 2200 },
  { score: 80.0, rank: 25200, spread: 2700 },
  { score: 77.0, rank: 35000, spread: 3500 },
  { score: 74.0, rank: 47000, spread: 4200 },
  { score: 70.0, rank: 64000, spread: 5500 },
  { score: 66.0, rank: 84000, spread: 7000 },
  { score: 62.0, rank: 108000, spread: 9000 },
  { score: 58.0, rank: 135000, spread: 11000 },
  { score: 54.0, rank: 165000, spread: 13000 },
  { score: 50.0, rank: 195000, spread: 15000 },
  { score: 40.0, rank: 240000, spread: 18000 },
];

export function predictRankFromScore(aggregateScore: number): PredictionResult {
  const score = Math.max(30, Math.min(100, aggregateScore));

  let predictedRank = 250000;
  let spread = 15000;

  if (score >= SCORE_RANK_BENCHMARKS[0].score) {
    const diff = score - SCORE_RANK_BENCHMARKS[0].score;
    predictedRank = Math.max(1, Math.round(SCORE_RANK_BENCHMARKS[0].rank - diff * 50));
    spread = 15;
  } else if (score <= SCORE_RANK_BENCHMARKS[SCORE_RANK_BENCHMARKS.length - 1].score) {
    predictedRank = SCORE_RANK_BENCHMARKS[SCORE_RANK_BENCHMARKS.length - 1].rank;
    spread = 20000;
  } else {
    for (let i = 0; i < SCORE_RANK_BENCHMARKS.length - 1; i++) {
      const high = SCORE_RANK_BENCHMARKS[i];
      const low = SCORE_RANK_BENCHMARKS[i + 1];

      if (score <= high.score && score >= low.score) {
        const ratio = (high.score - score) / (high.score - low.score);
        predictedRank = Math.round(high.rank + ratio * (low.rank - high.rank));
        spread = Math.round(high.spread + ratio * (low.spread - high.spread));
        break;
      }
    }
  }

  const predictedRankMin = Math.max(1, predictedRank - spread);
  const predictedRankMax = predictedRank + spread;

  const totalCandidates = 265000;
  const percentile = Number(Math.max(1, Math.min(99.99, (1 - predictedRank / totalCandidates) * 100)).toFixed(2));

  let competitiveStanding = "Moderate Competitive";
  if (predictedRank < 1000) competitiveStanding = "Top 0.5% — Eligible for RVCE / BMSCE CSE";
  else if (predictedRank < 5000) competitiveStanding = "Top 2% — Eligible for Tier 1 CSE / ECE";
  else if (predictedRank < 15000) competitiveStanding = "Top 6% — Strong Tier 1.5 & Tier 2 CSE";
  else if (predictedRank < 35000) competitiveStanding = "Above Average — Top Tier 2 IT & Core";
  else competitiveStanding = "State Average — Good Private Autonomous Options";

  return {
    boardTotal: 0,
    boardPercentage: 0,
    kcetTotal: 0,
    kcetPercentage: 0,
    aggregateScore,
    predictedRank,
    predictedRankMin,
    predictedRankMax,
    percentile,
    competitiveStanding
  };
}

export function predictRank(marks: MarksInput): PredictionResult {
  const scores = calculateScores(marks);
  const rankData = predictRankFromScore(scores.aggregateScore);

  return {
    ...scores,
    ...rankData
  };
}

export function matchColleges(
  candidateRank: number,
  category: CategoryKey = "GM",
  filters?: {
    branchCode?: string;
    location?: string;
    tierFilter?: "ALL" | "Safe" | "Target" | "Reach";
  }
): CollegeMatch[] {
  const matches: CollegeMatch[] = [];

  for (const college of KCET_COLLEGES) {
    if (filters?.location && filters.location !== "ALL" && college.city !== filters.location) {
      continue;
    }

    for (const branch of college.branches) {
      if (filters?.branchCode && filters.branchCode !== "ALL" && branch.shortName !== filters.branchCode) {
        continue;
      }

      const r1 = branch.round1Cutoff[category] || branch.round1Cutoff.GM || 5000;
      const r2 = branch.round2Cutoff[category] || branch.round2Cutoff.GM || 6000;
      const rExt = branch.extendedRoundCutoff[category] || branch.extendedRoundCutoff.GM || 7000;

      let chance = 50;
      let tier: "Safe" | "Target" | "Reach" = "Target";

      if (candidateRank <= r1 * 0.75) {
        chance = 99;
        tier = "Safe";
      } else if (candidateRank <= r1) {
        chance = Math.round(86 + ((r1 - candidateRank) / (r1 * 0.25)) * 12);
        tier = "Safe";
      } else if (candidateRank <= r2) {
        chance = Math.round(65 + ((r2 - candidateRank) / Math.max(r2 - r1, 1)) * 20);
        tier = "Target";
      } else if (candidateRank <= rExt) {
        chance = Math.round(45 + ((rExt - candidateRank) / Math.max(rExt - r2, 1)) * 19);
        tier = "Target";
      } else if (candidateRank <= rExt * 1.25) {
        chance = Math.round(20 + ((rExt * 1.25 - candidateRank) / (rExt * 0.25)) * 24);
        tier = "Reach";
      } else {
        chance = Math.max(5, Math.round(20 - ((candidateRank - rExt * 1.25) / rExt) * 15));
        tier = "Reach";
      }

      chance = Math.max(1, Math.min(99, chance));

      if (filters?.tierFilter && filters.tierFilter !== "ALL" && tier !== filters.tierFilter) {
        continue;
      }

      matches.push({
        college,
        branch,
        category,
        round1Cutoff: r1,
        round2Cutoff: r2,
        extendedCutoff: rExt,
        admissionChance: chance,
        tier,
        rankDifference: candidateRank - r2,
        scoreMargin: Number(((r2 - candidateRank) / r2 * 100).toFixed(1))
      });
    }
  }

  return matches.sort((a, b) => {
    if (b.admissionChance !== a.admissionChance) {
      return b.admissionChance - a.admissionChance;
    }
    return a.round2Cutoff - b.round2Cutoff;
  });
}

export function generateOptimizedChoiceList(
  candidateRank: number,
  category: CategoryKey = "GM"
): {
  dreamChoices: CollegeMatch[];
  targetChoices: CollegeMatch[];
  safeChoices: CollegeMatch[];
  totalRecommended: number;
} {
  const allMatches = matchColleges(candidateRank, category);

  const dreamChoices = allMatches
    .filter((m) => m.tier === "Reach" && m.admissionChance >= 20)
    .slice(0, 5);

  const targetChoices = allMatches
    .filter((m) => m.tier === "Target")
    .slice(0, 8);

  const safeChoices = allMatches
    .filter((m) => m.tier === "Safe")
    .slice(0, 7);

  return {
    dreamChoices,
    targetChoices,
    safeChoices,
    totalRecommended: dreamChoices.length + targetChoices.length + safeChoices.length
  };
}
