export interface BranchCutoff {
  branchCode: string;
  branchName: string;
  shortName: string;
  round1Cutoff: {
    GM: number;
    "2A": number;
    "2B": number;
    "3A": number;
    "3B": number;
    SCG: number;
    STG: number;
    SC?: number;
    ST?: number;
    HK?: number;
    HKR?: number;
    [key: string]: number | undefined;
  };
  round2Cutoff: {
    GM: number;
    "2A": number;
    "2B": number;
    "3A": number;
    "3B": number;
    SCG: number;
    STG: number;
    SC?: number;
    ST?: number;
    HK?: number;
    HKR?: number;
    [key: string]: number | undefined;
  };
  extendedRoundCutoff: {
    GM: number;
    "2A": number;
    "2B": number;
    "3A": number;
    "3B": number;
    SCG: number;
    STG: number;
    SC?: number;
    ST?: number;
    HK?: number;
    HKR?: number;
    [key: string]: number | undefined;
  };
  seats: number;
  avgSalaryLPA: number;
  demandTier: "Extreme" | "High" | "Moderate" | "Balanced";
}

export interface College {
  id: string;
  code: string;
  kea_code?: string;
  name: string;
  shortName: string;
  city: string;
  district: string;
  type: "Government" | "Aided" | "Autonomous Private" | "Private University" | "Private Unaided";
  established: number;
  nirfRank?: number | null;
  tier: "Tier 1" | "Tier 1.5" | "Tier 2" | "Tier 2.5" | "Tier 3";
  rating: number; // out of 5
  medianCtcLPA: number;
  highestCtcLPA: number;
  avgPackage?: number;
  highestPackage?: number;
  topRecruiters: string[];
  keaQuotaFeeYearly: number; // INR
  annualFee?: number;
  mgmtQuotaFeeYearly?: number;
  campusAcreage: number;
  highlights: string[];
  branches: BranchCutoff[];
}

export const CATEGORIES = [
  { id: "GM", label: "General Merit (GM)", desc: "Open merit category for all applicants" },
  { id: "2A", label: "Category 2A", desc: "Backward Classes (Category 2A - 15% reservation)" },
  { id: "2B", label: "Category 2B", desc: "Backward Classes (Category 2B - 4% reservation)" },
  { id: "3A", label: "Category 3A", desc: "Backward Classes (Category 3A - 4% reservation)" },
  { id: "3B", label: "Category 3B", desc: "Backward Classes (Category 3B - 5% reservation)" },
  { id: "SCG", label: "Scheduled Caste (SCG)", desc: "Scheduled Caste General (15% reservation)" },
  { id: "STG", label: "Scheduled Tribe (STG)", desc: "Scheduled Tribe General (3% reservation)" },
  { id: "SC", label: "Scheduled Caste (SC)", desc: "Scheduled Caste" },
  { id: "ST", label: "Scheduled Tribe (ST)", desc: "Scheduled Tribe" },
  { id: "HK", label: "Horanadu Kannadiga (HK)", desc: "Horanadu Kannadiga" },
  { id: "HKR", label: "Hyderabad Karnataka Region (HKR)", desc: "Article 371-J Quota" },
] as const;

export type CategoryKey = "GM" | "2A" | "2B" | "3A" | "3B" | "SCG" | "STG" | "SC" | "ST" | "HK" | "HKR";

