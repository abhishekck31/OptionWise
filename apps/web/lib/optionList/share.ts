import type { Chance } from "@/lib/predictors/collegePredictor";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";

/** Deliberately minimal — no rank, no student name, no contact details (CLAUDE.md:
 * "Users are minors: collect minimal personal data"). Just enough to render a
 * read-only option list. */
export interface ShareEntry {
  collegeCode: string;
  collegeName: string;
  courseCode: string;
  courseName: string;
  chance: Chance;
}

function isShareEntry(value: unknown): value is ShareEntry {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.collegeCode === "string" &&
    typeof entry.collegeName === "string" &&
    typeof entry.courseCode === "string" &&
    typeof entry.courseName === "string" &&
    (entry.chance === "safe" || entry.chance === "target" || entry.chance === "reach")
  );
}

/** Not persisted anywhere server-side — the whole list round-trips through this
 * encoding in the URL fragment, so the link works without a backend and never
 * touches a server log (fragments aren't sent in HTTP requests). */
export function encodeShareData(list: Pick<CollegePrediction, "collegeCode" | "collegeName" | "courseCode" | "courseName" | "chance">[]): string {
  const payload: ShareEntry[] = list.map((p) => ({
    collegeCode: p.collegeCode,
    collegeName: p.collegeName,
    courseCode: p.courseCode,
    courseName: p.courseName,
    chance: p.chance,
  }));
  return btoa(encodeURIComponent(JSON.stringify(payload)));
}

/** Returns null for anything that doesn't decode to a valid share payload — a
 * corrupted, truncated, or hand-edited fragment should show "invalid link", never
 * throw or render garbage. */
export function decodeShareData(encoded: string): ShareEntry[] | null {
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(atob(encoded)));
    if (!Array.isArray(parsed) || !parsed.every(isShareEntry)) return null;
    return parsed;
  } catch {
    return null;
  }
}
