import {
  BRANCH_KEYS_2026,
  CATEGORY_KEYS_2026,
  COLLEGE_IDS,
  ROUND_KEYS_2026,
  SEAT_TYPES_2026,
  VERIFIED_2026_PACKED,
} from "./cutoffs-2026";
import type {
  Branch,
  Category,
  CutoffEntry,
  CutoffHistoryPoint,
  Round,
  SeatType,
} from "@/types";

/* ============================================================================
 * KCET cut-offs, in two tiers.
 *
 * TIER 1 — VERIFIED
 *   Every 2026 row is a closing rank KEA published, lifted from the UGCET 2026
 *   allotment reports for rounds 1-3, Regular and 371(j) Kalyana-Karnataka.
 *   46,590 rows across 238 colleges. Every closing rank here is as printed;
 *   the opening ranks beside them are not published and are estimated.
 *
 * TIER 2 — DERIVED
 *   2018-2025 does not exist in machine-readable form on the KEA site, so it
 *   is projected backwards from the verified 2026 round-3 anchor using the
 *   documented multipliers below. These are estimates, not published figures.
 *
 * Why the earlier years are not pre-built: 15,530 anchors x 8 years x 4 rounds
 * is about 497,000 rows. They are derived per query and memoised instead, so
 * the values are identical without holding half a million objects in
 * memory. `cutoffs` therefore contains the verified year; ask for a past year
 * and it is produced on the spot.
 * ========================================================================== */

/* ─── Tier 2 multipliers, all documented ─── */

/**
 * ASSUMPTION, not a measurement. Only one year is published here, so nothing
 * in this dataset establishes a growth rate; 18% stands in for the roughly
 * 15-20% a year that closing ranks have drifted as the candidate pool grew.
 * Replace it the moment a second year of real cut-offs is loaded.
 */
const ANNUAL_GROWTH = 1.18;

/**
 * A round's closing rank relative to the final round of the same year.
 *
 * R1 and R2 are measured, not assumed: across the ~12,000 seats that 2026
 * published in all three rounds, round 1 closes at a mean 0.667 of round 3 and
 * round 2 at 0.861. MOCK is the one assumption here — KEA publishes no mock
 * allotment — and is placed the same distance below R1 as R1 sits below R2.
 */
const ROUND_FACTOR: Record<Round, number> = {
  MOCK: 0.62,
  R1: 0.667,
  R2: 0.861,
  R3: 1,
};

/**
 * DERIVED, even on a verified row. KEA publishes closing ranks only, so every
 * opening rank in this file is an estimate at 62% of the closing rank and must
 * not be presented as a published figure.
 */
const OPENING_FACTOR = 0.62;

export const VERIFIED_YEAR = 2026;
export const FIRST_DERIVED_YEAR = 2018;

/** Predictions measure against the latest year that has a full set of rounds. */
export const CUTOFF_DATA_YEAR = VERIFIED_YEAR;

export const AVAILABLE_YEARS: number[] = Array.from(
  { length: VERIFIED_YEAR - FIRST_DERIVED_YEAR + 1 },
  (_, i) => VERIFIED_YEAR - i
);

export const HAS_MULTI_YEAR_DATA = AVAILABLE_YEARS.length > 1;

const ROUND_ORDER = new Map<Round, number>([
  ["MOCK", 0],
  ["R1", 1],
  ["R2", 2],
  ["R3", 3],
]);

/* ─── Tier 1: expand the verified tuples ─── */

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Reads the packed table back into rows.
 *
 * Each record is five base-36 index digits and then the published rank; see
 * the layout note at the top of cutoffs-2026.ts.
 */
function expand(): CutoffEntry[] {
  const records = VERIFIED_2026_PACKED.split(";");
  const rows: CutoffEntry[] = new Array(records.length);

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const closingRank = Number(record.slice(6));

    rows[i] = {
      collegeId: COLLEGE_IDS[parseInt(record.slice(0, 2), 36)],
      branch: BRANCH_KEYS_2026[parseInt(record[2], 36)] as Branch,
      category: CATEGORY_KEYS_2026[parseInt(record[3], 36)] as Category,
      round: ROUND_KEYS_2026[parseInt(record[4], 36)] as Round,
      seatType: SEAT_TYPES_2026[parseInt(record[5], 36)] as SeatType,
      year: VERIFIED_YEAR,
      closingRank,
      openingRank: round2(closingRank * OPENING_FACTOR),
    };
  }

  return rows;
}

