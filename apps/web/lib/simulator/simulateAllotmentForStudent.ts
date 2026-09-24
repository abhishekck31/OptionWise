import type { PrismaClient } from "@prisma/client";
import { simulateAllotment, type SimulationOption, type SimulationResult } from "./allotmentSimulator";

export interface SimulateAllotmentParams {
  /** Preference-ordered CollegeCourse ids — e.g. from the option builder's entries. */
  orderedCollegeCourseIds: string[];
  categoryCode: string;
  rank: number;
}

/**
 * Simulates allotment for a student's option list against the most recent year of
 * cutoffs available for those college-courses/category (SPEC.md: "simulate rounds
 * against previous-year cutoffs" — see SIMULATION_LABEL for the required UI label).
 * Returns year: null if there's no cutoff data at all for any listed college-course.
 */
export async function simulateAllotmentForStudent(
  prisma: PrismaClient,
  params: SimulateAllotmentParams,
): Promise<SimulationResult & { year: number | null }> {
  if (params.orderedCollegeCourseIds.length === 0) {
    return { rounds: [], finalOptionId: null, year: null };
  }

  const cutoffs = await prisma.cutoff.findMany({
    where: {
      collegeCourseId: { in: params.orderedCollegeCourseIds },
      categoryCode: params.categoryCode,
    },
  });

  if (cutoffs.length === 0) {
    return { rounds: [], finalOptionId: null, year: null };
  }

  const mostRecentYear = Math.max(...cutoffs.map((c) => c.year));

  const options: Record<string, SimulationOption> = {};
  for (const id of params.orderedCollegeCourseIds) {
    options[id] = { id, roundCutoffs: [] };
  }
  for (const cutoff of cutoffs) {
    if (cutoff.year !== mostRecentYear) continue;
    options[cutoff.collegeCourseId]?.roundCutoffs.push({ round: cutoff.round, closingRank: cutoff.closingRank });
  }

  const result = simulateAllotment(params.orderedCollegeCourseIds, options, params.rank);
  return { ...result, year: mostRecentYear };
}
