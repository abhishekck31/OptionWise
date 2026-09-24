import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import { extractPdfText } from "./extractPdfText";
import { parseCutoffRows } from "./parseCutoffRows";
import {
  SAMPLE_COLLEGES,
  SAMPLE_COLLEGE_COURSES,
  SAMPLE_COURSES,
  SAMPLE_CUTOFFS,
  SAMPLE_SOURCE,
} from "./sampleDataset";
import type { IngestionReport, RawCutoffRow, ValidationReport } from "./types";

async function writeSampleDataset(prisma: PrismaClient): Promise<number> {
  for (const college of SAMPLE_COLLEGES) {
    await prisma.college.upsert({
      where: { code: college.code },
      create: { code: college.code, name: college.name, city: college.city, source: SAMPLE_SOURCE, isSample: true },
      update: { name: college.name, city: college.city, source: SAMPLE_SOURCE, isSample: true },
    });
  }
  for (const course of SAMPLE_COURSES) {
    await prisma.course.upsert({
      where: { code: course.code },
      create: { code: course.code, name: course.name, source: SAMPLE_SOURCE, isSample: true },
      update: { name: course.name, source: SAMPLE_SOURCE, isSample: true },
    });
  }

  let cutoffCount = 0;
  for (const cc of SAMPLE_COLLEGE_COURSES) {
    const college = await prisma.college.findUniqueOrThrow({ where: { code: cc.collegeCode } });
    const course = await prisma.course.findUniqueOrThrow({ where: { code: cc.courseCode } });
    const collegeCourse = await prisma.collegeCourse.upsert({
      where: { collegeId_courseId: { collegeId: college.id, courseId: course.id } },
      create: {
        collegeId: college.id,
        courseId: course.id,
        feesInr: cc.feesInr,
        intake: cc.intake,
        source: SAMPLE_SOURCE,
        isSample: true,
      },
      update: { feesInr: cc.feesInr, intake: cc.intake, source: SAMPLE_SOURCE, isSample: true },
    });

    const cutoffsForPair = SAMPLE_CUTOFFS.filter(
      (c) => c.collegeCode === cc.collegeCode && c.courseCode === cc.courseCode,
    );
    for (const cutoff of cutoffsForPair) {
      await prisma.cutoff.upsert({
        where: {
          collegeCourseId_year_round_categoryCode: {
            collegeCourseId: collegeCourse.id,
            year: cutoff.year,
            round: cutoff.round,
            categoryCode: cutoff.categoryCode,
          },
        },
        create: {
          collegeCourseId: collegeCourse.id,
          year: cutoff.year,
          round: cutoff.round,
          categoryCode: cutoff.categoryCode,
          closingRank: cutoff.closingRank,
          source: SAMPLE_SOURCE,
          isSample: true,
        },
        update: { closingRank: cutoff.closingRank, source: SAMPLE_SOURCE, isSample: true },
      });
      cutoffCount += 1;
    }
  }
  return cutoffCount;
}

async function writeParsedRows(
  prisma: PrismaClient,
  rows: RawCutoffRow[],
  source: string,
): Promise<number> {
  let cutoffCount = 0;
  for (const row of rows) {
    const college = await prisma.college.upsert({
      where: { code: row.collegeCode },
      create: { code: row.collegeCode, name: row.collegeName, source, isSample: false },
      update: { name: row.collegeName, source, isSample: false },
    });
    const course = await prisma.course.upsert({
      where: { code: row.courseCode },
      create: { code: row.courseCode, name: row.courseName, source, isSample: false },
      update: { name: row.courseName, source, isSample: false },
    });
    const collegeCourse = await prisma.collegeCourse.upsert({
      where: { collegeId_courseId: { collegeId: college.id, courseId: course.id } },
      create: { collegeId: college.id, courseId: course.id, source, isSample: false },
      update: { source, isSample: false },
    });
    await prisma.cutoff.upsert({
      where: {
        collegeCourseId_year_round_categoryCode: {
          collegeCourseId: collegeCourse.id,
          year: row.year,
          round: row.round,
          categoryCode: row.categoryCode,
        },
      },
      create: {
        collegeCourseId: collegeCourse.id,
        year: row.year,
        round: row.round,
        categoryCode: row.categoryCode,
        closingRank: row.closingRank,
        source,
        isSample: false,
      },
      update: { closingRank: row.closingRank, source, isSample: false },
    });
    cutoffCount += 1;
  }
  return cutoffCount;
}

/**
 * Ingests KEA cutoff PDFs from `rawDir` into the database. If `rawDir` has no .pdf
 * files, writes a small obviously-fake sample dataset instead (SPEC.md: "If real data
 * is missing, generate a SMALL, clearly fake sample dataset with is_sample=true").
 */
export async function ingestFromRawDir(prisma: PrismaClient, rawDir: string): Promise<IngestionReport> {
  let pdfFiles: string[] = [];
  try {
    const entries = await readdir(rawDir);
    pdfFiles = entries.filter((entry) => entry.toLowerCase().endsWith(".pdf")).sort();
  } catch {
    pdfFiles = [];
  }

  if (pdfFiles.length === 0) {
    const totalCutoffRowsWritten = await writeSampleDataset(prisma);
    return { usedSampleDataset: true, files: [], totalCutoffRowsWritten };
  }

  const files: ValidationReport[] = [];
  let totalCutoffRowsWritten = 0;

  for (const fileName of pdfFiles) {
    const filePath = path.join(rawDir, fileName);
    const buffer = await readFile(filePath);
    const text = await extractPdfText(buffer);
    const relativeSource = path.join("data/raw", fileName);
    const { rows, report } = parseCutoffRows(text, relativeSource);
    files.push(report);
    totalCutoffRowsWritten += await writeParsedRows(prisma, rows, relativeSource);
  }

  return { usedSampleDataset: false, files, totalCutoffRowsWritten };
}
