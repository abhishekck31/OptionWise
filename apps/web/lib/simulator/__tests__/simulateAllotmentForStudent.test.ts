// @vitest-environment node
import { PrismaClient } from "@prisma/client";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { simulateAllotmentForStudent } from "../simulateAllotmentForStudent";

const prisma = new PrismaClient();

async function truncateAll() {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "Cutoff", "CollegeCourse", "PlacementStat", "College", "Course",
      "Message", "Report", "AuditLog", "AlumniProfile", "User" RESTART IDENTITY CASCADE;`,
  );
}

beforeAll(async () => {
  await truncateAll();
});

afterEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("simulateAllotmentForStudent", () => {
  it("uses only the most recent year's cutoffs, ignoring older years", async () => {
    const college = await prisma.college.create({
      data: { code: "SIM-A", name: "Sim College A", source: "test", isSample: true },
    });
    const course = await prisma.course.create({ data: { code: "SIM-CS", name: "CS", source: "test", isSample: true } });
    const collegeCourse = await prisma.collegeCourse.create({
      data: { collegeId: college.id, courseId: course.id, source: "test", isSample: true },
    });

    await prisma.cutoff.createMany({
      data: [
        // Older year: rank 20000 would NOT clear this (too high a rank number).
        { collegeCourseId: collegeCourse.id, year: 2023, round: 1, categoryCode: "GM", closingRank: 5000, source: "t", isSample: true },
        // Most recent year: rank 20000 clears this.
        { collegeCourseId: collegeCourse.id, year: 2024, round: 1, categoryCode: "GM", closingRank: 25000, source: "t", isSample: true },
      ],
    });

    const result = await simulateAllotmentForStudent(prisma, {
      orderedCollegeCourseIds: [collegeCourse.id],
      categoryCode: "GM",
      rank: 20000,
    });

    expect(result.year).toBe(2024);
    expect(result.finalOptionId).toBe(collegeCourse.id);
  });

  it("returns year:null and no rounds when there is no cutoff data", async () => {
    const result = await simulateAllotmentForStudent(prisma, {
      orderedCollegeCourseIds: ["nonexistent-id"],
      categoryCode: "GM",
      rank: 1000,
    });
    expect(result).toEqual({ rounds: [], finalOptionId: null, year: null });
  });

  it("simulates round-by-round upgrades across two real college-courses", async () => {
    const college = await prisma.college.create({
      data: { code: "SIM-B", name: "Sim College B", source: "test", isSample: true },
    });
    const [courseA, courseB] = await Promise.all([
      prisma.course.create({ data: { code: "SIM-A1", name: "A1", source: "test", isSample: true } }),
      prisma.course.create({ data: { code: "SIM-B1", name: "B1", source: "test", isSample: true } }),
    ]);
    const [ccA, ccB] = await Promise.all([
      prisma.collegeCourse.create({ data: { collegeId: college.id, courseId: courseA.id, source: "test", isSample: true } }),
      prisma.collegeCourse.create({ data: { collegeId: college.id, courseId: courseB.id, source: "test", isSample: true } }),
    ]);

    await prisma.cutoff.createMany({
      data: [
        { collegeCourseId: ccA.id, year: 2024, round: 1, categoryCode: "GM", closingRank: 10000, source: "t", isSample: true },
        { collegeCourseId: ccA.id, year: 2024, round: 2, categoryCode: "GM", closingRank: 25000, source: "t", isSample: true },
        { collegeCourseId: ccB.id, year: 2024, round: 1, categoryCode: "GM", closingRank: 50000, source: "t", isSample: true },
        { collegeCourseId: ccB.id, year: 2024, round: 2, categoryCode: "GM", closingRank: 50000, source: "t", isSample: true },
      ],
    });

    const result = await simulateAllotmentForStudent(prisma, {
      orderedCollegeCourseIds: [ccA.id, ccB.id],
      categoryCode: "GM",
      rank: 20000,
    });

    expect(result.rounds).toEqual([
      { round: 1, allottedOptionId: ccB.id },
      { round: 2, allottedOptionId: ccA.id },
    ]);
  });
});
