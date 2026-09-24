import { BRANCHES } from "@/types";
import type { Branch } from "@/types";

/**
 * Lines up one course across years.
 *
 * KEA printed short names with a two-letter code until 2024 ("CS Computers",
 * "IE Info.Science") and full names from 2025 ("COMPUTER SCIENCE AND
 * ENGINEERING"), so the same programme has no common spelling across the
 * decade. Known codes and name patterns map onto the app's branch keys; any
 * course that matches neither keeps its own printed name as its group, so it
 * is never silently merged with something else.
 *
 * Codes are mapped only where KEA's own printed name leaves no doubt. "IT"
 * before 2018 is Instrumentation Technology, not Information Technology, and
 * is deliberately absent.
 */
const CODE_BRANCH: Record<string, Branch> = {
  CS: "CSE",
  CO: "CSE",
  EC: "ECE",
  TC: "ECE",
  ET: "ECE",
  IE: "ISE",
  CE: "CV",
  ME: "ME",
  EE: "EEE",
  AI: "AI_ML",
  CA: "AI_ML",
  DS: "AI_DS",
  AD: "AI_DS",
  AE: "AERO",
  SE: "AERO",
  BT: "BT",
  CH: "CH",
  CY: "CYBER",
  CB: "CSBS",
  AU: "AUTO",
  AT: "AUTO",
  RA: "ROBOTICS",
  RO: "ROBOTICS",
  IO: "IOT",
  IG: "IT",
  BI: "IT",
  MC: "MATHS_COMPUTING",
};

/** Full-name patterns, most specific first; matched with spaces removed. */
const NAME_RULES: [string, Branch][] = [
  ["INTERNETOFTHINGS", "IOT"],
  ["CYBERSECURITY", "CYBER"],
  ["DATASCIENCE", "AI_DS"],
  ["BUSINESSSYSTEMS", "CSBS"],
  ["ARTIFICIALINTELLIGENCE", "AI_ML"],
  ["MACHINELEARNING", "AI_ML"],
  ["ROBOTIC", "ROBOTICS"],
  ["INFORMATIONSCIENCE", "ISE"],
  ["INFORMATIONTECHNOLOGY", "IT"],
  ["MATHEMATIC", "MATHS_COMPUTING"],
  ["MATHAMATIC", "MATHS_COMPUTING"],
  ["COMPUTERSCIENCE", "CSE"],
  ["COMPUTERENGINEERING", "CSE"],
  ["ELECTRONICSANDCOMMUNICATION", "ECE"],
  ["ELECTRONICS&COMMUNICATION", "ECE"],
  ["TELECOMMUNICATI", "ECE"],
  ["ELECTRICAL", "EEE"],
  ["AEROSPACE", "AERO"],
  ["AERONAUTIC", "AERO"],
  ["AUTOMOBILE", "AUTO"],
  ["MECHANICAL", "ME"],
  ["CIVIL", "CV"],
  ["CHEMICAL", "CH"],
  ["BIOTECH", "BT"],
  ["BIO-TECH", "BT"],
];

/**
 * Architecture appears in KEA's 2024 engineering report, but its seats are
 * filled from the separate architecture rank list, so its closing ranks
 * (60, 114, 429…) cannot be compared with a KCET engineering rank. Tables show
 * it with a label; the rank finder leaves it out.
 */
export function separateRankList(name: string): string | null {
  return /^\s*(B\.?\s*)?ARCH(ITECTURE)?\.?\s*$/i.test(name) ? "Architecture rank" : null;
}

export interface CourseGroup {
  key: string;
  label: string;
  branch: Branch | null;
}

/**
 * 2023 and 2024 print private-university programmes as "B Tech in CS",
 * "B Tech in EC" under codes of their own (BW, BB, …); the abbreviation after
 * "in" is the branch.
 */
const BTECH_ABBR: Record<string, Branch> = {
  CS: "CSE",
  CO: "CSE",
  EC: "ECE",
  EE: "EEE",
  ME: "ME",
  CE: "CV",
  IS: "ISE",
  AD: "AI_DS",
  DS: "AI_DS",
  AI: "AI_ML",
  AIML: "AI_ML",
  IT: "IT",
  CY: "CYBER",
  BT: "BT",
  IOT: "IOT",
  IO: "IOT",
};

export function courseGroup(name: string, courseCode: string | null): CourseGroup {
  const abbr = /^B\.?\s*TECH\.?\s+IN\s+([A-Z]+)$/i.exec(name.trim())?.[1]?.toUpperCase();
  const coded = courseCode ? (CODE_BRANCH[courseCode] ?? (abbr ? BTECH_ABBR[abbr] : undefined)) : undefined;
  const squashed = name.toUpperCase().replace(/\s+/g, "");
  const named = courseCode ? undefined : NAME_RULES.find(([needle]) => squashed.includes(needle))?.[1];
  const branch = coded ?? named ?? null;
  if (branch) return { key: `branch:${branch}`, label: BRANCHES[branch], branch };
  return { key: `name:${squashed.replace(/[^A-Z0-9]/g, "")}`, label: titleCase(name), branch: null };
}

/** KEA prints full names in capitals; they read better in title case. */
export function titleCase(name: string): string {
  if (name !== name.toUpperCase()) return name;
  return name
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(And|Of|In|With|For|The)\b/g, (m) => m.toLowerCase())
    .replace(/\b(Ai|Ml|Iot|Vlsi|Cs|It|Ec|Ee|B Tech|Btech)\b/gi, (m) => m.toUpperCase());
}
