// @vitest-environment node
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { ingestFromRawDir } from "../ingest";
import { buildFixturePdf } from "./testHelpers";

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

describe("ingestFromRawDir", () => {
  it("writes the small fake sample dataset when the raw dir has no PDFs", async () => {
    const emptyDir = await mkdtemp(path.join(tmpdir(), "optionwise-raw-empty-"));
    try {
      const report = await ingestFromRawDir(prisma, emptyDir);

      expect(report.usedSampleDataset).toBe(true);
      expect(report.totalCutoffRowsWritten).toBeGreaterThan(0);

      const cutoffs = await prisma.cutoff.findMany();
      expect(cutoffs.length).toBe(report.totalCutoffRowsWritten);
      expect(cutoffs.every((c) => c.isSample)).toBe(true);

      const colleges = await prisma.college.findMany();
      expect(colleges.every((c) => c.isSample && c.name.toLowerCase().includes("sample"))).toBe(true);
    } finally {
      await rm(emptyDir, { recursive: true, force: true });
    }
  });

  it("parses a real PDF in the raw dir and writes valid rows, reporting rejects", async () => {
    const rawDir = await mkdtemp(path.join(tmpdir(), "optionwise-raw-pdf-"));
    try {
      const pdfBuffer = await buildFixturePdf([
        "# year: 2024 round: 1",
        "E100|Fixture College|CS|Computer Science|GM|12000",
        "E100|Fixture College|CS|Computer Science|ZZ|9000",
      ]);
      await mkdir(rawDir, { recursive: true });
      await writeFile(path.join(rawDir, "fixture.pdf"), pdfBuffer);

      const report = await ingestFromRawDir(prisma, rawDir);

      expect(report.usedSampleDataset).toBe(false);
      expect(report.files).toHaveLength(1);
      expect(report.files[0].parsedRows).toBe(1);
      expect(report.files[0].rejectedRows).toHaveLength(1);
      expect(report.files[0].unknownCategoryCodes).toEqual(["ZZ"]);
      expect(report.totalCutoffRowsWritten).toBe(1);

      const cutoff = await prisma.cutoff.findFirstOrThrow();
      expect(cutoff.isSample).toBe(false);
      expect(cutoff.source).toBe(path.join("data/raw", "fixture.pdf"));
      expect(cutoff.closingRank).toBe(12000);

      const college = await prisma.college.findUniqueOrThrow({ where: { code: "E100" } });
      expect(college.name).toBe("Fixture College");
      expect(college.isSample).toBe(false);
    } finally {
      await rm(rawDir, { recursive: true, force: true });
    }
  });
});