export const KCET_COLLEGES: College[] = [
  {
    id: "rvce-bangalore",
    code: "E001",
    kea_code: "E001",
    name: "R.V. College of Engineering",
    shortName: "RVCE",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    type: "Autonomous Private",
    established: 1963,
    nirfRank: 89,
    tier: "Tier 1",
    rating: 4.8,
    medianCtcLPA: 14.5,
    highestCtcLPA: 62.0,
    avgPackage: 14.5,
    highestPackage: 62.0,
    topRecruiters: ["Google", "Amazon", "Microsoft", "Cisco", "Nvidia", "Qualcomm", "Atlassian"],
    keaQuotaFeeYearly: 105000,
    annualFee: 105000,
    mgmtQuotaFeeYearly: 1200000,
    campusAcreage: 52,
    highlights: ["Ranked #1 Engineering College under KCET", "Exceptional tech placements & research facilities", "50+ years of institutional excellence"],
    branches: [
      {
        branchCode: "CS",
        branchName: "Computer Science & Engineering",
        shortName: "CSE",
        round1Cutoff: { GM: 280, "2A": 650, "2B": 1100, "3A": 490, "3B": 520, SCG: 2200, STG: 3100, SC: 2200, ST: 3100 },
        round2Cutoff: { GM: 350, "2A": 780, "2B": 1280, "3A": 580, "3B": 620, SCG: 2600, STG: 3600, SC: 2600, ST: 3600 },
        extendedRoundCutoff: { GM: 420, "2A": 890, "2B": 1450, "3A": 660, "3B": 710, SCG: 2950, STG: 4100, SC: 2950, ST: 4100 },
        seats: 180,
        avgSalaryLPA: 19.8,
        demandTier: "Extreme"
      },
      {
        branchCode: "AI",
        branchName: "Artificial Intelligence & Machine Learning",
        shortName: "AIML",
        round1Cutoff: { GM: 450, "2A": 1050, "2B": 1650, "3A": 780, "3B": 840, SCG: 3400, STG: 4800, SC: 3400, ST: 4800 },
        round2Cutoff: { GM: 560, "2A": 1240, "2B": 1920, "3A": 930, "3B": 990, SCG: 3950, STG: 5500, SC: 3950, ST: 5500 },
        extendedRoundCutoff: { GM: 670, "2A": 1420, "2B": 2180, "3A": 1080, "3B": 1150, SCG: 4400, STG: 6200, SC: 4400, ST: 6200 },
        seats: 60,
        avgSalaryLPA: 18.2,
        demandTier: "Extreme"
      },
      {
        branchCode: "IS",
        branchName: "Information Science & Engineering",
        shortName: "ISE",
        round1Cutoff: { GM: 620, "2A": 1380, "2B": 2100, "3A": 1050, "3B": 1120, SCG: 4200, STG: 5900, SC: 4200, ST: 5900 },
        round2Cutoff: { GM: 750, "2A": 1620, "2B": 2450, "3A": 1240, "3B": 1310, SCG: 4900, STG: 6800, SC: 4900, ST: 6800 },
        extendedRoundCutoff: { GM: 880, "2A": 1850, "2B": 2780, "3A": 1420, "3B": 1500, SCG: 5500, STG: 7600, SC: 5500, ST: 7600 },
        seats: 120,
        avgSalaryLPA: 17.5,
        demandTier: "Extreme"
      },
      {
        branchCode: "EC",
        branchName: "Electronics & Communication Engineering",
        shortName: "ECE",
        round1Cutoff: { GM: 1150, "2A": 2550, "2B": 3800, "3A": 1920, "3B": 2050, SCG: 7200, STG: 9800, SC: 7200, ST: 9800 },
        round2Cutoff: { GM: 1380, "2A": 2980, "2B": 4400, "3A": 2280, "3B": 2420, SCG: 8300, STG: 11200, SC: 8300, ST: 11200 },
        extendedRoundCutoff: { GM: 1620, "2A": 3400, "2B": 4980, "3A": 2650, "3B": 2810, SCG: 9400, STG: 12600, SC: 9400, ST: 12600 },
        seats: 180,
        avgSalaryLPA: 14.2,
        demandTier: "High"
      }
    ]
  },
  {
    id: "bmsce-bangalore",
    code: "E002",
    kea_code: "E002",
    name: "B.M.S. College of Engineering",
    shortName: "BMSCE",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    type: "Aided",
    established: 1946,
    nirfRank: 101,
    tier: "Tier 1",
    rating: 4.7,
    medianCtcLPA: 12.8,
    highestCtcLPA: 50.0,
    avgPackage: 12.8,
    highestPackage: 50.0,
    topRecruiters: ["Adobe", "Oracle", "Goldman Sachs", "Intel", "Texas Instruments", "SAP", "Schneider"],
    keaQuotaFeeYearly: 105000,
    annualFee: 105000,
    mgmtQuotaFeeYearly: 1000000,
    campusAcreage: 15,
    highlights: ["First private engineering college in India", "Central Bangalore location (Basavanagudi)", "Premier industry partnerships"],
    branches: [
      {
        branchCode: "CS",
        branchName: "Computer Science & Engineering",
        shortName: "CSE",
        round1Cutoff: { GM: 650, "2A": 1450, "2B": 2200, "3A": 1100, "3B": 1180, SCG: 4600, STG: 6200, SC: 4600, ST: 6200 },
        round2Cutoff: { GM: 820, "2A": 1780, "2B": 2650, "3A": 1350, "3B": 1420, SCG: 5400, STG: 7200, SC: 5400, ST: 7200 },
        extendedRoundCutoff: { GM: 980, "2A": 2080, "2B": 3050, "3A": 1580, "3B": 1660, SCG: 6150, STG: 8100, SC: 6150, ST: 8100 },
        seats: 240,
        avgSalaryLPA: 16.8,
        demandTier: "Extreme"
      },
      {
        branchCode: "IS",
        branchName: "Information Science & Engineering",
        shortName: "ISE",
        round1Cutoff: { GM: 1100, "2A": 2400, "2B": 3600, "3A": 1850, "3B": 1980, SCG: 7200, STG: 9800, SC: 7200, ST: 9800 },
        round2Cutoff: { GM: 1380, "2A": 2920, "2B": 4300, "3A": 2250, "3B": 2390, SCG: 8400, STG: 11100, SC: 8400, ST: 11100 },
        extendedRoundCutoff: { GM: 1650, "2A": 3410, "2B": 4950, "3A": 2640, "3B": 2780, SCG: 9500, STG: 12400, SC: 9500, ST: 12400 },
        seats: 180,
        avgSalaryLPA: 14.8,
        demandTier: "High"
      },
      {
        branchCode: "EC",
        branchName: "Electronics & Communication Engineering",
        shortName: "ECE",
        round1Cutoff: { GM: 2200, "2A": 4600, "2B": 6800, "3A": 3600, "3B": 3850, SCG: 12500, STG: 16800, SC: 12500, ST: 16800 },
        round2Cutoff: { GM: 2750, "2A": 5550, "2B": 8100, "3A": 4400, "3B": 4680, SCG: 14800, STG: 19600, SC: 14800, ST: 19600 },
        extendedRoundCutoff: { GM: 3300, "2A": 6480, "2B": 9350, "3A": 5150, "3B": 5460, SCG: 16900, STG: 22100, SC: 16900, ST: 22100 },
        seats: 180,
        avgSalaryLPA: 12.6,
        demandTier: "High"
      }
    ]
  },
  {
    id: "msrit-bangalore",
    code: "E003",
    kea_code: "E003",
    name: "Ramaiah Institute of Technology (MSRIT)",
    shortName: "MSRIT",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    type: "Autonomous Private",
    established: 1962,
    nirfRank: 78,
    tier: "Tier 1",
    rating: 4.7,
    medianCtcLPA: 12.5,
    highestCtcLPA: 50.0,
    avgPackage: 12.5,
    highestPackage: 50.0,
    topRecruiters: ["Morgan Stanley", "Intuit", "Amazon", "Target", "Cadence", "Capgemini", "Accenture"],
    keaQuotaFeeYearly: 105000,
    annualFee: 105000,
    mgmtQuotaFeeYearly: 950000,
    campusAcreage: 25,
    highlights: ["Ranked 78 in NIRF All India", "Centrally located in Mathikere", "Superb alumni network in Silicon Valley"],
    branches: [
      {
        branchCode: "CS",
        branchName: "Computer Science & Engineering",
        shortName: "CSE",
        round1Cutoff: { GM: 780, "2A": 1650, "2B": 2500, "3A": 1280, "3B": 1360, SCG: 5100, STG: 6900, SC: 5100, ST: 6900 },
        round2Cutoff: { GM: 990, "2A": 2050, "2B": 3050, "3A": 1580, "3B": 1670, SCG: 6100, STG: 8100, SC: 6100, ST: 8100 },
        extendedRoundCutoff: { GM: 1180, "2A": 2420, "2B": 3520, "3A": 1860, "3B": 1950, SCG: 7000, STG: 9200, SC: 7000, ST: 9200 },
        seats: 240,
        avgSalaryLPA: 16.5,
        demandTier: "Extreme"
      },
      {
        branchCode: "IS",
        branchName: "Information Science & Engineering",
        shortName: "ISE",
        round1Cutoff: { GM: 1320, "2A": 2780, "2B": 4100, "3A": 2150, "3B": 2280, SCG: 8100, STG: 10800, SC: 8100, ST: 10800 },
        round2Cutoff: { GM: 1650, "2A": 3380, "2B": 4920, "3A": 2620, "3B": 2760, SCG: 9500, STG: 12400, SC: 9500, ST: 12400 },
        extendedRoundCutoff: { GM: 1980, "2A": 3950, "2B": 5680, "3A": 3050, "3B": 3210, SCG: 10800, STG: 13900, SC: 10800, ST: 13900 },
        seats: 180,
        avgSalaryLPA: 14.5,
        demandTier: "High"
      },
      {
        branchCode: "EC",
        branchName: "Electronics & Communication Engineering",
        shortName: "ECE",
        round1Cutoff: { GM: 2550, "2A": 5200, "2B": 7600, "3A": 4100, "3B": 4350, SCG: 14100, STG: 18800, SC: 14100, ST: 18800 },
        round2Cutoff: { GM: 3200, "2A": 6350, "2B": 9100, "3A": 4980, "3B": 5280, SCG: 16700, STG: 21900, SC: 16700, ST: 21900 },
        extendedRoundCutoff: { GM: 3820, "2A": 7420, "2B": 10500, "3A": 5800, "3B": 6120, SCG: 19100, STG: 24800, SC: 19100, ST: 24800 },
        seats: 180,
        avgSalaryLPA: 12.2,
        demandTier: "High"
      }
    ]
  },
  {
    id: "pes-rr-bangalore",
    code: "E007",
    kea_code: "E007",
    name: "PES University (RR Campus)",
    shortName: "PES RR",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    type: "Private University",
    established: 1972,
    nirfRank: 105,
    tier: "Tier 1",
    rating: 4.6,
    medianCtcLPA: 13.5,
    highestCtcLPA: 65.0,
    avgPackage: 13.5,
    highestPackage: 65.0,
    topRecruiters: ["Microsoft", "Apple", "Google", "Amazon", "Akamai", "Cisco", "Walmart Labs"],
    keaQuotaFeeYearly: 105000,
    annualFee: 105000,
    mgmtQuotaFeeYearly: 1100000,
    campusAcreage: 30,
    highlights: ["State-of-the-art coding and hackathon culture", "Tremendous CS hiring stats", "Tier 1 tech company target school"],
    branches: [
      {
        branchCode: "CS",
        branchName: "Computer Science & Engineering",
        shortName: "CSE",
        round1Cutoff: { GM: 720, "2A": 1550, "2B": 2400, "3A": 1200, "3B": 1280, SCG: 4900, STG: 6600, SC: 4900, ST: 6600 },
        round2Cutoff: { GM: 910, "2A": 1920, "2B": 2900, "3A": 1490, "3B": 1580, SCG: 5800, STG: 7700, SC: 5800, ST: 7700 },
        extendedRoundCutoff: { GM: 1090, "2A": 2260, "2B": 3380, "3A": 1750, "3B": 1840, SCG: 6650, STG: 8750, SC: 6650, ST: 8750 },
        seats: 480,
        avgSalaryLPA: 17.8,
        demandTier: "Extreme"
      },
      {
        branchCode: "EC",
        branchName: "Electronics & Communication Engineering",
        shortName: "ECE",
        round1Cutoff: { GM: 2400, "2A": 4900, "2B": 7200, "3A": 3850, "3B": 4100, SCG: 13400, STG: 17900, SC: 13400, ST: 17900 },
        round2Cutoff: { GM: 3020, "2A": 6020, "2B": 8680, "3A": 4720, "3B": 5010, SCG: 15900, STG: 20900, SC: 15900, ST: 20900 },
        extendedRoundCutoff: { GM: 3610, "2A": 7050, "2B": 10050, "3A": 5510, "3B": 5830, SCG: 18200, STG: 23700, SC: 18200, ST: 23700 },
        seats: 240,
        avgSalaryLPA: 13.0,
        demandTier: "High"
      }
    ]
  },
  {
    id: "uvce-bangalore",
    code: "E005",
    kea_code: "E005",
    name: "University Visvesvaraya College of Engineering (UVCE)",
    shortName: "UVCE",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    type: "Government",
    established: 1917,
    tier: "Tier 1",
    rating: 4.5,
    medianCtcLPA: 11.2,
    highestCtcLPA: 48.0,
    avgPackage: 11.2,
    highestPackage: 48.0,
    topRecruiters: ["Texas Instruments", "SAP Labs", "Dell", "Bosch", "Samsung", "Honeywell"],
    keaQuotaFeeYearly: 42000,
    annualFee: 42000,
    campusAcreage: 16,
    highlights: ["Karnataka's flagship state engineering institute", "Very low tuition fees (~₹42k/yr)", "Centenary institution founded by Sir MV"],
    branches: [
      {
        branchCode: "CS",
        branchName: "Computer Science & Engineering",
        shortName: "CSE",
        round1Cutoff: { GM: 1650, "2A": 3450, "2B": 5100, "3A": 2680, "3B": 2840, SCG: 9800, STG: 13100, SC: 9800, ST: 13100 },
        round2Cutoff: { GM: 2100, "2A": 4250, "2B": 6200, "3A": 3320, "3B": 3500, SCG: 11700, STG: 15400, SC: 11700, ST: 15400 },
        extendedRoundCutoff: { GM: 2520, "2A": 4980, "2B": 7180, "3A": 3910, "3B": 4100, SCG: 13400, STG: 17400, SC: 13400, ST: 17400 },
        seats: 120,
        avgSalaryLPA: 14.2,
        demandTier: "High"
      }
    ]
  },
  {
    id: "sjce-mysuru",
    code: "E008",
    kea_code: "E008",
    name: "Sri Jayachamarajendra College of Engineering (SJCE / JSS STU)",
    shortName: "SJCE Mysuru",
    city: "Mysuru",
    district: "Mysuru",
    type: "Autonomous Private",
    established: 1963,
    nirfRank: 158,
    tier: "Tier 1",
    rating: 4.6,
    medianCtcLPA: 11.5,
    highestCtcLPA: 45.0,
    avgPackage: 11.5,
    highestPackage: 45.0,
    topRecruiters: ["Cisco", "Western Digital", "HPE", "Mercedes-Benz", "Qualcomm", "Deloitte"],
    keaQuotaFeeYearly: 105000,
    annualFee: 105000,
    mgmtQuotaFeeYearly: 850000,
    campusAcreage: 102,
    highlights: ["Sprawling 102-acre lush green campus in Mysuru", "Top Tier 1 college outside Bengaluru", "Unmatched core & IT placement record"],
    branches: [
      {
        branchCode: "CS",
        branchName: "Computer Science & Engineering",
        shortName: "CSE",
        round1Cutoff: { GM: 1450, "2A": 3050, "2B": 4500, "3A": 2350, "3B": 2490, SCG: 8800, STG: 11800, SC: 8800, ST: 11800 },
        round2Cutoff: { GM: 1850, "2A": 3780, "2B": 5500, "3A": 2920, "3B": 3080, SCG: 10500, STG: 13900, SC: 10500, ST: 13900 },
        extendedRoundCutoff: { GM: 2210, "2A": 4420, "2B": 6380, "3A": 3450, "3B": 3620, SCG: 12050, STG: 15800, SC: 12050, ST: 15800 },
        seats: 180,
        avgSalaryLPA: 15.2,
        demandTier: "Extreme"
      }
    ]
  },
  {
    id: "dsce-bangalore",
    code: "E012",
    kea_code: "E012",
    name: "Dayananda Sagar College of Engineering (DSCE)",
    shortName: "DSCE",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    type: "Autonomous Private",
    established: 1979,
    nirfRank: 172,
    tier: "Tier 1.5",
    rating: 4.4,
    medianCtcLPA: 9.8,
    highestCtcLPA: 42.0,
    avgPackage: 9.8,
    highestPackage: 42.0,
    topRecruiters: ["Cognizant", "Accenture", "TCS Digital", "LTI", "Mercedes-Benz", "Bosch", "Dell"],
    keaQuotaFeeYearly: 105000,
    annualFee: 105000,
    mgmtQuotaFeeYearly: 800000,
    campusAcreage: 29,
    highlights: ["Massive campus located in Kumaraswamy Layout", "Over 20 engineering branches", "High placement conversion rate"],
    branches: [
      {
        branchCode: "CS",
        branchName: "Computer Science & Engineering",
        shortName: "CSE",
        round1Cutoff: { GM: 2650, "2A": 5400, "2B": 7800, "3A": 4200, "3B": 4450, SCG: 14500, STG: 19200, SC: 14500, ST: 19200 },
        round2Cutoff: { GM: 3350, "2A": 6650, "2B": 9500, "3A": 5200, "3B": 5500, SCG: 17200, STG: 22600, SC: 17200, ST: 22600 },
        extendedRoundCutoff: { GM: 4010, "2A": 7800, "2B": 10980, "3A": 6120, "3B": 6450, SCG: 19650, STG: 25600, SC: 19650, ST: 25600 },
        seats: 360,
        avgSalaryLPA: 13.5,
        demandTier: "High"
      }
    ]
  },
  {
    id: "nie-mysuru",
    code: "E009",
    kea_code: "E009",
    name: "The National Institute of Engineering (NIE)",
    shortName: "NIE Mysuru",
    city: "Mysuru",
    district: "Mysuru",
    type: "Aided",
    established: 1946,
    tier: "Tier 1.5",
    rating: 4.4,
    medianCtcLPA: 10.5,
    highestCtcLPA: 44.0,
    avgPackage: 10.5,
    highestPackage: 44.0,
    topRecruiters: ["Cisco", "JP Morgan Chase", "SAP Labs", "TCS Digital", "ABB", "Titan"],
    keaQuotaFeeYearly: 105000,
    annualFee: 105000,
    mgmtQuotaFeeYearly: 750000,
    campusAcreage: 38,
    highlights: ["Historic institution with alumni like N. R. Narayana Murthy", "Brand new South Campus dedicated to CSE/IT", "Renowned engineering pedagogy"],
    branches: [
      {
        branchCode: "CS",
        branchName: "Computer Science & Engineering",
        shortName: "CSE",
        round1Cutoff: { GM: 2950, "2A": 5950, "2B": 8600, "3A": 4650, "3B": 4920, SCG: 15800, STG: 20900, SC: 15800, ST: 20900 },
        round2Cutoff: { GM: 3750, "2A": 7350, "2B": 10500, "3A": 5800, "3B": 6120, SCG: 18800, STG: 24700, SC: 18800, ST: 24700 },
        extendedRoundCutoff: { GM: 4480, "2A": 8620, "2B": 12150, "3A": 6820, "3B": 7180, SCG: 21500, STG: 27900, SC: 21500, ST: 27900 },
        seats: 240,
        avgSalaryLPA: 13.8,
        demandTier: "High"
      }
    ]
  },
  {
    id: "bmsit-bangalore",
    code: "E036",
    kea_code: "E036",
    name: "BMS Institute of Technology & Management (BMSIT)",
    shortName: "BMSIT",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    type: "Autonomous Private",
    established: 2002,
    tier: "Tier 1.5",
    rating: 4.3,
    medianCtcLPA: 8.8,
    highestCtcLPA: 44.0,
    avgPackage: 8.8,
    highestPackage: 44.0,
    topRecruiters: ["Amazon", "Dell", "Capgemini", "Accenture", "SAP", "Nokia"],
    keaQuotaFeeYearly: 105000,
    annualFee: 105000,
    mgmtQuotaFeeYearly: 700000,
    campusAcreage: 21,
    highlights: ["Sister institute to BMSCE in Yelahanka (North Bangalore)", "Rapidly rising cutoffs & campus infrastructure", "Strong coding society and startups"],
    branches: [
      {
        branchCode: "CS",
        branchName: "Computer Science & Engineering",
        shortName: "CSE",
        round1Cutoff: { GM: 4100, "2A": 8150, "2B": 11600, "3A": 6400, "3B": 6780, SCG: 20800, STG: 27100, SC: 20800, ST: 27100 },
        round2Cutoff: { GM: 5200, "2A": 10100, "2B": 14100, "3A": 7950, "3B": 8400, SCG: 24700, STG: 31900, SC: 24700, ST: 31900 },
        extendedRoundCutoff: { GM: 6180, "2A": 11750, "2B": 16200, "3A": 9300, "3B": 9820, SCG: 28200, STG: 36050, SC: 28200, ST: 36050 },
        seats: 240,
        avgSalaryLPA: 12.2,
        demandTier: "High"
      }
    ]
  }
];

export const ALL_BRANCHES = [
  { code: "ALL", label: "All Engineering Branches" },
  { code: "CSE", label: "Computer Science & Engineering (CSE)" },
  { code: "AIML", label: "AI & Machine Learning (AIML)" },
  { code: "AIDS", label: "AI & Data Science (AIDS)" },
  { code: "ISE", label: "Information Science & Engineering (ISE)" },
  { code: "ECE", label: "Electronics & Communication (ECE)" },
  { code: "EEE", label: "Electrical & Electronics (EEE)" },
  { code: "ME", label: "Mechanical Engineering (ME)" },
] as const;

export const LOCATIONS = [
  { id: "ALL", label: "All Districts" },
  { id: "Bengaluru", label: "Bengaluru" },
  { id: "Mysuru", label: "Mysuru" },
  { id: "Hubballi", label: "Hubballi-Dharwad" },
  { id: "Tumakuru", label: "Tumakuru" },
] as const;
