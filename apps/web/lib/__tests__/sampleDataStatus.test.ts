// @vitest-environment node
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { getSampleDataStatus } from "@/lib/sampleDataStatus";

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

async function createCutoff(isSample: boolean) {
  const college = await prisma.college.create({
    data: { code: `C-${isSample}`, name: "Test College", source: "test", isSample },
  });
  const course = await prisma.course.create({
    data: { code: `CR-${isSample}`, name: "Test Course", source: "test", isSample },
  });
  const collegeCourse = await prisma.collegeCourse.create({
    data: { collegeId: college.id, courseId: course.id, source: "test", isSample },
  });
  await prisma.cutoff.create({
    data: {
      collegeCourseId: collegeCourse.id,
      year: 2024,
      round: 1,
      categoryCode: "GM",
      closingRank: 1000,
      source: "test",
      isSample,
    },
  });
}

describe("getSampleDataStatus", () => {
  it("is false when there is no data at all", async () => {
    expect(await getSampleDataStatus()).toEqual({ isSampleDataInUse: false });
  });

  it("is false when only real (isSample=false) cutoffs exist", async () => {
    await createCutoff(false);
    expect(await getSampleDataStatus()).toEqual({ isSampleDataInUse: false });
  });

  it("is true when at least one sample cutoff exists", async () => {
    await createCutoff(false);
    await createCutoff(true);
    expect(await getSampleDataStatus()).toEqual({ isSampleDataInUse: true });
  });
});
