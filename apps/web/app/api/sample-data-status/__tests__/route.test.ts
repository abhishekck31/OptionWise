// @vitest-environment node
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { GET } from "../route";

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

describe("GET /api/sample-data-status", () => {
  it("returns isSampleDataInUse:false with no data", async () => {
    const response = await GET();
    expect(await response.json()).toEqual({ isSampleDataInUse: false });
  });

  it("returns isSampleDataInUse:true when sample data exists", async () => {
    const college = await prisma.college.create({
      data: { code: "API1", name: "Test College", source: "test", isSample: true },
    });
    const course = await prisma.course.create({
      data: { code: "API1C", name: "Test Course", source: "test", isSample: true },
    });
    const collegeCourse = await prisma.collegeCourse.create({
      data: { collegeId: college.id, courseId: course.id, source: "test", isSample: true },
    });
    await prisma.cutoff.create({
      data: {
        collegeCourseId: collegeCourse.id,
        year: 2024,
        round: 1,
        categoryCode: "GM",
        closingRank: 1000,
        source: "test",
        isSample: true,
      },
    });

    const response = await GET();
    expect(await response.json()).toEqual({ isSampleDataInUse: true });
  });
});
