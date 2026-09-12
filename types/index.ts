/* ============================================================================
 * KCET Predictor — application type system.
 *
 * Enum-like values are const objects plus a derived key union, so the same
 * declaration gives both the runtime label lookup and the compile-time type.
 * Import the const object when you need labels or need to iterate; import the
 * type when you only need the key.
 * ========================================================================== */

/* ─── Enums as const objects (not TypeScript enums — const + type pattern) ─── */

export const CATEGORIES = {
  GM: "General Merit",
  GMK: "General Merit (Kannada Medium)",
  GMR: "General Merit (Rural)",
  "2AG": "OBC 2A (General)",
  "2AR": "OBC 2A (Rural)",
  "2BG": "OBC 2B",
  "3AG": "OBC 3A",
  "3BG": "OBC 3B",
  "1G": "Category 1",
  S1G: "SC Category 1",
  S2G: "SC Category 2",
  S3G: "SC Category 3",
  S4R: "SC Category 4 (Rural)",
  STG: "Scheduled Tribe",
  STK: "ST (Kannada Medium)",
  STR: "ST (Rural)",
} as const

export type Category = keyof typeof CATEGORIES

/** The printable label for a category, e.g. "General Merit". */
export type CategoryLabel = (typeof CATEGORIES)[Category]

export const ROUNDS = {
  MOCK: "Mock Allotment",
  R1: "Round 1",
  R2: "Round 2",
  R3: "Round 3 / Extended",
} as const

export type Round = keyof typeof ROUNDS

export type RoundLabel = (typeof ROUNDS)[Round]

export const BRANCHES = {
  CSE: "Computer Science & Engineering",
  ISE: "Information Science & Engineering",
  ECE: "Electronics & Communication Engg",
  EEE: "Electrical & Electronics Engg",
  ME: "Mechanical Engineering",
  CV: "Civil Engineering",
  CH: "Chemical Engineering",
  BT: "Biotechnology",
  AI_ML: "Artificial Intelligence & ML",
  AI_DS: "AI & Data Science",
  CSBS: "CS & Business Systems",
  IT: "Information Technology",
  AERO: "Aerospace Engineering",
  AUTO: "Automobile Engineering",
  MATHS_COMPUTING: "Mathematics & Computing",
  ROBOTICS: "Robotics & Automation",
  IOT: "Internet of Things",
  CYBER: "Cyber Security",
} as const

export type Branch = keyof typeof BRANCHES

export type BranchLabel = (typeof BRANCHES)[Branch]

export const CITIES = [
  "Bagalkot",
  "Ballari",
  "Belagavi",
  "Bengaluru",
  "Bhatkal",
  "Bidar",
  "Chamarajanagara",
  "Chikkaballapur",
  "Chikkamagaluru",
  "Chitradurga",
  "Davangere",
  "Dharwad",
  "Gadag",
  "Hassan",
  "Hubballi",
  "Kalaburagi",
  "Karwar",
  "Kolar",
  "Koppal",
  "Madikeri",
  "Mandya",
  "Mangaluru",
  "Mysuru",
  "Puttur",
  "Raichur",
  "Ramanagara",
  "Ranebennur",
  "Shivamogga",
  "Sullia",
  "Tumakuru",
  "Udupi",
  "Ujire",
  "Vijayapura",
  "Yadgir",
] as const

export type City = (typeof CITIES)[number]

/* ─── Field unions ───
 * Named separately so a filter control or a parser can refer to one without
 * restating the literals. Each interface below resolves identically. */

export type Region =
  | "North Karnataka"
  | "South Karnataka"
  | "Coastal Karnataka"
  | "Central Karnataka"
  | "Bengaluru"

export type CollegeType = "Government" | "Government Aided" | "Private Unaided"

export type Affiliation = "VTU" | "Autonomous" | "Deemed"

export type HostelType = "Boys" | "Girls" | "Both" | "None"

export type NaacGrade = "A++" | "A+" | "A" | "B++" | "B+" | "B"

/** KEA publishes the general pool and the 371(j) pool as separate reports. */
export type SeatType = "Regular" | "HK"

export type Gender = "M" | "F"

/** How likely a seat is, as shown on a prediction. */
export type ChanceLabel = "High" | "Moderate" | "Low"

