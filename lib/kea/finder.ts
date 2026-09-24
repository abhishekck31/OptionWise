import { separateRankList } from "./courses";
import type { KeaPool, KeaReport, KeaYearFile } from "./types";

/**
 * Which seats a rank would have got, read straight off one year's published
 * closing ranks.
 *
 * A seat counts when its closing rank in a round — the last rank KEA allotted
 * it to in the student's category — is at or after the student's rank. Two
 * more ways in are checked, because KEA allots them too:
 *
 *  - General Merit. Every candidate, reserved or not, is considered for GM
 *    seats on merit, so a 3BG student can land a seat whose 3BG column closed
 *    early but whose GM column closed later.
 *  - The 371(j) pool. A Kalyana-Karnataka candidate is considered for both the
 *    general report's seats and the 371(j) report's.
 *
 * The result is a reading of last year, not a promise: seat matrices change,
 * and so do the number of candidates and the difficulty of the paper.
 */

export type Route = "category" | "GM" | "HK" | "HK-GM";

export interface SeatMatch {
  code: string;
  college: string;
  course: string;
  /** The closing rank that let this rank in. */
  closingRank: number;
  /** How the seat was reached. */
  route: Route;
  /** closingRank − rank: how far past the student's rank the seat stayed open. */
  room: number;
}

export interface RoundResult {
  round: string;
  label: string;
  reports: KeaReport[];
  seats: SeatMatch[];
  /** Seats that closed within `nearMissShare` before this rank. */
  nearMisses: SeatMatch[];
}

export interface FinderInput {
  rank: number;
  category: string;
  hk: boolean;
  /** Also consider GM seats for a reserved category. Default true. */
  includeGM?: boolean;
  /** A near miss closed no more than this share before the rank. Default 0.1. */
  nearMissShare?: number;
}

const ROUND_ORDER = ["MOCK", "R1", "R2", "R3", "R4"];

export function findSeats(data: KeaYearFile, input: FinderInput): RoundResult[] {
  const { rank, category, hk } = input;
  const includeGM = input.includeGM ?? true;
  const share = input.nearMissShare ?? 0.1;

  const catIndex = data.categories.indexOf(category);
  const gmIndex = data.categories.indexOf("GM");
  const pools: KeaPool[] = hk ? ["GEN", "HK"] : ["GEN"];

  const rounds = ROUND_ORDER.filter((round) => data.reports.some((r) => r.round === round && r.pool === "GEN"));

  return rounds.map((round) => {
    const reports = data.reports.filter((r) => r.round === round && pools.includes(r.pool));
    const seats: SeatMatch[] = [];
    const nearMisses: SeatMatch[] = [];

    for (const college of data.colleges) {
      for (const course of college.courses) {
        // Filled from a different merit list; not comparable with this rank.
        if (separateRankList(course.name)) continue;

        // Every way this rank could reach the seat, best (latest closing) first.
        const options: { closingRank: number; route: Route }[] = [];
        for (const report of reports) {
          const ranks = course.ranks[report.id];
          if (!ranks) continue;
          const own = catIndex >= 0 ? ranks[catIndex] : 0;
          const gm = gmIndex >= 0 ? ranks[gmIndex] : 0;
          const inHK = report.pool === "HK";
          if (own > 0) options.push({ closingRank: own, route: inHK ? "HK" : "category" });
          if (includeGM && category !== "GM" && gm > 0) {
            options.push({ closingRank: gm, route: inHK ? "HK-GM" : "GM" });
          }
        }
        if (options.length === 0) continue;

        options.sort((a, b) => b.closingRank - a.closingRank);
        const best = options[0];
        const match: SeatMatch = {
          code: college.code,
          college: college.name,
          course: course.name,
          closingRank: best.closingRank,
          route: best.route,
          room: best.closingRank - rank,
        };

        if (best.closingRank >= rank) seats.push(match);
        else if (best.closingRank >= rank * (1 - share)) nearMisses.push(match);
      }
    }

    // Most sought-after first: the seat that closed earliest is the one the
    // most people above this rank wanted.
    seats.sort((a, b) => a.closingRank - b.closingRank);
    nearMisses.sort((a, b) => b.closingRank - a.closingRank);

    const genReport = data.reports.find((r) => r.round === round && r.pool === "GEN");
    return { round, label: genReport?.label ?? round, reports, seats, nearMisses };
  });
}
