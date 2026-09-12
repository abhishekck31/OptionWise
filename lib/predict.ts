import { colleges, getCollegeById } from "@/lib/data/colleges";
import {
  CUTOFF_DATA_YEAR,
  getCutoff,
  getCutoffHistory,
  getCutoffs,
} from "@/lib/data/cutoffs";
import {
  calculateChancePercent,
  getChanceLabel,
  getTier,
  getTrend,
} from "@/lib/kcet-formula";
import { BRANCHES } from "@/types";
import type {
  Branch,
  Category,
  College,
  CollegePreferenceInput,
  CutoffHistoryPoint,
  OptionEntry,
  PredictionResult,
  Tier,
} from "@/types";

/** Predictions are measured against the last complete year's final round. */
const PREDICTION_YEAR = CUTOFF_DATA_YEAR;

/**
 * Ranks up to 12% past the closing rank are still shown, so a student can see
 * the stretch options just out of reach rather than only what is comfortable.
 */
const STRETCH_BUFFER = 1.12;

const MAX_RESULTS = 60;

/** Stable identity for a college + branch pair. */
export function predictionId(collegeId: string, branch: Branch): string {
  return `${collegeId}-${branch}`;
}

/**
 * Treats an empty list, or one holding only an "any" sentinel, as no filter.
 * A filter that matches nothing would otherwise empty the whole page.
 */
function activeFilter<T extends string>(values: readonly T[]): Set<T> | null {
  const meaningful = values.filter(
    (value) => !["any", "all"].includes(String(value).toLowerCase())
  );
  return meaningful.length > 0 ? new Set(meaningful) : null;
}

/* ─── 2. Cutoff history ─────────────────────────────────────────────────── */

/**
 * The final-round closing rank for one seat, every year, oldest first.
 *
 * Round 3 only: that is where a seat actually closed, so it is the series a
 * trend is read off. 2026 is published; the years before it are projected.
 */
export function getCollegeCutoffHistory(
  collegeId: string,
  branch: Branch,
  category: Category
): CutoffHistoryPoint[] {
  return getCutoffHistory(collegeId, branch, category)
    .filter((point) => point.round === "R3")
    .sort((a, b) => a.year - b.year);
}

/* ─── 1. Prediction ─────────────────────────────────────────────────────── */

interface ScoredPrediction {
  result: PredictionResult;
  /** Kept out of the result itself; only affects ordering. */
  deprioritised: boolean;
}

function buildPrediction(
  college: College,
  branch: Branch,
  category: Category,
  studentRank: number,
  closingRank: number,
  openingRank: number
): PredictionResult {
  const chancePercent = calculateChancePercent(studentRank, closingRank);
  const history = getCollegeCutoffHistory(college.id, branch, category);
  const { trend, delta } = getTrend(history);

  return {
    college,
    branch,
    branchName: BRANCHES[branch],
    closingRank,
    openingRank,
    yourRank: studentRank,
    round: "R3",
    year: PREDICTION_YEAR,
    chancePercent,
    chanceLabel: getChanceLabel(chancePercent),
    trend,
    // getTrend reports the size of the move; the sign carries the direction,
    // so a tightening cutoff reads as negative here.
    trendDelta: trend === "tightening" ? -delta : delta,
    tier: getTier(chancePercent),
    avgPackage: college.avgPackage,
    highestPackage: college.highestPackage,
  };
}

/**
 * The cutoff a Kalyana-Karnataka candidate is actually measured against.
 *
 * 371(j) is a separate seat pool with its own published report, not a column
 * on the general one, and an eligible candidate is considered for both. The
 * seat they can reach is therefore whichever pool admitted *further down* the
 * list — the higher closing rank. Taking the lower of the two would hand a
 * reserved-seat candidate a worse answer than a general one, which is the
 * opposite of what the reservation exists to do.
 */
function reachableCutoff(
  collegeId: string,
  branch: Branch,
  category: Category,
  general: { closingRank: number; openingRank: number }
): { closingRank: number; openingRank: number } {
  const regional = getCutoff(
    collegeId,
    branch,
    category,
    "R3",
    PREDICTION_YEAR,
    "HK"
  );

  if (regional && regional.closingRank > general.closingRank) {
    return {
      closingRank: regional.closingRank,
      openingRank: regional.openingRank,
    };
  }
  return general;
}

