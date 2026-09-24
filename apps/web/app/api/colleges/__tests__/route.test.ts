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

async function seedOneCollege() {
  const college = await prisma.college.create({
    data: { code: "API-C1", name: "API College", city: "Bengaluru", source: "test", isSample: true },
  });
  const course = await prisma.course.create({ data: { code: "API-CS", name: "CS", source: "test", isSample: true } });
  const collegeCourse = await prisma.collegeCourse.create({
    data: { collegeId: college.id, courseId: course.id, feesInr: 100000, source: "test", isSample: true },
  });
  await prisma.cutoff.create({
    data: {
      collegeCourseId: collegeCourse.id,
      year: 2024,
      round: 1,
      categoryCode: "GM",
      closingRank: 10000,
      source: "test",
      isSample: true,
    },
  });
}

describe("GET /api/colleges", () => {
  it("returns 400 when rank or categoryCode is missing", async () => {
    const response = await GET(new Request("http://localhost/api/colleges?rank=5000"));
    expect(response.status).toBe(400);
  });

  it("returns 400 for a non-numeric or non-positive rank", async () => {
    const response = await GET(new Request("http://localhost/api/colleges?rank=abc&categoryCode=GM"));
    expect(response.status).toBe(400);
  });

  it("returns classified predictions for valid params", async () => {
    await seedOneCollege();
    const response = await GET(new Request("http://localhost/api/colleges?rank=5000&categoryCode=GM"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.predictions).toHaveLength(1);
    expect(body.predictions[0]).toMatchObject({ collegeCode: "API-C1", chance: "safe" });
  });

  it("applies city, fee, and branch filters from query params", async () => {
    await seedOneCollege();
    const wrongCity = await GET(
      new Request("http://localhost/api/colleges?rank=5000&categoryCode=GM&city=Mysuru"),
    );
    expect((await wrongCity.json()).predictions).toHaveLength(0);

    const matchingCity = await GET(
      new Request("http://localhost/api/colleges?rank=5000&categoryCode=GM&city=Bengaluru&branches=API-CS"),
    );
    expect((await matchingCity.json()).predictions).toHaveLength(1);
  });
});
