import { colleges, getCollegeByCode, getCollegesByCity, getCollegesByRegion } from "@/lib/data/colleges";
import {
  cutoffs, getCutoff, getCutoffHistory, getCutoffsByCollege, getLatestCutoff,
  AVAILABLE_YEARS, CUTOFF_DATA_YEAR, deriveSeries,
} from "@/lib/data/cutoffs";
import { predictColleges } from "@/lib/predict";
import { CATEGORY_KEYS } from "@/types";

const ok = (l: string, p: boolean, x = "") =>
  console.log(`${p ? "PASS" : "FAIL"}  ${l}${x ? "  " + x : ""}`);

ok("238 colleges", colleges.length === 238, String(colleges.length));
ok("46,967 verified rows", cutoffs.length === 46967, cutoffs.length.toLocaleString("en-IN"));
ok("all rows are 2026", cutoffs.every((c) => c.year === 2026));
ok("16 categories", CATEGORY_KEYS.length === 16, String(CATEGORY_KEYS.length));
ok("years 2018-2026", AVAILABLE_YEARS.length === 9, `${Math.min(...AVAILABLE_YEARS)}-${Math.max(...AVAILABLE_YEARS)}`);

// ── Tier 1 must match what KEA printed, exactly ──
const uvce = getCollegeByCode("E001")!;
const bmsce = getCollegeByCode("E003")!;
ok("E001 is UVCE", uvce.name.includes("Visvesvaraya"), uvce.shortName);

/**
 * Round 1 General Merit CSE, straight off the 2026 report. Read together they
 * are also a shape check: this is the order these colleges actually close in,
 * so a parser that slipped a column would not reproduce it.
 */
const published: [string, number, string][] = [
  ["E005", 144, "RVCE"],
  ["E009", 628, "PES University"],
  ["E006", 976, "MSRIT"],
  ["E048", 1920.5, "BMSCE (E048)"],
  ["E001", 2952, "UVCE"],
  ["E007", 3572, "DSCE"],
  ["E016", 6526, "Siddaganga"],
];
for (const [code, expected, label] of published) {
  const college = getCollegeByCode(code);
  const row = college && getCutoff(college.id, "CSE", "GM", "R1", 2026);
  ok(`${label} CSE GM R1 = ${expected} (published)`, row?.closingRank === expected, String(row?.closingRank));
}
const bmsceEce = getCutoff(bmsce.id, "ECE", "GM", "R1", 2026);
ok("BMSCE ECE GM R1 = 1049 (published)", bmsceEce?.closingRank === 1049, String(bmsceEce?.closingRank));

ok("cut-offs rise across rounds", (() => {
  const msrit = getCollegeByCode("E006")!;
  const r = (round: "R1" | "R2" | "R3") => getCutoff(msrit.id, "CSE", "GM", round, 2026)!.closingRank;
  return r("R1") < r("R2") && r("R2") < r("R3");
})(), (() => {
  const msrit = getCollegeByCode("E006")!;
  return (["R1", "R2", "R3"] as const).map((x) => getCutoff(msrit.id, "CSE", "GM", x, 2026)!.closingRank).join(" < ");
})());

ok("371(j) seats are a separate pool", (() => {
  const hk = getCutoff(uvce.id, "CSE", "GM", "R3", 2026, "HK");
  const general = getCutoff(uvce.id, "CSE", "GM", "R3", 2026);
  return hk !== undefined && general !== undefined && hk.closingRank !== general.closingRank;
})());

// decimals preserved
const withDecimal = cutoffs.find((c) => !Number.isInteger(c.closingRank));
ok("tie-break decimals preserved", withDecimal !== undefined, String(withDecimal?.closingRank));

// ── Tier 2 derivation ──
const hist = getCutoffHistory(uvce.id, "CSE", "GM");
const r3 = hist.filter((h) => h.round === "R3");
ok("history spans 9 years", r3.length === 9, r3.map((h) => h.year).join(","));
ok("2026 R3 in history is verified", r3.at(-1)?.year === 2026);
const y2025 = r3.find((h) => h.year === 2025)!;
const y2026 = r3.find((h) => h.year === 2026)!;
ok("derived year is lower than 2026", y2025.closingRank < y2026.closingRank,
   `2025=${y2025.closingRank} 2026=${y2026.closingRank}`);
ok("~18% annual growth", Math.abs(y2026.closingRank / y2025.closingRank - 1.18) < 0.02,
   (y2026.closingRank / y2025.closingRank).toFixed(3));

const derived = deriveSeries(uvce.id, "CSE", "GM");
ok("derives 8 years x 4 rounds", derived.length === 32, String(derived.length));
ok("derived rounds ordered MOCK<R1<R2<R3", (() => {
  const y = derived.filter((d) => d.year === 2020);
  const get = (r: string) => y.find((d) => d.round === r)!.closingRank;
  return get("MOCK") < get("R1") && get("R1") < get("R2") && get("R2") < get("R3");
})());

// ── helpers from the spec ──
ok("getCutoffsByCollege", getCutoffsByCollege(uvce.id).length > 0, String(getCutoffsByCollege(uvce.id).length));
ok("getLatestCutoff is R3/2026", (() => {
  const l = getLatestCutoff(uvce.id, "CSE", "GM");
  return l?.round === "R3" && l?.year === 2026;
})());
ok("getCollegesByCity('Mysuru')", getCollegesByCity("Mysuru").length > 0, String(getCollegesByCity("Mysuru").length));
ok("getCollegesByRegion('North Karnataka')", getCollegesByRegion("North Karnataka").length > 0,
   String(getCollegesByRegion("North Karnataka").length));

// ── predictions on real data ──
const preds = predictColleges({
  rank: 12000, category: "GM", gender: "M", isHKRegion: false,
  preferredCities: [], preferredBranches: [], willingToHostel: true, maxFee: null, collegeType: [],
});
ok("predictions return results", preds.length > 0, `${preds.length}`);
ok("predictions cite 2026", preds.every((p) => p.year === 2026));

const hk = predictColleges({
  rank: 60000, category: "GM", gender: "M", isHKRegion: true,
  preferredCities: [], preferredBranches: [], willingToHostel: true, maxFee: null, collegeType: [],
});
const nonHk = predictColleges({
  rank: 60000, category: "GM", gender: "M", isHKRegion: false,
  preferredCities: [], preferredBranches: [], willingToHostel: true, maxFee: null, collegeType: [],
});
ok("HK region never worsens the result", hk.length >= nonHk.length, `hk=${hk.length} general=${nonHk.length}`);

const t0 = Date.now();
for (let i = 0; i < 10; i++) predictColleges({
  rank: 5000 + i, category: "GM", gender: "M", isHKRegion: false,
  preferredCities: [], preferredBranches: [], willingToHostel: true, maxFee: null, collegeType: [],
});
console.log(`\n10 prediction runs: ${Date.now() - t0}ms`);
console.log(`sample: ${preds[0].college.shortName} ${preds[0].branch} closes #${preds[0].closingRank} (${preds[0].chancePercent}%)`);
