import showcaseJson from "@/data/kea/showcase.json";

/**
 * Every figure the homepage shows off, computed by the data pipeline from
 * KEA's published reports. The showcase cards look like marketing, but none of
 * their numbers is typed in by hand — rebuild the data and they follow.
 */

interface ShowcaseRound {
  round: string;
  label: string;
  mock: boolean;
  provisional: boolean;
}

interface Showcase {
  year: number;
  rounds: ShowcaseRound[];
  finalRound: ShowcaseRound;
  collegesInLatestYear: number;
  yearsCovered: number;
  firstYear: number;
  missingYears: number[];
  totalRanks: number;
  reports: number;
  flagship: { code: string; shortName: string; course: string; ranks: Record<string, number> } | null;
  topCse: { code: string; appId: string | null; shortName: string | null; rank: number }[];
  rankStops: number[];
  reachableAtStops: Record<string, number[]>;
}

export const SHOWCASE = showcaseJson as Showcase;

export const LATEST_YEAR = SHOWCASE.year;
export const COLLEGE_COUNT = SHOWCASE.collegesInLatestYear;
export const YEARS_COVERED = SHOWCASE.yearsCovered;
export const FIRST_YEAR = SHOWCASE.firstYear;
export const TOTAL_RANKS = SHOWCASE.totalRanks;

const shortName = (name: string | null, code: string) => (name ?? code).replace(/\s+E\d{3}$/, "");

/** A round's name with KEA's own caveat attached, e.g. "Round 3 (provisional)". */
export const roundName = (r: ShowcaseRound) =>
  `${r.label}${r.mock ? " (mock)" : r.provisional ? " (provisional)" : ""}`;

/** The most contested computer science seats in the latest final round. */
export const TOP_CSE = SHOWCASE.topCse.map((seat) => ({
  code: seat.code,
  href: `/college/${seat.appId ?? seat.code}`,
  shortName: shortName(seat.shortName, seat.code),
  closingRank: seat.rank,
}));

/** RVCE computer science, general merit, round by round. */
export const FLAGSHIP = SHOWCASE.flagship && {
  ...SHOWCASE.flagship,
  shortName: shortName(SHOWCASE.flagship.shortName, SHOWCASE.flagship.code),
};

/** Courses a GM rank reached, per round, at the nearest published stop. */
export function reachable(rank: number): { round: ShowcaseRound; count: number }[] {
  let stop = 0;
  SHOWCASE.rankStops.forEach((s, i) => {
    if (s <= rank) stop = i;
  });
  return SHOWCASE.rounds.map((round) => ({
    round,
    count: SHOWCASE.reachableAtStops[round.round]?.[stop] ?? 0,
  }));
}
