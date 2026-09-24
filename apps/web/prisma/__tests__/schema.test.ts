// @vitest-environment node
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";

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

describe("KEA reference data", () => {
  it("stores source and isSample on every KEA-derived row", async () => {
    const college = await prisma.college.create({
      data: { code: "E001", name: "Sample Engineering College", source: "data/raw/sample.pdf", isSample: true },
    });
    const course = await prisma.course.create({
      data: { code: "CS", name: "Computer Science", source: "data/raw/sample.pdf", isSample: true },
    });
    const collegeCourse = await prisma.collegeCourse.create({
      data: {
        collegeId: college.id,
        courseId: course.id,
        feesInr: 120000,
        intake: 60,
        source: "data/raw/sample.pdf",
        isSample: true,
      },
    });
    const cutoff = await prisma.cutoff.create({
      data: {
        collegeCourseId: collegeCourse.id,
        year: 2024,
        round: 1,
        categoryCode: "GM",
        closingRank: 15000,
        source: "data/raw/sample.pdf",
        isSample: true,
      },
    });

    expect(cutoff.isSample).toBe(true);
    expect(cutoff.source).toBe("data/raw/sample.pdf");
  });

  it("rejects a duplicate Cutoff for the same college-course/year/round/category", async () => {
    const college = await prisma.college.create({
      data: { code: "E002", name: "Sample College 2", source: "test", isSample: true },
    });
    const course = await prisma.course.create({
      data: { code: "EC", name: "Electronics", source: "test", isSample: true },
    });
    const collegeCourse = await prisma.collegeCourse.create({
      data: { collegeId: college.id, courseId: course.id, source: "test", isSample: true },
    });
    const cutoffData = {
      collegeCourseId: collegeCourse.id,
      year: 2024,
      round: 1,
      categoryCode: "GM",
      closingRank: 5000,
      source: "test",
      isSample: true,
    };
    await prisma.cutoff.create({ data: cutoffData });

    await expect(prisma.cutoff.create({ data: cutoffData })).rejects.toThrow();
  });

  it("cascades delete from College through CollegeCourse to Cutoff", async () => {
    const college = await prisma.college.create({
      data: { code: "E003", name: "Sample College 3", source: "test", isSample: true },
    });
    const course = await prisma.course.create({
      data: { code: "ME", name: "Mechanical", source: "test", isSample: true },
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
        closingRank: 8000,
        source: "test",
        isSample: true,
      },
    });

    await prisma.college.delete({ where: { id: college.id } });

    const remaining = await prisma.cutoff.findMany({ where: { collegeCourseId: collegeCourse.id } });
    expect(remaining).toHaveLength(0);
  });
});

describe("Users and alumni connect", () => {
  it("links an AlumniProfile 1:1 to a User, defaulting to PENDING verification", async () => {
    const college = await prisma.college.create({
      data: { code: "E004", name: "Sample College 4", source: "test", isSample: true },
    });
    const course = await prisma.course.create({
      data: { code: "CV", name: "Civil", source: "test", isSample: true },
    });
    const user = await prisma.user.create({ data: { role: "ALUMNI" } });

    const profile = await prisma.alumniProfile.create({
      data: {
        userId: user.id,
        collegeId: college.id,
        courseId: course.id,
        graduationYear: 2022,
        isAdult: true,
      },
    });

    expect(profile.verificationStatus).toBe("PENDING");

    await expect(
      prisma.alumniProfile.create({
        data: {
          userId: user.id,
          collegeId: college.id,
          courseId: course.id,
          graduationYear: 2023,
          isAdult: true,
        },
      }),
    ).rejects.toThrow();
  });

  it("stores a Message between two users and a Report referencing both", async () => {
    const sender = await prisma.user.create({ data: { role: "STUDENT" } });
    const recipient = await prisma.user.create({ data: { role: "ALUMNI" } });

    const message = await prisma.message.create({
      data: { senderId: sender.id, recipientId: recipient.id, content: "What's placement like?" },
    });
    expect(message.isSample).toBe(false);

    const report = await prisma.report.create({
      data: { reporterId: sender.id, reportedUserId: recipient.id, reason: "spam" },
    });
    expect(report.status).toBe("OPEN");
  });

  it("records an AuditLog entry with optional actor and metadata", async () => {
    const admin = await prisma.user.create({ data: { role: "ADMIN" } });

    const log = await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: "alumni.approve",
        targetType: "AlumniProfile",
        targetId: "some-id",
        metadata: { note: "verified via college ID card" },
      },
    });

    expect(log.action).toBe("alumni.approve");
    expect(log.metadata).toEqual({ note: "verified via college ID card" });
  });
});
