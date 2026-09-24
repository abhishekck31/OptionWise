// @vitest-environment node
import { PrismaClient } from "@prisma/client";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { predictColleges } from "../predictColleges";

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

async function seedFixture() {
  const [collegeA, collegeB] = await Promise.all([
    prisma.college.create({
      data: { code: "PC-A", name: "College A", city: "Bengaluru", source: "test", isSample: true },
    }),
    prisma.college.create({
      data: { code: "PC-B", name: "College B", city: "Mysuru", source: "test", isSample: true },
    }),
  ]);
  const [courseCS, courseEC] = await Promise.all([
    prisma.course.create({ data: { code: "PC-CS", name: "CS", source: "test", isSample: true } }),
    prisma.course.create({ data: { code: "PC-EC", name: "EC", source: "test", isSample: true } }),
  ]);

  const ccACs = await prisma.collegeCourse.create({
    data: { collegeId: collegeA.id, courseId: courseCS.id, feesInr: 100000, source: "test", isSample: true },
  });
  const ccBEc = await prisma.collegeCourse.create({
    data: { collegeId: collegeB.id, courseId: courseEC.id, feesInr: 200000, source: "test", isSample: true },
  });

  await prisma.cutoff.createMany({
    data: [
      {
        collegeCourseId: ccACs.id,
        year: 2024,
        round: 1,
        categoryCode: "GM",
        closingRank: 5000,
        source: "test",
        isSample: true,
      },
      {
        collegeCourseId: ccBEc.id,
        year: 2024,
        round: 1,
        categoryCode: "GM",
        closingRank: 50000,
        source: "test",
        isSample: true,
      },
    ],
  });

  return { collegeA, collegeB, courseCS, courseEC, ccACs, ccBEc };
}

describe("predictColleges", () => {
  it("classifies every matching college-course and includes college/course details", async () => {
    await seedFixture();

    // rank=20000 is much worse than College A's competitive cutoff (5000) -> Reach,
    // but comfortably better than College B's easier cutoff (50000) -> Safe.
    const predictions = await predictColleges(prisma, { categoryCode: "GM", rank: 20000 });

    expect(predictions).toHaveLength(2);
    const collegeA = predictions.find((p) => p.collegeCode === "PC-A");
    expect(collegeA).toMatchObject({ chance: "reach", city: "Bengaluru", courseCode: "PC-CS" });
    const collegeB = predictions.find((p) => p.collegeCode === "PC-B");
    expect(collegeB?.chance).toBe("safe");
  });

  it("filters by city, max fees, and branches", async () => {
    await seedFixture();

    const byCity = await predictColleges(prisma, { categoryCode: "GM", rank: 5000, city: "Mysuru" });
    expect(byCity.map((p) => p.collegeCode)).toEqual(["PC-B"]);

    const byFee = await predictColleges(prisma, { categoryCode: "GM", rank: 5000, maxFeesInr: 150000 });
    expect(byFee.map((p) => p.collegeCode)).toEqual(["PC-A"]);

    const byBranch = await predictColleges(prisma, {
      categoryCode: "GM",
      rank: 5000,
      courseCodes: ["PC-EC"],
    });
    expect(byBranch.map((p) => p.collegeCode)).toEqual(["PC-B"]);
  });

  it("skips a college-course with no cutoff evidence for the requested category", async () => {
    await seedFixture();

    const predictions = await predictColleges(prisma, { categoryCode: "SCG", rank: 5000 });
    expect(predictions).toHaveLength(0);
  });
});