/**
 * Every seat the student's rank can realistically reach.
 *
 * Measured against round 3 of the latest complete year, which is the final
 * word on who actually got in.
 */
export function predictColleges(
  input: CollegePreferenceInput
): PredictionResult[] {
  const cityFilter = activeFilter(input.preferredCities);
  const branchFilter = activeFilter(input.preferredBranches);
  const typeFilter = activeFilter(input.collegeType);

  const rows = getCutoffs({
    round: "R3",
    year: PREDICTION_YEAR,
    category: input.category,
  });

  const scored: ScoredPrediction[] = [];

  for (const row of rows) {
    const college = getCollegeById(row.collegeId);
    if (!college) continue;

    // Cheap filters first, so an excluded row never costs a 371(j) lookup.
    if (cityFilter && !cityFilter.has(college.city)) continue;
    if (branchFilter && !branchFilter.has(row.branch)) continue;
    if (typeFilter && !typeFilter.has(college.type)) continue;
    if (input.maxFee !== null && college.annualFee > input.maxFee) continue;

    const { closingRank, openingRank } = input.isHKRegion
      ? reachableCutoff(row.collegeId, row.branch, input.category, row)
      : row;

    if (input.rank > closingRank * STRETCH_BUFFER) continue;

    scored.push({
      // Not removed, only pushed down: a student who would rather not take a
      // hostel can still see the colleges that would require one.
      deprioritised: !input.willingToHostel && !college.hasHostel,
      result: buildPrediction(
        college,
        row.branch,
        input.category,
        input.rank,
        closingRank,
        openingRank
      ),
    });
  }

  scored.sort((a, b) => {
    if (a.deprioritised !== b.deprioritised) return a.deprioritised ? 1 : -1;

    const byChance = b.result.chancePercent - a.result.chancePercent;
    if (byChance !== 0) return byChance;

    // Unranked colleges sort last rather than ahead of NIRF rank 1.
    const aNirf = a.result.college.nirfRank ?? Number.MAX_SAFE_INTEGER;
    const bNirf = b.result.college.nirfRank ?? Number.MAX_SAFE_INTEGER;
    if (aNirf !== bNirf) return aNirf - bNirf;

    const byPackage = b.result.avgPackage - a.result.avgPackage;
    if (byPackage !== 0) return byPackage;

    // Last resort, and the only key here read straight off published data:
    // the seat that filled earliest is the one the most people wanted.
    return a.result.closingRank - b.result.closingRank;
  });

  return scored.slice(0, MAX_RESULTS).map((entry) => entry.result);
}

/* ─── 3. Option entry strategy ──────────────────────────────────────────── */

export interface OptionEntryStrategy {
  aspirational: OptionEntry[];
  moderate: OptionEntry[];
  safe: OptionEntry[];
  advice: string;
  isBalanced: boolean;
}

/**
 * Groups an option list by tier and says what is wrong with its shape.
 *
 * The all-aspirational case is checked before the thin-on-safe case: a list
 * with nothing but reaches also has no safe seats, and the blunter warning is
 * the more useful one.
 */
export function generateOptionEntryStrategy(
  entries: OptionEntry[]
): OptionEntryStrategy {
  const aspirational = entries.filter((e) => e.tier === "Aspirational");
  const moderate = entries.filter((e) => e.tier === "Moderate");
  const safe = entries.filter((e) => e.tier === "Safe");

  const isBalanced =
    aspirational.length >= 2 && moderate.length >= 2 && safe.length >= 2;

  let advice: string;

  if (entries.length === 0) {
    advice = "Nothing on your list yet — add colleges from the predictor";
  } else if (aspirational.length === entries.length) {
    advice = "Your list is risky — mix in moderate and safe colleges";
  } else if (safe.length < 3) {
    advice =
      "Add at least 3 safe choices — colleges where your chance is above 75%";
  } else if (isBalanced) {
    advice = "Well balanced — you're set for counselling";
  } else {
    advice =
      "Safe options covered — add a few reaches and moderate picks to round the list out";
  }

  return { aspirational, moderate, safe, advice, isBalanced };
}

