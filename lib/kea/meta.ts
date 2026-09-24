import metaJson from "@/data/kea/meta.json";
import type { KeaCollegeIndexEntry, KeaMeta, KeaPool, KeaReport } from "./types";

/**
 * The index of what KEA published: which years and rounds exist, the category
 * codes each year printed, and every college code seen. Small enough to ship
 * to the browser; the ranks themselves are loaded per year or per college.
 */
export const KEA_META = metaJson as KeaMeta;

export const KEA_YEARS: number[] = KEA_META.years.map((y) => y.year);
export const LATEST_YEAR = KEA_YEARS[0];
export const FIRST_YEAR = KEA_YEARS[KEA_YEARS.length - 1];

export function yearMeta(year: number) {
  return KEA_META.years.find((y) => y.year === year);
}

/** The reports of one pool for a year, in round order. */
export function reportsFor(year: number, pool: KeaPool = "GEN"): KeaReport[] {
  return yearMeta(year)?.reports.filter((r) => r.pool === pool) ?? [];
}

const collegeByCode = new Map(KEA_META.colleges.map((c) => [c.code, c]));
const collegeByAppId = new Map(
  KEA_META.colleges.filter((c) => c.appId).map((c) => [c.appId as string, c])
);

export function keaCollege(codeOrAppId: string): KeaCollegeIndexEntry | undefined {
  return collegeByCode.get(codeOrAppId.toUpperCase()) ?? collegeByAppId.get(codeOrAppId);
}

/** Where a college's page lives: its app slug when it has one, else its KEA code. */
export function collegeHref(code: string): string {
  const entry = collegeByCode.get(code);
  return `/college/${entry?.appId ?? code}`;
}

/** A short display name: the app's short name, else the printed name trimmed at the first comma. */
export function collegeShortName(code: string, printedName?: string): string {
  const entry = collegeByCode.get(code);
  if (entry?.shortName) return entry.shortName.replace(/\s+E\d{3}$/, "");
  const name = printedName ?? entry?.name ?? code;
  return name.split(/,|\(/)[0].trim();
}

/* ─── Categories ──────────────────────────────────────────────────────────── */

const GROUP: Record<string, string> = {
  "1": "Category 1",
  "2A": "OBC 2A",
  "2B": "OBC 2B",
  "3A": "OBC 3A",
  "3B": "OBC 3B",
  GM: "General Merit",
  SC: "Scheduled Caste",
  S1: "SC Category 1",
  S2: "SC Category 2",
  S3: "SC Category 3",
  S4: "SC Category 4",
  ST: "Scheduled Tribe",
};

const SUFFIX: Record<string, string> = {
  G: "",
  K: "Kannada medium",
  R: "Rural",
};

/**
 * A readable name for a category code. KEA builds codes as a group plus a
 * suffix — G general, K Kannada medium, R rural — so "3BR" is OBC 3B, rural.
 * Codes outside that pattern (GMP, NRI, OPN, OTH) are shown as printed.
 */
export function categoryName(code: string): string {
  if (code === "GM") return "General Merit";
  const match = /^(GM|SC|ST|S[1-4]|[23][AB]|1)([GKR])?$/.exec(code);
  if (!match) return code;
  const [, group, suffix] = match;
  const detail = suffix ? SUFFIX[suffix] : "";
  return detail ? `${GROUP[group]}, ${detail}` : GROUP[group];
}

/** Category groups for a picker, in KEA's printed order. */
export function groupCategories(codes: string[]): { label: string; codes: string[] }[] {
  const groups: { label: string; test: RegExp }[] = [
    { label: "General", test: /^GM/ },
    { label: "Category 1", test: /^1/ },
    { label: "OBC", test: /^[23][AB]/ },
    { label: "SC", test: /^(SC|S[1-4])/ },
    { label: "ST", test: /^ST/ },
  ];
  const used = new Set<string>();
  const out = groups
    .map((g) => {
      const list = codes.filter((c) => g.test.test(c));
      list.forEach((c) => used.add(c));
      return { label: g.label, codes: list };
    })
    .filter((g) => g.codes.length);
  const other = codes.filter((c) => !used.has(c));
  if (other.length) out.push({ label: "Other", codes: other });
  return out;
}

export const ROUND_SHORT: Record<string, string> = {
  MOCK: "Mock",
  R1: "Round 1",
  R2: "Round 2",
  R3: "Round 3",
  R4: "Left-out",
};
