/* ============================================================================
 * KEA cut-off data, as the pipeline in ../kea-data emits it.
 *
 * Every rank is a closing rank KEA printed in an engineering allotment report,
 * 2016 to 2026. Categories are the codes KEA printed that year — they change
 * over time (SC was one group until 2026 split it into S1–S4) — so they are
 * strings here, not the app's older 16-key union.
 * ========================================================================== */

export type KeaRound = "MOCK" | "R1" | "R2" | "R3" | "R4";

/** GEN is KEA's general ("Rest of Karnataka") report; HK is 371(j) Kalyana-Karnataka. */
export type KeaPool = "GEN" | "HK";

export interface KeaReport {
  /** `${round}-${pool}`, e.g. "R2-GEN". */
  id: string;
  round: KeaRound;
  label: string;
  pool: KeaPool;
  /** The heading exactly as printed on the report. */
  title: string;
  /** KEA titled it a mock allotment of this round. */
  mock: boolean;
  /** KEA titled it provisional, and no final list replaced it. */
  provisional: boolean;
  /** The PDF on cetonline.karnataka.gov.in it was read from. */
  url: string | null;
}

export interface KeaCourse {
  /** As printed. 2016–2024 print short names ("Computers"); 2025 on print full names. */
  name: string;
  /** The two-letter course code KEA printed before the name, 2016–2024. */
  courseCode: string | null;
  /**
   * Report id -> one closing rank per category, aligned with the categories
   * array alongside. 0 where KEA printed "--" (no allotment in that category).
   */
  ranks: Record<string, number[]>;
}

export interface KeaYearFile {
  year: number;
  categories: string[];
  reports: KeaReport[];
  colleges: { code: string; name: string; courses: KeaCourse[] }[];
}

export interface KeaCollegeYear {
  year: number;
  name: string;
  /** Only the categories this college filled that year. */
  categories: string[];
  reports: KeaReport[];
  courses: KeaCourse[];
}

export interface KeaCollegeFile {
  code: string;
  appId: string | null;
  shortName: string | null;
  /** Newest first. */
  years: KeaCollegeYear[];
}

export interface KeaCollegeIndexEntry {
  code: string;
  /** The slug of this college's page in the app, when it has one. */
  appId: string | null;
  shortName: string | null;
  name: string;
  years: number[];
}

export interface KeaMeta {
  generatedAt: string;
  source: string;
  /** Newest first. */
  years: { year: number; reports: KeaReport[]; categories: string[] }[];
  missingYears: number[];
  colleges: KeaCollegeIndexEntry[];
}