/** Every verified row. */
export const cutoffs: CutoffEntry[] = expand();
export const ALL_CUTOFFS = cutoffs;
export const VERIFIED_CUTOFFS = cutoffs;
/** Tier 1 by its year, for callers that want the name to say so. */
export const cutoffs2026 = cutoffs;

/* ─── Indexes ─── */

const key = (...parts: (string | number)[]) => parts.join("|");

const byExact = new Map<string, CutoffEntry>();
const byCollege = new Map<string, CutoffEntry[]>();
const bySeries = new Map<string, CutoffEntry[]>();

for (const row of cutoffs) {
  byExact.set(key(row.collegeId, row.branch, row.category, row.round, row.seatType), row);

  const forCollege = byCollege.get(row.collegeId);
  if (forCollege) forCollege.push(row);
  else byCollege.set(row.collegeId, [row]);

  const seriesKey = key(row.collegeId, row.branch, row.category, row.seatType);
  const series = bySeries.get(seriesKey);
  if (series) series.push(row);
  else bySeries.set(seriesKey, [row]);
}

export const COLLEGE_IDS_WITH_CUTOFFS: string[] = [...byCollege.keys()];

/* ─── Tier 2: derive a past year on demand ─── */

/** The final-round anchor a projection starts from. */
function anchorFor(
  collegeId: string,
  branch: Branch,
  category: Category,
  seatType: SeatType
): number | undefined {
  const r3 = byExact.get(key(collegeId, branch, category, "R3", seatType));
  if (r3) return r3.closingRank;

  // Some seats close before round 3; scale an earlier round up to R3 terms.
  const r2 = byExact.get(key(collegeId, branch, category, "R2", seatType));
  if (r2) return r2.closingRank / ROUND_FACTOR.R2;

  const r1 = byExact.get(key(collegeId, branch, category, "R1", seatType));
  if (r1) return r1.closingRank / ROUND_FACTOR.R1;

  return undefined;
}

const derivedCache = new Map<string, CutoffEntry[]>();

/**
 * The 2018-2025 rows for one seat, projected back from its verified anchor.
 * DERIVED — every value here is calculated, not published.
 */
export function deriveSeries(
  collegeId: string,
  branch: Branch,
  category: Category,
  seatType: SeatType = "Regular"
): CutoffEntry[] {
  const cacheKey = key(collegeId, branch, category, seatType);
  const cached = derivedCache.get(cacheKey);
  if (cached) return cached;

  const anchor = anchorFor(collegeId, branch, category, seatType);
  if (anchor === undefined) {
    derivedCache.set(cacheKey, []);
    return [];
  }

  const rows: CutoffEntry[] = [];
  for (let year = VERIFIED_YEAR - 1; year >= FIRST_DERIVED_YEAR; year--) {
    const yearsBack = VERIFIED_YEAR - year;
    const finalRound = anchor / Math.pow(ANNUAL_GROWTH, yearsBack);

    for (const round of ["MOCK", "R1", "R2", "R3"] as Round[]) {
      const closingRank = Math.max(1, Math.round(finalRound * ROUND_FACTOR[round]));
      rows.push({
        collegeId,
        branch,
        category,
        round,
        seatType,
        year,
        closingRank,
        openingRank: Math.max(1, Math.round(closingRank * OPENING_FACTOR)),
      });
    }
  }

  derivedCache.set(cacheKey, rows);
  return rows;
}

/* ─── Queries ─── */

export interface CutoffQuery {
  collegeId?: string;
  branch?: Branch;
  category?: Category;
  round?: Round;
  seatType?: SeatType;
  year?: number;
}