/* ─── 4. Top colleges for a branch ──────────────────────────────────────── */

/**
 * The most competitive colleges offering a branch, hardest to get into first.
 *
 * With no `studentRank`, the chance fields describe a candidate sitting
 * exactly on each cutoff — use them for ordering, not as a personal estimate.
 */
export function getTopCollegesForBranch(
  branch: Branch,
  category: Category,
  limit: number = 10,
  studentRank?: number
): PredictionResult[] {
  return getCutoffs({
    branch,
    category,
    round: "R3",
    year: PREDICTION_YEAR,
  })
    .map((row) => {
      const college = getCollegeById(row.collegeId);
      if (!college) return null;

      return buildPrediction(
        college,
        branch,
        category,
        studentRank ?? row.closingRank,
        row.closingRank,
        row.openingRank
      );
    })
    .filter((result): result is PredictionResult => result !== null)
    .sort((a, b) => a.closingRank - b.closingRank)
    .slice(0, limit);
}

/* ─── 5. Search ─────────────────────────────────────────────────────────── */

/**
 * Finds colleges by name, short name, city or KEA code.
 *
 * Matches earlier in a field outrank later ones, and a hit on the short name
 * outranks the same hit buried in the full name — so "BMS" leads with BMSCE.
 */
export function searchColleges(query: string): College[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  const matches: { college: College; score: number }[] = [];

  for (const college of colleges) {
    const fields = [
      college.shortName,
      college.kea_code,
      college.name,
      college.city,
    ];

    let best = Number.MAX_SAFE_INTEGER;
    fields.forEach((field, fieldIndex) => {
      const at = field.toLowerCase().indexOf(needle);
      if (at === -1) return;
      const score = at * 10 + fieldIndex;
      if (score < best) best = score;
    });

    if (best !== Number.MAX_SAFE_INTEGER) {
      matches.push({ college, score: best });
    }
  }

  return matches
    .sort(
      (a, b) => a.score - b.score || a.college.name.localeCompare(b.college.name)
    )
    .slice(0, 10)
    .map((match) => match.college);
}

/* ─── Kept for existing callers ─────────────────────────────────────────── */

/** The order tiers are shown in: reaches first, safe seats last. */
export const TIER_ORDER: Tier[] = ["Aspirational", "Moderate", "Safe"];

export interface SuggestedList {
  aspirational: PredictionResult[];
  moderate: PredictionResult[];
  safe: PredictionResult[];
  total: number;
}

/**
 * A starting option-entry list: a few out of reach at the top, a solid middle,
 * and enough safe seats at the bottom that the list cannot run out.
 */
export function suggestOptionList(input: CollegePreferenceInput): SuggestedList {
  const all = predictColleges(input);

  const aspirational = all.filter((p) => p.tier === "Aspirational").slice(0, 5);
  const moderate = all.filter((p) => p.tier === "Moderate").slice(0, 8);
  const safe = all.filter((p) => p.tier === "Safe").slice(0, 7);

  return {
    aspirational,
    moderate,
    safe,
    total: aspirational.length + moderate.length + safe.length,
  };
}

/** Wraps a prediction so it can go on the option list. */
export function toOptionEntry(
  prediction: PredictionResult,
  userNote = ""
): OptionEntry {
  return {
    id: predictionId(prediction.college.id, prediction.branch),
    prediction,
    tier: prediction.tier,
    userNote,
    addedAt: Date.now(),
  };
}

/** Predictions for every branch at one college, for the detail page. */
export function predictForCollege(
  collegeId: string,
  rank: number,
  category: Category
): PredictionResult[] {
  const college = getCollegeById(collegeId);
  if (!college) return [];

  return getCutoffs({
    collegeId,
    category,
    round: "R3",
    year: PREDICTION_YEAR,
  }).map((row) =>
    buildPrediction(
      college,
      row.branch,
      category,
      rank,
      row.closingRank,
      row.openingRank
    )
  );
}
