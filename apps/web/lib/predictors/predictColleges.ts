import type { PrismaClient } from "@prisma/client";
import { classifyCollegeCourse, type ClassificationResult } from "./collegePredictor";

export interface CollegePredictionFilters {
  categoryCode: string;
  rank: number;
  /** Match College.city exactly, if given. */
  city?: string;
  /** Only college-courses with feesInr <= this (college-courses with unknown fees
   * are excluded when this filter is set). */
  maxFeesInr?: number;
  /** Only these Course.code values ("branches"), if given. */
  courseCodes?: string[];
}

export interface CollegePrediction extends ClassificationResult {
  collegeCode: string;
  collegeName: string;
  city: string | null;
  courseCode: string;
  courseName: string;
  feesInr: number | null;
}

/**
 * For a rank + category + filters (location, fee cap, branches), classifies every
 * matching college-course as Safe/Target/Reach using its cutoff history, per
 * SPEC.md's college predictor. College-courses with no cutoff evidence for the given
 * category are skipped (nothing to classify against).
 */
export async function predictColleges(
  prisma: PrismaClient,
  filters: CollegePredictionFilters,
): Promise<CollegePrediction[]> {
  const collegeCourses = await prisma.collegeCourse.findMany({
    where: {
      ...(filters.maxFeesInr !== undefined ? { feesInr: { lte: filters.maxFeesInr } } : {}),
      ...(filters.city !== undefined ? { college: { city: filters.city } } : {}),
      ...(filters.courseCodes !== undefined ? { course: { code: { in: filters.courseCodes } } } : {}),
    },
    include: {
      college: true,
      course: true,
      cutoffs: { where: { categoryCode: filters.categoryCode } },
    },
  });

  const predictions: CollegePrediction[] = [];
  for (const collegeCourse of collegeCourses) {
    const classification = classifyCollegeCourse(
      collegeCourse.cutoffs.map((c) => ({ year: c.year, round: c.round, closingRank: c.closingRank })),
      filters.rank,
    );
    if (!classification) continue;

    predictions.push({
      ...classification,
      collegeCode: collegeCourse.college.code,
      collegeName: collegeCourse.college.name,
      city: collegeCourse.college.city,
      courseCode: collegeCourse.course.code,
      courseName: collegeCourse.course.name,
      feesInr: collegeCourse.feesInr,
    });
  }
  return predictions;
}
