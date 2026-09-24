import { isValidCategoryCode } from "@/lib/categories";
import type { RawCutoffRow, RejectedRow, ValidationReport } from "./types";

// The exact text layout of a real KEA cutoff PDF is unknown — no sample PDF was
// available when this was written (see BLOCKED.md / AUDIT.md). This parser targets a
// documented, provisional text format that a PDF's extracted text is expected to
// follow, to be replaced/adjusted once a real KEA PDF can be inspected:
//
//   # year: 2024 round: 1
//   COLLEGE_CODE|COLLEGE_NAME|COURSE_CODE|COURSE_NAME|CATEGORY_CODE|CLOSING_RANK
//   ...
//   # year: 2024 round: 2
//   ...
//
// A "# year: N round: N" line sets context for the data lines that follow it, until
// the next such line. Blank lines are ignored. Anything else is a data line.

const HEADER_PATTERN = /^#\s*year:\s*(\d{4})\s+round:\s*(\d+)\s*$/i;

export function parseCutoffRows(text: string, source: string): { rows: RawCutoffRow[]; report: ValidationReport } {
  const rows: RawCutoffRow[] = [];
  const rejectedRows: RejectedRow[] = [];
  const unknownCategoryCodes = new Set<string>();

  let year: number | null = null;
  let round: number | null = null;
  let totalDataLines = 0;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === "") continue;

    const headerMatch = line.match(HEADER_PATTERN);
    if (headerMatch) {
      year = Number(headerMatch[1]);
      round = Number(headerMatch[2]);
      continue;
    }

    totalDataLines += 1;

    if (year === null || round === null) {
      rejectedRows.push({ line, reason: "no '# year: N round: N' header seen yet" });
      continue;
    }

    const fields = line.split("|").map((field) => field.trim());
    if (fields.length !== 6) {
      rejectedRows.push({ line, reason: `expected 6 fields separated by '|', got ${fields.length}` });
      continue;
    }

    const [collegeCode, collegeName, courseCode, courseName, categoryCode, rankText] = fields;

    if (!collegeCode || !collegeName || !courseCode || !courseName) {
      rejectedRows.push({ line, reason: "college/course code and name must not be empty" });
      continue;
    }

    if (!isValidCategoryCode(categoryCode)) {
      unknownCategoryCodes.add(categoryCode);
      rejectedRows.push({ line, reason: `unknown category code '${categoryCode}'` });
      continue;
    }

    const closingRank = Number(rankText);
    if (!Number.isInteger(closingRank) || closingRank <= 0) {
      rejectedRows.push({ line, reason: `closing rank must be a positive integer, got '${rankText}'` });
      continue;
    }

    rows.push({ collegeCode, collegeName, courseCode, courseName, categoryCode, closingRank, year, round });
  }

  return {
    rows,
    report: {
      source,
      totalDataLines,
      parsedRows: rows.length,
      rejectedRows,
      unknownCategoryCodes: [...unknownCategoryCodes],
    },
  };
}