/** Which way a cutoff has moved year on year. */
export type Trend = "tightening" | "relaxing" | "stable"

/** Where a choice sits on an option-entry list. */
export type Tier = "Aspirational" | "Moderate" | "Safe"

/** How much the inputs pin down an estimate. */
export type Confidence = "High" | "Medium" | "Low"

/* ─── Core interfaces ─── */

export interface College {
  id: string
  name: string
  shortName: string
  city: City
  district: string
  region: Region
  type: CollegeType
  affiliation: Affiliation
  established: number
  hasHostel: boolean
  hostelType: HostelType
  /** null when the college is unranked. */
  nirfRank: number | null
  /** null when no accreditation is on record. */
  naacGrade: NaacGrade | null
  totalSeats: number
  availableBranches: Branch[]
  /** Lakhs per annum. */
  avgPackage: number
  /** Lakhs per annum. */
  highestPackage: number
  topRecruiters: string[]
  website: string
  kea_code: string
  latitude: number
  longitude: number
  /** Rupees per year under the KEA quota. */
  annualFee: number
}

/**
 * One published cutoff: the ranks a single branch opened and closed at, for
 * one category, in one round of one year. Flat rather than nested so a chart
 * or table can filter on any axis without walking a tree.
 */
export interface CutoffEntry {
  collegeId: string
  branch: Branch
  category: Category
  round: Round
  /** Which allotment pool this rank came from. */
  seatType: SeatType
  year: number
  openingRank: number
  closingRank: number
  /**
   * KEA's allotment reports carry closing ranks only, so seat counts are
   * absent on every row read from them rather than filled in with a guess.
   */
  totalSeats?: number
  filledSeats?: number
}

/** A college and branch weighed against the student's rank. */
export interface PredictionResult {
  college: College
  branch: Branch
  branchName: string
  closingRank: number
  openingRank: number
  yourRank: number
  round: Round
  year: number
  chancePercent: number
  chanceLabel: ChanceLabel
  trend: Trend
  /** Rank movement against the previous year. Negative means tightening. */
  trendDelta: number
  tier: Tier
  avgPackage: number
  highestPackage: number
}

/** What the student types into the rank calculator. */
export interface StudentInput {
  physicsMarks: number
  chemistryMarks: number
  mathsMarks: number
  kcetScore: number
  category: Category
  gender: Gender
  isHKRegion: boolean
}

/** The calculator's answer: a band, not a single number. */
export interface RankEstimate {
  minRank: number
  maxRank: number
  estimatedRank: number
  confidence: Confidence
  boardPercent: number
  kcetPercent: number
  /** The 50:50 composite the rank is read off. */
  finalScore: number
}

/** Everything the predictor filters on. */
export interface CollegePreferenceInput {
  rank: number
  category: Category
  gender: Gender
  isHKRegion: boolean
  preferredCities: string[]
  preferredBranches: Branch[]
  willingToHostel: boolean
  /** null means no fee ceiling. */
  maxFee: number | null
  collegeType: CollegeType[]
}

/** One row on the student's option-entry list. Order is the list's meaning. */
export interface OptionEntry {
  id: string
  prediction: PredictionResult
  tier: Tier
  userNote: string
  /** Epoch milliseconds. */
  addedAt: number
}

/** A point on a cutoff-over-time chart. */
export interface CutoffHistoryPoint {
  year: number
  round: Round
  openingRank: number
  closingRank: number
}

/* ─── Ordered keys ───
 * Object.keys widens to string[], so these are asserted back to the key union.
 * Insertion order is preserved, which is what makes ROUND_KEYS chronological. */

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as Category[]

export const ROUND_KEYS = Object.keys(ROUNDS) as Round[]

export const BRANCH_KEYS = Object.keys(BRANCHES) as Branch[]

/* ─── Guards ───
 * For anything arriving as a plain string: a URL query param, a CSV column,
 * a value read back out of localStorage. */

export function isCategory(value: string): value is Category {
  return value in CATEGORIES
}

export function isRound(value: string): value is Round {
  return value in ROUNDS
}

export function isBranch(value: string): value is Branch {
  return value in BRANCHES
}

export function isCity(value: string): value is City {
  return (CITIES as readonly string[]).includes(value)
}



