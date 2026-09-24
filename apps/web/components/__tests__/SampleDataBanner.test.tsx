// @vitest-environment jsdom
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { prisma } from "@/lib/db";
import { SampleDataBanner } from "@/components/SampleDataBanner";

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

describe("SampleDataBanner", () => {
  it("renders nothing when no sample data is in use", async () => {
    const { container } = render(await SampleDataBanner());
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the sample-data notice when sample data is in use", async () => {
    const college = await prisma.college.create({
      data: { code: "SB1", name: "Test College", source: "test", isSample: true },
    });
    const course = await prisma.course.create({
      data: { code: "SB1C", name: "Test Course", source: "test", isSample: true },
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

    render(await SampleDataBanner());

    expect(screen.getByRole("status")).toHaveTextContent(/sample data — not real cutoffs/i);
  });
});