/**
 * Rows matching the given axes.
 *
 * Defaults to the verified year and the Regular pool. Ask for an earlier year
 * and the projection runs for the seats that match.
 */
export function getCutoffs(query: CutoffQuery = {}): CutoffEntry[] {
  const seatType = query.seatType ?? "Regular";

  const pool =
    query.collegeId !== undefined
      ? (byCollege.get(query.collegeId) ?? [])
      : cutoffs;

  const verified = pool.filter(
    (row) =>
      row.seatType === seatType &&
      (query.branch === undefined || row.branch === query.branch) &&
      (query.category === undefined || row.category === query.category) &&
      (query.round === undefined || row.round === query.round)
  );

  if (query.year === undefined || query.year === VERIFIED_YEAR) return verified;

  // A past year: project each matching seat, then keep the asked-for round.
  const seats = new Set(verified.map((r) => key(r.collegeId, r.branch, r.category)));
  const out: CutoffEntry[] = [];
  for (const seat of seats) {
    const [collegeId, branch, category] = seat.split("|");
    for (const row of deriveSeries(collegeId, branch as Branch, category as Category, seatType)) {
      if (row.year !== query.year) continue;
      if (query.round !== undefined && row.round !== query.round) continue;
      out.push(row);
    }
  }
  return out;
}

/** A single row, verified when the year is 2026, otherwise projected. */
export function getCutoff(
  collegeId: string,
  branch: Branch,
  category: Category,
  round: Round,
  year: number = VERIFIED_YEAR,
  seatType: SeatType = "Regular"
): CutoffEntry | undefined {
  if (year === VERIFIED_YEAR) {
    return byExact.get(key(collegeId, branch, category, round, seatType));
  }
  return deriveSeries(collegeId, branch, category, seatType).find(
    (row) => row.year === year && row.round === round
  );
}

export const getCutoffsByCollege = (id: string): CutoffEntry[] =>
  byCollege.get(id) ?? [];

/** The headline figure: the final round of the verified year. */
export const getLatestCutoff = (
  collegeId: string,
  branch: Branch,
  category: Category,
  seatType: SeatType = "Regular"
): CutoffEntry | undefined =>
  byExact.get(key(collegeId, branch, category, "R3", seatType));

/**
 * Final-round closing ranks from 2018 to 2026, oldest first — the series a
 * trend chart plots. 2026 is verified; everything before it is projected.
 */
export function getCutoffHistory(
  collegeId: string,
  branch: Branch,
  category: Category,
  seatType: SeatType = "Regular"
): CutoffHistoryPoint[] {
  const verified = (bySeries.get(key(collegeId, branch, category, seatType)) ?? []).map(
    (row) => ({
      year: row.year,
      round: row.round,
      openingRank: row.openingRank,
      closingRank: row.closingRank,
    })
  );

  const derived = deriveSeries(collegeId, branch, category, seatType).map((row) => ({
    year: row.year,
    round: row.round,
    openingRank: row.openingRank,
    closingRank: row.closingRank,
  }));

  return [...derived, ...verified].sort(
    (a, b) =>
      a.year - b.year ||
      (ROUND_ORDER.get(a.round) ?? 0) - (ROUND_ORDER.get(b.round) ?? 0)
  );
}

/** The rank a seat last closed at in a year — its deepest published round. */
export function getFinalClosingRank(
  collegeId: string,
  branch: Branch,
  category: Category,
  year: number = VERIFIED_YEAR,
  seatType: SeatType = "Regular"
): number | undefined {
  const rows = getCutoffs({ collegeId, branch, category, year, seatType });
  if (rows.length === 0) return undefined;

  return rows.reduce((deepest, row) =>
    (ROUND_ORDER.get(row.round) ?? 0) > (ROUND_ORDER.get(deepest.round) ?? 0)
      ? row
      : deepest
  ).closingRank;
}

/** Branches with published cut-offs at a college. */
export function getBranchesWithCutoffs(collegeId: string): Branch[] {
  const present = new Set((byCollege.get(collegeId) ?? []).map((row) => row.branch));
  return [...present];
}
