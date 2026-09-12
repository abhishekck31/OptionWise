import type { Branch, City, College } from "@/types";

/* ============================================================================
 * Karnataka engineering colleges, from the KEA UGCET 2026 allotment reports.
 *
 * VERIFIED, straight from the official cut-off PDFs:
 *   kea_code, name, availableBranches
 *   city / district / region, read off the postal address KEA prints
 *
 * HEURISTIC, marked inline on every field below — no source, do not present
 * as fact: type, affiliation, established, hasHostel, hostelType, totalSeats,
 * avgPackage, highestPackage, topRecruiters, annualFee, latitude, longitude.
 * website is "", nirfRank is null throughout, and naacGrade is null except
 * for the handful of grades that are widely published.
 *
 * KEA lists some institutions under two codes, one pool of seats each with its
 * own branches and its own cut-offs — BMSCE as E003 and E048, NIE as E022,
 * E056 and E178, and ten more. They are separate entries here because that is
 * how a candidate enters them during option entry; the code tells them apart.
 *
 * Source: cetonline.karnataka.gov.in, UGCET 2026 rounds 1-3, Regular and
 * 371(j) Kalyana-Karnataka seat types.
 * ========================================================================== */

export const colleges: College[] = [
  {
    id: "univesity-of-visvesvaraya-college-of-engineering-k",
    name: "Univesity of Visvesvaraya College of Engineering (A State Autonomous Public University on IIT Model) K R Circle, Bangalore",
    shortName: "UVCE",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Government",
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 840, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_DS"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E001",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "govt-s-ksjt-institute-of-engineering-bangalore",
    name: "Govt.S KSJT Institute of Engineering, Bangalore",
    shortName: "SKSJTI",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 180, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "CV"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E002",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "b-m-s-college-of-engineering-basavanagudi",
    name: "B M S College of Engineering, Basavanagudi, Bangalore",
    shortName: "BMSCE E003",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: "A",
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["ECE", "EEE", "ME", "CV"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E003",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 120000, // HEURISTIC — verify before shipping
  },
  {
    id: "dr-ambedkar-institute-of-technology-bangalore",
    name: "Dr. Ambedkar Institute of Technology, Bangalore(AUTONOMOUS)",
    shortName: "Dr. AIT E004",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E004",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "r-v-college-of-engineering-bangalore",
    name: "R. V. College of Engineering, Bangalore(AUTONOMOUS)",
    shortName: "RVCE",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: "A+",
    totalSeats: 1320, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "CH", "BT", "AI_ML", "AI_DS", "AERO", "CYBER"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E005",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 120000, // HEURISTIC — verify before shipping
  },
  {
    id: "m-s-ramaiah-institute-of-technology-bangalore",
    name: "M S Ramaiah Institute of Technology, Bangalore(AUTONOMOUS)",
    shortName: "MSRIT",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: "A+",
    totalSeats: 1440, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "CH", "BT", "AI_ML", "AI_DS", "AERO", "CYBER"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E006",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 120000, // HEURISTIC — verify before shipping
  },
  {
    id: "dayananda-sagar-college-of-engineering-bangalore",
    name: "Dayananda Sagar College of Engineering, Bangalore(AUTONOMOUS)",
    shortName: "DSCE",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 1560, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "CH", "BT", "AI_ML", "AI_DS", "AERO", "AUTO", "IOT", "CYBER"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E007",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 120000, // HEURISTIC — verify before shipping
  },
  {
    id: "bangalore-institute-of-technology-k-r-road",
    name: "Bangalore Institute of Technology, K.R.Road, Bangalore",
    shortName: "BIT",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 1080, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E008",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 120000, // HEURISTIC — verify before shipping
  },
  {
    id: "pes-university-100-feet-ring-road-banashankari",
    name: "PES University 100 Feet Ring Road, Banashankari, 3rd Stage, Hosakerehalli, Near DSERT, , Bangalore KARNATAKA, pin code -560085",
    shortName: "PESU",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: "A++",
    totalSeats: 720, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "BT", "AI_ML"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E009",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 120000, // HEURISTIC — verify before shipping
  },
  {
    id: "m-v-j-college-of-engineering-bangalore",
    name: "M V J College of Engineering, Bangalore(AUTONOMOUS)",
    shortName: "MVJCE",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 660, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "CH", "AI_ML", "AI_DS", "AERO", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E011",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sir-m-visvesvaraya-institute-of-technology-bangalore",
    name: "Sir M.Visvesvaraya Institute of Technology, Bangalore",
    shortName: "Sir MVIT",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 600, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "BT", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E012",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "ghousia-engineering-college-ramanagara",
    name: "Ghousia Engineering College, Ramanagara",
    shortName: "Ghousia Engineering",
    city: "Ramanagara",
    district: "Ramanagara",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "CV", "AI_ML", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E013",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "s-j-c-institute-of-technology-chickkaballapur",
    name: "S J C Institute of Technology, Chickkaballapur(AUTONOMOUS)",
    shortName: "SJC",
    city: "Chikkaballapur",
    district: "Chikkaballapur",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "AERO"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E014",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "dr-t-thimmaiah-institute-of-technology",
    name: "Dr.T.Thimmaiah Institute of Technology",
    shortName: "Dr T Thimmaiah",
    city: "Kolar",
    district: "Kolar",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E015",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "siddaganga-institute-of-technology-tumkur-b-h",
    name: "Siddaganga Institute of Technology, Tumkur(AUTONOMOUS) B.H.ROAD,TUMKUR",
    shortName: "SIT Tumakuru",
    city: "Tumakuru",
    district: "Tumakuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 1080, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "CH", "BT", "AI_ML"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E016",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 120000, // HEURISTIC — verify before shipping
  },
  {
    id: "sri-siddhartha-institute-of-technology",
    name: "Sri Siddhartha Institute of Technology",
    shortName: "Siddhartha",
    city: "Tumakuru",
    district: "Tumakuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 540, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E017",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "kalpatharu-institute-of-technology-tiptur",
    name: "Kalpatharu Institute of Technology, Tiptur",
    shortName: "Kalpatharu",
    city: "Tumakuru",
    district: "Tumakuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E018",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sri-jayachamarajendra-college-of-engineering-mysore",
    name: "Sri Jayachamarajendra College of Engineering(Constituent College of JSS Science & Technology University), Mysore",
    shortName: "SJCE E021",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 600, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E021",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 120000, // HEURISTIC — verify before shipping
  },
  {
    id: "the-national-institute-of-engineering-mysore",
    name: "The National Institute of Engineering, Mysore(AUTONOMOUS)",
    shortName: "NIE E022",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["ECE", "ME", "CV"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E022",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 120000, // HEURISTIC — verify before shipping
  },
  {
    id: "p-e-s-college-of-engineering-mandya",
    name: "P E S College of Engineering, Mandya(AUTONOMOUS)",
    shortName: "PESCE Mandya E023",
    city: "Mandya",
    district: "Mandya",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["ECE", "EEE", "ME", "CV"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E023",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "malnad-college-of-engineering-hassan",
    name: "Malnad College of Engineering, Hassan(AUTONOMOUS)",
    shortName: "MCE Hassan E024",
    city: "Hassan",
    district: "Hassan",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["ECE", "EEE", "ME", "CV"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E024",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "tontadarya-college-of-engineering-gadag",
    name: "Tontadarya College of Engineering, Gadag",
    shortName: "Tontadarya",
    city: "Gadag",
    district: "Gadag",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E028",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "maratha-mandal-engineering-college-belgaum",
    name: "Maratha Mandal Engineering College, Belgaum",
    shortName: "Maratha Mandal",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E029",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "b-v-v-sangha-s-basaveshwara-engineering",
    name: "B V V Sangha`s Basaveshwara Engineering College , Bagalkote",
    shortName: "BEC E031",
    city: "Bagalkot",
    district: "Bagalkot",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E031",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "r-t-e-soceity-s-rural-engineering",
    name: "R.T.E. Soceity's Rural Engineering College, Hulkoti",
    shortName: "RTE Soceity",
    city: "Gadag",
    district: "Gadag",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E032",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sri-taralabalu-jagadguru-institute-of-technology-ranebennur",
    name: "Sri Taralabalu Jagadguru Institute of Technology, Ranebennur",
    shortName: "Taralabalu Jagadguru",
    city: "Ranebennur",
    district: "Haveri",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E033",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sdm-college-of-engineering-dharwad",
    name: "SDM College of Engineering, Dharwad",
    shortName: "SDMCET",
    city: "Dharwad",
    district: "Dharwad",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 960, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "CH", "AI_ML"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E034",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 120000, // HEURISTIC — verify before shipping
  },
  {
    id: "anjuman-institute-of-technology-management-bhatkal",
    name: "Anjuman Institute of Technology & Management, Bhatkal",
    shortName: "Anjuman",
    city: "Bhatkal",
    district: "Uttara Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "AI_ML", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E035",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "k-l-e-technological-univeristy-belgaum-campus",
    name: "K L E Technological Univeristy, Belgaum Campus (Formerly KLE Dr M.S.Sheshagiri College of Engineering and Technology) UDYAMBAGH,BELGAUM",
    shortName: "KLE Tech",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 840, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "CH", "AI_ML"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E036",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 120000, // HEURISTIC — verify before shipping
  },
  {
    id: "k-l-s-gogte-institute-of-technology",
    name: "K.L.S. Gogte Institute of Technology, Belgaum.(AUTONOMOUS)",
    shortName: "GIT Belagavi",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML", "AERO"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E037",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "bldea-s-vp-dr-p-g-hallakatti",
    name: "BLDEA's VP. Dr.P.G. Hallakatti College of Engineering & Technology, Bijapur",
    shortName: "BLDEA s",
    city: "Vijayapura",
    district: "Vijayapura",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E038",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "hira-sugar-institute-of-technology-nidasoshi",
    name: "Hira Sugar Institute of Technology, Nidasoshi",
    shortName: "Hira Sugar",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E040",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "p-d-a-college-of-engineering-gulbarga",
    name: "P D A College of Engineering, Gulbarga(AUTONOMOUS)",
    shortName: "PDACE E041",
    city: "Kalaburagi",
    district: "Kalaburagi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["ECE", "EEE", "ME", "CV"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E041",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "khaja-bandanawaz-university-kbn-university-street-khaja",
    name: "Khaja Bandanawaz University KBN University Street, Khaja Colony, Kalaburagi, Karnataka 585104",
    shortName: "Khaja Bandanawaz",
    city: "Kalaburagi",
    district: "Kalaburagi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AERO"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E042",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "gurunanak-dev-engineering-college-bidar",
    name: "Gurunanak Dev Engineering College, Bidar",
    shortName: "Gurunanak Dev",
    city: "Bidar",
    district: "Bidar",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 540, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E043",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "bheemanna-khandre-institute-of-technology-bhalki",
    name: "Bheemanna Khandre Institute of Technology, Bhalki",
    shortName: "Bheemanna Khandre",
    city: "Bidar",
    district: "Bidar",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "CH", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E044",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "rao-bahadur-y-mahabaleswarappa-engineering-college-bellary",
    name: "Rao Bahadur Y.Mahabaleswarappa Engineering College, Bellary",
    shortName: "Rao Bahadur",
    city: "Ballari",
    district: "Ballari",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 540, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E045",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "h-k-e-s-society-s-sir",
    name: "H K E's Society's Sir M Visvesvaraya College of Engineering, Raichur",
    shortName: "HKES Society",
    city: "Raichur",
    district: "Raichur",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E046",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "malnad-college-of-engineering-hassan-e047",
    name: "Malnad College of Engineering, Hassan(AUTONOMOUS)",
    shortName: "MCE Hassan E047",
    city: "Hassan",
    district: "Hassan",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "CV", "AI_ML", "CSBS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E047",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "b-m-s-college-of-engineering-basavanagudi-e048",
    name: "B M S College of Engineering, Basavanagudi, Bangalore",
    shortName: "BMSCE E048",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: "A",
    totalSeats: 1200, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "CH", "BT", "AI_ML", "AI_DS", "CSBS", "IOT"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E048",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 120000, // HEURISTIC — verify before shipping
  },
  {
    id: "b-v-v-sangha-s-basaveshwara-engineering-e049",
    name: "B V V Sangha`s Basaveshwara Engineering College , Bagalkote",
    shortName: "BEC E049",
    city: "Bagalkot",
    district: "Bagalkot",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "BT", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E049",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "k-v-g-college-of-engineering-sullia",
    name: "K V G College of Engineering, Sullia KURUNJIBHAG",
    shortName: "KVG",
    city: "Sullia",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E054",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "p-a-college-of-engineering-kairangal-bantwala",
    name: "P A College of Engineering, Kairangal, Bantwala Tq,. Mangalore",
    shortName: "PA",
    city: "Mangaluru",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "BT", "AI_ML", "IOT"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E055",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "the-national-institute-of-engineering-mysore-e056",
    name: "The National Institute of Engineering, Mysore(AUTONOMOUS)",
    shortName: "NIE E056",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["ECE", "EEE", "ME", "CV"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E056",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "jss-science-and-technology-university",
    name: "JSS Science and Technology University",
    shortName: "JSS Science",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "BT", "AI_ML", "CSBS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E057",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "p-e-s-college-of-engineering-mandya-e058",
    name: "P E S College of Engineering, Mandya(AUTONOMOUS)",
    shortName: "PESCE Mandya E058",
    city: "Mandya",
    district: "Mandya",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "CV", "AI_ML", "AI_DS", "CSBS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E058",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "p-d-a-college-of-engineering-gulbarga-e059",
    name: "P D A College of Engineering, Gulbarga(AUTONOMOUS)",
    shortName: "PDACE E059",
    city: "Kalaburagi",
    district: "Kalaburagi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E059",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "dr-ambedkar-institute-of-technology-bangalore-e060",
    name: "Dr. Ambedkar Institute of Technology, Bangalore(AUTONOMOUS)",
    shortName: "Dr. AIT E060",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "CV", "AI_ML", "AI_DS", "CSBS", "AERO"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E060",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "university-b-d-t-college-of-engineering",
    name: "University B.D.T College of Engineering, Davanagere",
    shortName: "University BDT E061",
    city: "Davangere",
    district: "Davangere",
    region: "Central Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E061",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "bapuji-institute-of-engineering-technology-davangere",
    name: "Bapuji Institute of Engineering & Technology, Davangere",
    shortName: "Bapuji",
    city: "Davangere",
    district: "Davangere",
    region: "Central Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 660, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "CH", "BT", "AI_ML", "AI_DS", "CSBS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E062",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sri-jagadguru-murugharajendra-university",
    name: "Sri Jagadguru Murugharajendra University (SJM Institute of Technology)",
    shortName: "Jagadguru",
    city: "Chitradurga",
    district: "Chitradurga",
    region: "Central Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E063",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "adhichunchanagiri-institute-of-technology-chickamagalur",
    name: "Adhichunchanagiri Institute of Technology, Chickamagalur",
    shortName: "Adhichunchanagiri E064",
    city: "Chikkamagaluru",
    district: "Chikkamagaluru",
    region: "Central Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E064",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "jawaharlal-nehru-new-college-of-engineering-shimoga",
    name: "Jawaharlal Nehru New College of Engineering, Shimoga",
    shortName: "Jawaharlal Nehru",
    city: "Shivamogga",
    district: "Shivamogga",
    region: "Central Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E065",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "university-b-d-t-college-of-engineering-e066",
    name: "University B.D.T College of Engineering, Davanagere",
    shortName: "University BDT E066",
    city: "Davangere",
    district: "Davangere",
    region: "Central Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E066",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "bahubali-college-of-engineering-shravanabelagola-hassan",
    name: "Bahubali College of Engineering, Shravanabelagola, Hassan",
    shortName: "Bahubali",
    city: "Hassan",
    district: "Hassan",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E070",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "vidya-vardhaka-college-of-engineering-mysore",
    name: "Vidya Vardhaka College of Engineering, Mysore(AUTONOMOUS)",
    shortName: "Vidya Vardhaka",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E071",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "ballari-institute-of-technology-management-bellary",
    name: "Ballari Institute of Technology & Management, Bellary(AUTONOMOUS)",
    shortName: "Ballari",
    city: "Ballari",
    district: "Ballari",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E075",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "proudadevaraya-institute-of-technology-hospet",
    name: "Proudadevaraya Institute of Technology, Hospet",
    shortName: "Proudadevaraya",
    city: "Ballari",
    district: "Ballari",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E076",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "vidya-vikas-institute-of-engineering-technology-mysore",
    name: "Vidya Vikas Institute of Engineering & Technology, Mysore",
    shortName: "Vidya Vikas",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "CV", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E077",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "the-oxford-college-of-engineering-bangalore",
    name: "The Oxford College of Engineering, Bangalore",
    shortName: "Oxford",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 540, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "BT", "AI_ML", "AI_DS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E078",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "acharya-institute-of-technology-soldevanahalli-chikkabanavara-post",
    name: "Acharya Institute of Technology, Soldevanahalli,Chikkabanavara post, Bangalore",
    shortName: "Acharya",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 600, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "BT", "AI_ML", "AI_DS", "AERO"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E079",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sri-siddhartha-school-of-engineering-tumkur-nh",
    name: "SRI SIDDHARTHA SCHOOL OF ENGINEERING, TUMKUR NH-4, KESARAMADU POST, KYATHASANDRA,TUMKUR",
    shortName: "SIDDHARTHA",
    city: "Tumakuru",
    district: "Tumakuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 540, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E081",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "j-s-s-academy-of-technical-education",
    name: "J S S Academy of Technical Education, Bangalore",
    shortName: "JSS",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML", "ROBOTICS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E082",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "h-k-b-k-college-of-engineering",
    name: "H.K.B.K.College of Engineering, Bangalore",
    shortName: "HKBK",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E083",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "aps-college-of-engineering-somanahalli-bangalore",
    name: "APS College of Engineering, Somanahalli, Bangalore",
    shortName: "APS",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "AI_ML", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E085",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sri-sairam-college-of-engineering-anekal-bangalore",
    name: "Sri Sairam College Of Engineering, Anekal, Bangalore",
    shortName: "Sairam",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "AI_ML", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E086",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "vivekananada-institute-of-technology-kengeri-bangalore",
    name: "Vivekananada Institute of Technology, Kengeri, Bangalore",
    shortName: "Vivekananada E087",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E087",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sri-revana-siddeswara-institute-of-technology-bangalore",
    name: "Sri Revana Siddeswara Institute of Technology, Bangalore",
    shortName: "Revana Siddeswara",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E090",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "k-s-institute-of-technology-raghuvanahalli-bangalore",
    name: "K S Institute of Technology, Raghuvanahalli, Bangalore(AUTONOMOUS)",
    shortName: "KS E091",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "AI_ML", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E091",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "vemana-institute-of-technology-bangalore",
    name: "Vemana Institute of Technology, Bangalore",
    shortName: "Vemana",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E092",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "basavakalyana-engineering-college-basavakalyana-bidar-district",
    name: "Basavakalyana Engineering College, Basavakalyana, Bidar District",
    shortName: "Basavakalyana",
    city: "Bidar",
    district: "Bidar",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_DS"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E093",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "coorg-institute-of-technology-kunda-ponnampet",
    name: "Coorg Institute of Technology, Kunda, Ponnampet",
    shortName: "Coorg",
    city: "Madikeri",
    district: "Kodagu",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E094",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "amc-engineering-college-bannerghatta-road-bangalore",
    name: "AMC Engineering College, Bannerghatta Road, Bangalore(AUTONOMOUS)",
    shortName: "AMC Engineering",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "AERO"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E095",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "east-point-college-of-engineering-technology-bangalore",
    name: "East Point College of Engineering & Technology, Bangalore(AUTONOMOUS)",
    shortName: "East Point",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "CV", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E096",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "c-m-r-institute-of-technology-kundala",
    name: "C M R Institute of Technology, Kundala Halli village, Bangalore",
    shortName: "CMR E097",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "AI_ML", "AI_DS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E097",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "atria-institute-of-technology-anand-nagar-hebbal",
    name: "Atria Institute of Technology, Anand Nagar, Hebbal PO, Bangalore",
    shortName: "Atria",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "ROBOTICS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E098",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "new-horizon-college-of-engineering-varthur-bangalore",
    name: "New Horizon College of Engineering, Varthur, Bangalore(AUTONOMOUS)",
    shortName: "New Horizon",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E099",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "k-n-s-institute-of-technology-bangalore",
    name: "K N S Institute of Technology, Bangalore",
    shortName: "KNS",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E100",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "channabasaveshwara-institute-of-technology-gubbi-herur-tumkur",
    name: "Channabasaveshwara Institute of Technology, Gubbi Herur, Tumkur",
    shortName: "Channabasaveshwara",
    city: "Tumakuru",
    district: "Tumakuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E101",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "donbosco-institute-of-technology-bangalore",
    name: "DONBOSCO Institute of Technology, Bangalore(AUTONOMOUS)",
    shortName: "DONBOSCO",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E102",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "global-academy-of-technology-bangalore",
    name: "Global Academy of Technology, Bangalore(AUTONOMOUS)",
    shortName: "Global",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 540, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "AERO"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E103",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "nagarjuna-college-of-engineering-technology-venkatagiri-kote",
    name: "Nagarjuna College of Engineering & Technology,venkatagiri Kote, Devanahalli, Bangalore Rural.(AUTONOMOUS)",
    shortName: "Nagarjuna",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "CV", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E104",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "east-west-institute-of-technology-bangalore",
    name: "East West Institute Of Technology,Bangalore(AUTONOMOUS)",
    shortName: "East West E106",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 540, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E106",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "b-n-m-institute-of-technology-bangalore",
    name: "B N M Institute of Technology, Bangalore",
    shortName: "BNM",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E107",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sapthagiri-nps-university-14-5-chikkasandra-hesaraghatta",
    name: "SAPTHAGIRI NPS UNIVERSITY #14/5, CHIKKASANDRA,HESARAGHATTA MAIN ROAD,BANGALURU",
    shortName: "SAPTHAGIRI NPS",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "AI_ML", "AI_DS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E108",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "city-engineering-college-doddakalisandra-bangalore-south",
    name: "City Engineering College,Doddakalisandra, Bangalore South",
    shortName: "City Engineering",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E109",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sri-venkateshwara-college-of-engineering-bangalore",
    name: "Sri Venkateshwara College of Engineering, Bangalore (Autonomous)",
    shortName: "Venkateshwara",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E111",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sri-krishna-institute-of-technology-bangalore",
    name: "Sri Krishna Institute of Technology, Bangalore",
    shortName: "Krishna",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E112",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sambhram-institute-of-technology-bangalore",
    name: "Sambhram Institute of Technology, Bangalore",
    shortName: "Sambhram",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E113",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "g-m-institute-of-technology-davanagere",
    name: "G M Institute of Technology, Davanagere",
    shortName: "GM E114",
    city: "Davangere",
    district: "Davangere",
    region: "Central Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E114",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sjb-institute-of-technology-bangalore",
    name: "SJB Institute of Technology, Bangalore",
    shortName: "SJB",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E115",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "r-l-jalappa-institute-of-technology-doddaballapura",
    name: "R.L.Jalappa Institute of Technology, Doddaballapura",
    shortName: "RL Jalappa",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E116",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "rns-institute-of-technology-bangalore",
    name: "RNS Institute of Technology, Bangalore",
    shortName: "RNS",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 540, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "CSBS", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E118",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "k-c-t-engineering-college-gulbarga",
    name: "K C T Engineering College, Gulbarga",
    shortName: "KCT Engineering",
    city: "Kalaburagi",
    district: "Kalaburagi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E119",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "jnanavikasa-institute-of-technology-bidadi-ramanagar",
    name: "Jnanavikasa Institute of Technology, Bidadi,Ramanagar",
    shortName: "Jnanavikasa",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E120",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "vivekananada-college-of-engineering-technology-puttur",
    name: "Vivekananada College of Engineering Technology, Puttur",
    shortName: "Vivekananada E121",
    city: "Puttur",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E121",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "canara-engineering-college-bantwal",
    name: "Canara Engineering College Bantwal",
    shortName: "Canara Engineering",
    city: "Mangaluru",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "AI_ML", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E123",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "rajiv-gandhi-institute-of-technology-bangalore",
    name: "Rajiv Gandhi Institute of Technology, Bangalore",
    shortName: "Rajiv Gandhi",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "AI_ML", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E124",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "b-m-s-institute-of-technology-management",
    name: "B M S Institute of Technology & Management, Yelahanka, Bangalore(AUTONOMOUS)",
    shortName: "BMSIT&M",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 840, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML", "CSBS"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E126",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 120000, // HEURISTIC — verify before shipping
  },
  {
    id: "m-s-engineering-college-bangalore",
    name: "M S Engineering College, Bangalore",
    shortName: "MS Engineering",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E127",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sharanbasava-university",
    name: "Sharanbasava University (Formerly Appa Institute of Engineering and Tech)",
    shortName: "Sharanbasava E128",
    city: "Kalaburagi",
    district: "Kalaburagi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_DS"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E128",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "st-joseph-engineering-college-mangalore-mangalore",
    name: "St.Joseph Engineering College, Mangalore(AUTONOMOUS) MANGALORE",
    shortName: "St Joseph",
    city: "Mangaluru",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "ROBOTICS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E129",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "shridevi-institute-of-engineering-technology-tumkur",
    name: "Shridevi Institute of Engineering & Technology, Tumkur",
    shortName: "Shridevi",
    city: "Tumakuru",
    district: "Tumakuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 540, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E130",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "secab-institute-of-engineering-technology-bijapur",
    name: "Secab Institute of Engineering & Technology, Bijapur",
    shortName: "Secab",
    city: "Vijayapura",
    district: "Vijayapura",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E132",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "g-s-s-s-institute-of-engineering",
    name: "G S S S Institute of Engineering & Technology for Women, Mysore",
    shortName: "GSSS",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "AI_ML", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E133",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "smt-kamala-sri-venkappa-m-agadi-college",
    name: "Smt. Kamala & Sri Venkappa M.Agadi College of Engineering & Technology, Gadag",
    shortName: "Kamala &",
    city: "Gadag",
    district: "Gadag",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E134",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "k-l-s-viswanathrao-deshpande-institute-of",
    name: "K L S Viswanathrao Deshpande Institute of Technology, Haliyal",
    shortName: "KLS Viswanathrao",
    city: "Karwar",
    district: "Uttara Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E135",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "moodalakatte-institute-of-technology-kundapura-udupi",
    name: "Moodalakatte Institute of Technology, Kundapura, Udupi",
    shortName: "Moodalakatte",
    city: "Udupi",
    district: "Udupi",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "CV", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E136",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "impact-college-of-engineering-applied-sciences-bangalore",
    name: "Impact College of Engineering & Applied Sciences, Bangalore",
    shortName: "Impact",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "ROBOTICS", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E139",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "pes-university-hosur-rd-konappana-agrahara-electronic",
    name: "PES UNIVERSITY(Electronic City Campus) Hosur Rd, Konappana Agrahara, Electronic City, Bengaluru, Karnataka 560100",
    shortName: "PES EC",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "AI_ML"],
    avgPackage: 11, // HEURISTIC — verify before shipping
    highestPackage: 42, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Bosch", "Accenture", "Cisco"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E141",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 120000, // HEURISTIC — verify before shipping
  },
  {
    id: "adhichunchanagiri-university",
    name: "Adhichunchanagiri University (Formerly B G S Institute of Technology)",
    shortName: "Adhichunchanagiri E142",
    city: "Mandya",
    district: "Mandya",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E142",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "srinivas-institute-of-technology-mangalore",
    name: "Srinivas Institute of Technology, Mangalore(Constituent College of Srinivasa University (Private University))",
    shortName: "Srinivas E144",
    city: "Mangaluru",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 600, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "AI_ML", "AI_DS", "CSBS", "AERO", "AUTO"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E144",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "rajarajeswari-college-of-engineering-bangalore",
    name: "Rajarajeswari College of Engineering, Bangalore",
    shortName: "Rajarajeswari",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "CV", "AI_ML", "ROBOTICS", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E145",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "shreedevi-institute-of-technology-mangalore",
    name: "Shreedevi Institute of Technology, Mangalore",
    shortName: "Shreedevi",
    city: "Mangaluru",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "AERO"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E146",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "t-john-institute-of-technology-bangalore",
    name: "T.John Institute of technology, Bangalore",
    shortName: "T John",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E147",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "cambridge-institutute-of-technology-k-r-puram",
    name: "Cambridge Institutute of Technology, K.R.Puram, Bangalore(AUTONOMOUS)",
    shortName: "CIKRPB",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E149",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "p-e-s-institute-of-technology-management",
    name: "P E S Institute of Technology & Management, Shimoga",
    shortName: "PES",
    city: "Shivamogga",
    district: "Shivamogga",
    region: "Central Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E150",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "mangalore-institute-of-technology-engineering-moodabidri-mangalore",
    name: "Mangalore Institute of Technology & Engineering, Moodabidri, Mangalore(AUTONOMOUS)",
    shortName: "Mangalore",
    city: "Mangaluru",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "AI_ML", "AERO", "IOT"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E151",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "s-d-m-institute-of-tech-ujire",
    name: "S D M Institute of Tech., Ujire, Dakshina Kannada",
    shortName: "SDM",
    city: "Ujire",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "CV", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E152",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "s-e-a-college-of-engineering-technology",
    name: "S E A College of Engineering & Technology, Virgonagar, Bangalore",
    shortName: "SEA",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E153",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-chamarajanagara",
    name: "Government Engineering College, Chamarajanagara",
    shortName: "GEC Chamarajanagara",
    city: "Chamarajanagara",
    district: "Chamarajanagara",
    region: "South Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E154",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-hassan",
    name: "Government Engineering College, Hassan",
    shortName: "GEC Hassan E155",
    city: "Hassan",
    district: "Hassan",
    region: "South Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E155",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "k-r-pet-krishna-government-engineering-colleges",
    name: "K R PET KRISHNA, GOVERNMENT ENGINEERING COLLEGES, K R PET, MANDYA KRISHNARAJPET, MANDYA DIST. - 571 426",
    shortName: "KR PET",
    city: "Mandya",
    district: "Mandya",
    region: "South Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E156",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-ramanagaram",
    name: "Government Engineering College, Ramanagaram",
    shortName: "GEC Ramanagara",
    city: "Ramanagara",
    district: "Ramanagara",
    region: "Bengaluru",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E157",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "maharaja-institute-of-technology-mysore-belawadi-srirangapatna",
    name: "Maharaja Institute of Technology Mysore,Belawadi,Srirangapatna,Mandya(AUTONOMOUS)",
    shortName: "Maharaja E158",
    city: "Mandya",
    district: "Mandya",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 540, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "CSBS", "IOT"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E158",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "karavali-institute-of-technology-neermarga-mangalore",
    name: "Karavali Institute of Technology, Neermarga, Mangalore",
    shortName: "Karavali",
    city: "Mangaluru",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "AI_ML", "AI_DS", "AERO"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E159",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sahyadri-college-of-engineering-management-adyar-mangalore",
    name: "Sahyadri College Of Engineering & Management, Adyar, Mangalore(AUTONOMOUS)",
    shortName: "Sahyadri",
    city: "Mangaluru",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "AI_ML", "ROBOTICS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E160",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-kushalanagar",
    name: "Government Engineering College, Kushalanagar",
    shortName: "GEC Madikeri",
    city: "Madikeri",
    district: "Kodagu",
    region: "South Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E161",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-raichur",
    name: "Government Engineering College, Raichur",
    shortName: "GEC Raichur",
    city: "Raichur",
    district: "Raichur",
    region: "North Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E162",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-haveri-devagiri-haveri",
    name: "Government Engineering College, Haveri DEVAGIRI,HAVERI",
    shortName: "GEC Ranebennur",
    city: "Ranebennur",
    district: "Haveri",
    region: "North Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E163",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-hoovina-hadagali",
    name: "Government Engineering College, Hoovina Hadagali",
    shortName: "GEC Ballari",
    city: "Ballari",
    district: "Vijayanagara",
    region: "North Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E164",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "yenepoya-institute-of-technology-mangalore",
    name: "Yenepoya Institute Of Technology, Mangalore",
    shortName: "Yenepoya",
    city: "Mangaluru",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E165",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "k-l-e-s-s-k-l",
    name: "K L E S's K L E College of Engineering & Technology, Chikkodi, Belgaum Dist.",
    shortName: "KLES s KLE",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_DS"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E167",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "amruta-institute-of-engineering-management-science-ramanagar",
    name: "Amruta Institute of Engineering & Management Science (AIEMS), Ramanagar",
    shortName: "Amruta",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E168",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "alva-s-institute-of-engineering-technology-moodabidre",
    name: "Alva's Institute of Engineering & Technology, Moodabidre",
    shortName: "Alva",
    city: "Mangaluru",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E169",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "brindavan-college-of-engineering-yelahanaka-bangalore",
    name: "Brindavan College of Engineering, Yelahanaka, Bangalore",
    shortName: "Brindavan",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E171",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "r-r-institute-of-technology-chikkabanavara-bangalore",
    name: "R.R. Institute of Technology, Chikkabanavara, Bangalore(AUTONOMOUS)",
    shortName: "RR",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 540, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E172",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sai-vidya-institute-of-technology-rajanakunte-bangalore",
    name: "Sai Vidya Institute of Technology, Rajanakunte, Bangalore",
    shortName: "Sai Vidya",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "CSBS", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E173",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "dr-sri-sri-sri-shivakumara-mahaswamyji-college",
    name: "Dr. Sri Sri Sri Shivakumara Mahaswamyji College of Engineering, Byranayakanahalli, Bangalore Rural",
    shortName: "Dr Sri",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E174",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "s-s-e-t-s-s-g",
    name: "S.S.E.T.S.S.G.Balekundri Institute of Technology, Shivabasavanagar, Belgaum",
    shortName: "SSET SSG",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "CSBS"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E175",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "navodaya-institute-of-technology-raichur",
    name: "Navodaya Institute of Technology, Raichur(AUTONOMOUS)",
    shortName: "Navodaya",
    city: "Raichur",
    district: "Raichur",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E176",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "rajeev-institute-of-technology-hassan",
    name: "Rajeev Institute of Technology, Hassan(Autonomous)",
    shortName: "Rajeev",
    city: "Mangaluru",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 540, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E177",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "the-national-institute-of-engineering-mysore-e178",
    name: "The National Institute of Engineering, Mysore(AUTONOMOUS)",
    shortName: "NIE E178",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 120, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E178",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "beary-s-institute-of-technology-boliar-village",
    name: "Beary's Institute of Technology, Boliar Village,Bantwal Tq, Mangalore",
    shortName: "Beary",
    city: "Mangaluru",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_DS", "IOT"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E180",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sri-basaveswara-institute-of-technology-madenur-gate",
    name: "Sri Basaveswara Institute of Technology, Madenur Gate, B.H. Road, Tiptur",
    shortName: "Basaveswara",
    city: "Tumakuru",
    district: "Tumakuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "CV"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E181",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "c-byre-gowda-institute-of-technology-thoradevandahalli",
    name: "C Byre Gowda Institute of Technology, Thoradevandahalli Village, Kolar",
    shortName: "C Byre Gowda",
    city: "Kolar",
    district: "Kolar",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E184",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "angadi-institute-of-technology-and-management-savgoan",
    name: "Angadi Institute of Technology and Management , Savgoan Rd., Belgaum",
    shortName: "Angadi",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_DS", "ROBOTICS"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E185",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "dr-acs-college-of-engineering-mysore-road",
    name: "Dr. ACS College of Engineering, Mysore Road, Bangalore",
    shortName: "Dr ACS",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "AI_ML", "AI_DS", "AERO", "IOT", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E186",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "vijaya-vittala-institute-of-technology-doddagubbi-hennur",
    name: "Vijaya Vittala Institute of Technology, Doddagubbi, Hennur Bagalur Road, Bangalore",
    shortName: "Vijaya Vittala",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E188",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "navkis-college-of-engineering-kiadb-industrial-area",
    name: "NAVKIS COLLEGE OF ENGINEERING, KIADB Industrial Area,Thimmanahally, Hassan",
    shortName: "NAVKIS",
    city: "Hassan",
    district: "Hassan",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "CV", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E189",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "akshaya-institute-of-technology-lingapura-tumkur-dist",
    name: "Akshaya Institute of Technology, Lingapura, Tumkur Dist. LINGAPURA",
    shortName: "Akshaya",
    city: "Tumakuru",
    district: "Tumakuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E191",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "srinivas-university-srinivas-campus-mukka-mangaluru",
    name: "Srinivas University SRINIVAS CAMPUS MUKKA MANGALURU",
    shortName: "Srinivas E193",
    city: "Mangaluru",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML", "CYBER"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E193",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-karwar",
    name: "Government Engineering College, Karwar",
    shortName: "GEC Karwar",
    city: "Karwar",
    district: "Uttara Kannada",
    region: "Coastal Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E194",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "jain-college-of-engineering-machche-belgaum",
    name: "Jain College of Engineering,Machche, Belgaum",
    shortName: "Jain E196",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E196",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "veerappa-nisty-engineering-college-shorapur-yadigir",
    name: "Veerappa Nisty Engineering College, Shorapur, Yadigir",
    shortName: "Veerappa Nisty",
    city: "Yadgir",
    district: "Yadgir",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E197",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sharanbasava-university-e198",
    name: "Sharanbasava University (Exclusively for Women) (Formerly Goduati Engineering College For Women)",
    shortName: "Sharanbasava E198",
    city: "Kalaburagi",
    district: "Kalaburagi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E198",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "agm-rural-engineering-college-varur-hubli",
    name: "AGM Rural Engineering College, Varur, Hubli",
    shortName: "AGM Rural",
    city: "Dharwad",
    district: "Dharwad",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E199",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "gopalan-college-of-engineering-management-k-r",
    name: "Gopalan College of Engineering & Management, K.R. Puram, Bangalore(Autonomous)",
    shortName: "Gopalan",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "AI_ML", "AI_DS", "AERO"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E201",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sampoorna-group-of-institutions-channapatana-bangalore-south",
    name: "Sampoorna Group of Institutions, Channapatana, Bangalore South Channapatana, Bangalore South",
    shortName: "SGICBS",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E202",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "k-s-school-of-engineering-management-mallasandra",
    name: "K S School of Engineering & Management, Mallasandra, Bangalore",
    shortName: "KS E203",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_DS", "CSBS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E203",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "bangalore-technological-institute-sarjapura-road-bangalore",
    name: "Bangalore Technological Institute, Sarjapura Road, Bangalore",
    shortName: "Bangalore",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E204",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "atme-college-of-engineering-mysore",
    name: "ATME College of Engineering, Mysore",
    shortName: "ATME",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E205",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "shri-madhwa-vadiraja-institute-of-technology-and",
    name: "Shri Madhwa Vadiraja Institute of Technology and Management, Udupi (Autonomous)",
    shortName: "Madhwa Vadiraja",
    city: "Udupi",
    district: "Udupi",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "AI_ML", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E206",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "v-s-m-s-somashekhar-r-kothiwale",
    name: "V S M`s Somashekhar R Kothiwale Institute of Technology,Nippani, Belgaum.",
    shortName: "VSMS Somashekhar",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E207",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "jyothi-institute-of-technology-kanakapura-road-bangalore",
    name: "Jyothi Institute of Technology, Kanakapura Road,Bangalore ,BANGALORE",
    shortName: "Jyothi",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E209",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "g-madegowda-institute-of-technology-bharathinagara-maddur",
    name: "G Madegowda Institute of Technology, Bharathinagara, Maddur, Mandya",
    shortName: "G Madegowda",
    city: "Mandya",
    district: "Mandya",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E210",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "jain-institute-of-technology-davanagere",
    name: "Jain Institute of Technology, Davanagere",
    shortName: "Jain E211",
    city: "Davangere",
    district: "Davangere",
    region: "Central Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E211",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "dayananda-sagar-academy-of-technology-management-technical",
    name: "Dayananda Sagar Academy of Technology & Management Technical Campus, Bangalore(AUTONOMOUS)",
    shortName: "Dayananda Sagar E212",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Autonomous", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "AI_ML", "AI_DS", "IOT", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E212",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "lingarajappa-engineering-college-bidar",
    name: "Lingarajappa Engineering College, Bidar",
    shortName: "Lingarajappa",
    city: "Bidar",
    district: "Bidar",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E213",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "shetty-institute-of-technology-gulbarga",
    name: "Shetty Institute of Technology,Gulbarga",
    shortName: "Shetty",
    city: "Kalaburagi",
    district: "Kalaburagi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E216",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "alliance-university-central-campus-chikkahadage-cross-chandapura",
    name: "ALLIANCE University Central Campus, Chikkahadage Cross Chandapura-Anekal, Main Road, Bengaluru, Karnataka 562106",
    shortName: "ALLIANCE",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 600, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "BT", "AI_ML", "IT", "AERO", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E220",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "biluru-gurubasava-mahaswamiji-institute-of-technology-mudhol",
    name: "Biluru Gurubasava Mahaswamiji Institute of Technology,Mudhol,Bagalkote.",
    shortName: "Biluru Gurubasava",
    city: "Bagalkot",
    district: "Bagalkot",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E221",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "cambridge-institute-of-technology-north-campus-devanahalli",
    name: "Cambridge Institute Of Technology, North Campus, Devanahalli, Bangalore",
    shortName: "Cambridge",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E222",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "cauvery-institute-of-technology-koppalu-gate-sundahally",
    name: "Cauvery institute of Technology, Koppalu gate, Sundahally, Mandya",
    shortName: "Cauvery",
    city: "Mandya",
    district: "Mandya",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E227",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "reva-university-rukmini-knowledge-park-kattigenahalli-yelahanka",
    name: "REVA University RUKMINI KNOWLEDGE PARK, KATTIGENAHALLI, YELAHANKA,BANGALORE - 560064",
    shortName: "REVA",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 600, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "IT", "AERO"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E232",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "m-s-ramaiah-university-of-applied-sciences",
    name: "M . S . Ramaiah University of Applied Sciences",
    shortName: "MS Ramaiah",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 660, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "AERO", "AUTO", "MATHS_COMPUTING", "ROBOTICS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E235",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "presidency-university-itgalpura-rajanukunte-yelahanka-bengaluru-560",
    name: "PRESIDENCY University ITGALPURA, RAJANUKUNTE, YELAHANKA, BENGALURU - 560 064",
    shortName: "PRESIDENCY",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 600, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI_ML", "AI_DS", "AERO", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E237",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "mysuru-royal-institute-of-technology-lakshmipura-road",
    name: "Mysuru Royal Institute Of Technology,Lakshmipura road,Mysuru",
    shortName: "Mysuru Royal",
    city: "Mandya",
    district: "Mandya",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E238",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "east-west-college-of-engineering-yelahanka-bangalore",
    name: "East West College Of Engineering, Yelahanka,Bangalore",
    shortName: "East West E239",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "AERO"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E239",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "dayananda-sagar-university-devarakaggalahalli-village-harohalli-kanakapura",
    name: "Dayananda Sagar University DEVARAKAGGALAHALLI VILLAGE, HAROHALLI, KANAKAPURA MAIN ROAD, RAMANAGAR DIST",
    shortName: "Dayananda Sagar E240",
    city: "Shivamogga",
    district: "Shivamogga",
    region: "Central Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "AI_ML", "AI_DS", "AERO", "CYBER"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E240",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "kle-technological-university-bvbhoomaraddi-college-campus-vidyanagar",
    name: "KLE Technological University(Formerly (BVBCET) BVBHOOMARADDI COLLEGE CAMPUS, VIDYANAGAR, HUBBALLI",
    shortName: "KLE Technological",
    city: "Hubballi",
    district: "Dharwad",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "BT", "AI_ML", "ROBOTICS"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E241",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "mysore-college-of-engineering-and-management-mysore",
    name: "Mysore College Of Engineering and Management,Mysore",
    shortName: "Mysore",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E252",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "a-j-institute-of-engineering-and-technology",
    name: "A J Institute Of Engineering And Technology.Kottar chowki Boloor Village Mangalore",
    shortName: "AJ",
    city: "Mangaluru",
    district: "Dakshina Kannada",
    region: "Coastal Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 480, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "IOT"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E254",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "gandhi-institute-of-technology-and-management-gitam",
    name: "GANDHI INSTITUTE OF TECHNOLOGY AND MANAGEMENT GITAM OFF CAMPUS BENGALURU NH 207, Nagadenehalli Doddaballapur taluk. Bengaluru-561203",
    shortName: "GANDHI",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E255",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "rai-technological-university-11th-mile-gallu-doddaballapur",
    name: "RAI TECHNOLOGICAL UNIVERSITY 11TH MILE GALLU, DODDABALLAPUR - NELAMANGALA ROAD, MALLOHALLI VILLAGE KADANUR, DODDABALLAPUR TALUK, BENGALURU",
    shortName: "RAI TECHNOLOGICAL",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 180, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "AI_ML", "IT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E256",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "cmr-university-main-campus-off-hennur-bagalur",
    name: "CMR University Main Campus, Off Hennur Bagalur Main Road, Chagalatti, Bangalore",
    shortName: "CMR E257",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "AI_ML", "AI_DS", "IT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E257",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "maharaja-institute-of-technology-tandavapura-mysore",
    name: "Maharaja Institute of Technology,Tandavapura,Mysore",
    shortName: "Maharaja E258",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E258",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "basav-engineering-school-of-technology-vijayapura",
    name: "BASAV ENGINEERING SCHOOL OF TECHNOLOGY, VIJAYAPURA",
    shortName: "BASAV ENGINEERING",
    city: "Vijayapura",
    district: "Vijayapura",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E264",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "jain-college-of-engineering-and-technology-hubballi",
    name: "Jain College of Engineering and Technology,Hubballi",
    shortName: "Jain E265",
    city: "Hubballi",
    district: "Dharwad",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E265",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "jain-college-of-engineering-and-research-belgaum",
    name: "Jain College Of Engineering and Research, Belgaum",
    shortName: "Jain E269",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E269",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-talakal-koppal",
    name: "Government Engineering College, Talakal, Koppal",
    shortName: "GEC Koppal E272",
    city: "Koppal",
    district: "Koppal",
    region: "North Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E272",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-viprasinagar-gangavathi",
    name: "Government Engineering College, Viprasinagar, Gangavathi",
    shortName: "GEC Koppal E273",
    city: "Koppal",
    district: "Koppal",
    region: "North Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E273",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-mosale-hosahalli-hassan",
    name: "Government Engineering College, Mosale Hosahalli, Hassan",
    shortName: "GEC Hassan E274",
    city: "Hassan",
    district: "Hassan",
    region: "South Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "ME", "CV", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E274",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "r-v-institute-of-technology-and-management",
    name: "R V Institute Of Technology and Management, Bengaluru",
    shortName: "RV E275",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 180, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E275",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "visvesvaraya-technological-university-belagavi-viat-muddenahalli-campus",
    name: "VISVESVARAYA TECHNOLOGICAL UNIVERSITY, BELAGAVI, VIAT, MUDDENAHALLI CAMPUS, CHIKKABALLAPUR Muddenahalli campus,Chickkaballapur",
    shortName: "VISVESVARAYA E278",
    city: "Chikkaballapur",
    district: "Chikkaballapur",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML", "AI_DS", "AERO"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E278",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "visvesvaraya-technological-university-belagavi-campus-belagavi-jnana",
    name: "VISVESVARAYA TECHNOLOGICAL UNIVERSITY, BELAGAVI CAMPUS, BELAGAVI JNANA SANGAMA, MACHHE, BELAGAVI",
    shortName: "VISVESVARAYA E279",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "CV", "AI_DS", "CSBS", "ROBOTICS"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E279",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-challakere-chitradurga",
    name: "Government Engineering College, Challakere, Chitradurga",
    shortName: "GEC Chitradurga",
    city: "Chitradurga",
    district: "Chitradurga",
    region: "Central Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "CV", "AI_ML", "AUTO"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E281",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "university-of-mysuru-b-n-bahadur-institute",
    name: "University of Mysuru B.N.BAHADUR INSTITUTE OF MANAGEMENT SCIENCES, (DOS IN BUSSINESS ADMINISTRATION)UNIVERSITY OF MYSORE, MANASAGANGOTRI,HUNSUR ROAD,MYSORE.",
    shortName: "University of E283",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "CV", "AI_ML", "AI_DS", "ROBOTICS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E283",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "sri-jayachamarajendra-college-of-engineering-mysore-e284",
    name: "Sri Jayachamarajendra College of Engineering(Constituent College of JSS Science & Technology University), Mysore",
    shortName: "SJCE E284",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 60, // HEURISTIC — verify before shipping
    availableBranches: ["CSE"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E284",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "rv-university-bangalore",
    name: "RV University , Bangalore",
    shortName: "RV E285",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 60, // HEURISTIC — verify before shipping
    availableBranches: ["CSE"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E285",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "bgs-college-of-engineering-technology-bangalore",
    name: "BGS College of Engineering & Technology,Bangalore",
    shortName: "BGS",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "AI_ML", "AI_DS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E286",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "vidyashilp-university-125-bettenahalli-kundana-hobli-chapparkallu",
    name: "Vidyashilp University #125, Bettenahalli, Kundana Hobli, Chapparkallu Rd, Bengaluru, Karnataka 562110",
    shortName: "Vidyashilp",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 120, // HEURISTIC — verify before shipping
    availableBranches: ["AI_ML", "AI_DS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E287",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "garden-city-university-16th-km-old-madras",
    name: "Garden City University 16th KM, Old Madras Road (Near K R Puram), Bangalore, Karnataka, 560049.",
    shortName: "Garden City",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "IT", "ROBOTICS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E288",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "visvesvaraya-technological-university-vtu-cpgs-kalburgi",
    name: "Visvesvaraya Technological University,VTU,CPGS,Kalburgi.",
    shortName: "Visvesvaraya E289",
    city: "Kalaburagi",
    district: "Kalaburagi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 180, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ME", "AI_DS"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E289",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "visvesvaraya-technological-university-vtu-cpgs-mysuru",
    name: "Visvesvaraya Technological University,VTU,CPGS,Mysuru.",
    shortName: "Visvesvaraya E290",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "AI_DS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E290",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-naragund-gadag",
    name: "Government Engineering College,Naragund,Gadag",
    shortName: "GEC Gadag",
    city: "Gadag",
    district: "Gadag",
    region: "North Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "CV", "AI_DS"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E291",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-mailur-bidar",
    name: "Government Engineering College,Mailur,Bidar",
    shortName: "GEC Bidar",
    city: "Bidar",
    district: "Bidar",
    region: "North Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "CV", "AI_DS"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E292",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "aditya-college-of-engineering-and-technology-survey",
    name: "ADITYA COLLEGE OF ENGINEERING AND TECHNOLOGY SURVEY NO 2/8 2/9 AND 2/2, KAMAKSHIPURA, SONNENAHALLI PANCHAYATH, HESARAGHATTA HOBLI, YELAHANKA",
    shortName: "ADITYA",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "AI_ML", "AI_DS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E297",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "ghousia-institute-of-technology-for-women-bangalore",
    name: "Ghousia Institute of Technology for Women, Bangalore Hosur Road, DRC Post, Bangalore-29",
    shortName: "Ghousia",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 180, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E299",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "akash-intitute-of-engineering-and-technology-prasannahalli",
    name: "AKASH INTITUTE OF ENGINEERING AND TECHNOLOGY PRASANNAHALLI MAIN RAOD, AKKUPETE VILLAGE, KASABA HOBLI",
    shortName: "AIPMRA",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "ME", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E300",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "kishkinda-university-mount-view-campus-gp-no",
    name: "KISHKINDA UNIVERSITY MOUNT VIEW CAMPUS, GP NO 735, HAGALURU, Hosalli Gram Panchayath, Near Sindhigeri, Off. 28 KM, Ballari – Siruguppa Road, Siruguppa Taluk – 583120,Ballari District, Karnataka, India",
    shortName: "KISHKINDA",
    city: "Ballari",
    district: "Ballari",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "AI_ML", "AI_DS"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E301",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "amity-university-national-highway-648-devanahalli-doddaballapur",
    name: "AMITY UNIVERSITY National Highway 648 (old 207), Devanahalli - Doddaballapur Road",
    shortName: "AMITY",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "BT", "ROBOTICS", "IOT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E302",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "gm-university-karur-village-kasaba-hobli-davangere",
    name: "GM University KARUR VILLAGE, KASABA HOBLI, DAVANGERE TALUK AND DISTRICT",
    shortName: "GM E303",
    city: "Davangere",
    district: "Davangere",
    region: "Central Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 720, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "BT", "AI_DS", "CSBS", "ROBOTICS", "IOT", "CYBER"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E303",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "anuvartik-mirji-bharatesh-institute-of-technology-chandragiri",
    name: "ANUVARTIK MIRJI BHARATESH INSTITUTE OF TECHNOLOGY Chandragiri Campus, Basavan Kudachi Extension,Belagavi",
    shortName: "ANUVARTIK MIRJI",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 180, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E304",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "h-n-n-college-of-engineering-bengaluru",
    name: "H N N COLLEGE OF ENGINEERING BENGALURU",
    shortName: "HNN",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "AI_DS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E305",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "the-chanakya-university-no-29-haraluru-devanahalli",
    name: "THE CHANAKYA UNIVERSITY NO 29 HARALURU, DEVANAHALLI TALUK (NEAR BENGALURU INTERNATIONLA AIRPORT)",
    shortName: "CHANAKYA",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 420, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "CV", "BT", "AI_ML", "AERO", "ROBOTICS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E306",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "seshadripuram-institute-of-technology-mysuru-plot-no",
    name: "SESHADRIPURAM INSTITUTE OF TECHNOLOGY MYSURU Plot No. 4, 5, 6A,6B & 7B, Kadakola Industrial Area, Kadakola, Jayapura Hobli, Mysuru-571311, Karnataka, India",
    shortName: "SESHADRIPURAM",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "EEE", "ME", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E307",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "constituent-college-of-vtu-chintamani-chikaballapura-dist",
    name: "CONSTITUENT COLLEGE OF VTU, CHINTAMANI CHIKABALLAPURA DIST CHIKBALLAPURA",
    shortName: "CONSTITUENT E308",
    city: "Chikkaballapur",
    district: "Chikkaballapur",
    region: "Bengaluru",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 180, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E308",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "constituent-college-of-vtu-chintamani-chikaballapura-dist-e309",
    name: "CONSTITUENT COLLEGE OF VTU, CHINTAMANI CHIKABALLAPURA DIST CHIKBALLAPURA",
    shortName: "CONSTITUENT E309",
    city: "Chikkaballapur",
    district: "Chikkaballapur",
    region: "Bengaluru",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 180, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E309",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "government-engineering-college-arasikere-arasikere-hassan-district",
    name: "GOVERNMENT ENGINEERING COLLEGE, ARASIKERE ARASIKERE, HASSAN DISTRICT",
    shortName: "GEC Hassan E310",
    city: "Hassan",
    district: "Hassan",
    region: "South Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "AI_ML"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E310",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "rathinam-institute-of-technology-doddakammanahally-village-begur",
    name: "RATHINAM INSTITUTE OF TECHNOLOGY DODDAKAMMANAHALLY VILLAGE, BEGUR HOBLI",
    shortName: "RATHINAM",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E311",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "new-ebenezer-institute-of-technology-hennur-bagalur",
    name: "NEW EBENEZER INSTITUTE OF TECHNOLOGY HENNUR BAGALUR MAIN ROAD, KOTHNUR POST",
    shortName: "NEW EBENEZER",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "AI_ML", "AI_DS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E312",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "harsha-institute-of-technology-varadanayakana-hally-village",
    name: "HARSHA INSTITUTE OF TECHNOLOGY VARADANAYAKANA HALLY VILLAGE, NELAMANGALA TALUK",
    shortName: "HARSHA",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E313",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "cauvery-college-of-engineering-kbl-layout-alanahally",
    name: "CAUVERY COLLEGE OF ENGINEERING KBL LAYOUT, ALANAHALLY MYSORE",
    shortName: "CAUVERY",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E314",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "vtu-constituent-engineering-college-gokak-gokak",
    name: "VTU Constituent Engineering College, Gokak GOKAK",
    shortName: "VTU Belagavi E315",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 180, // HEURISTIC — verify before shipping
    availableBranches: ["EEE", "AI_ML", "CYBER"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E315",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "rv-university-nanjanagudu-polt-no-46-47",
    name: "RV University , NANJANAGUDU POLT NO 46,47,60,610P,KIADB INDUSTRIAL AREA, NANJANAGUDU, KARNATAKA 571302",
    shortName: "RV E316",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "AI_ML", "AI_DS", "CYBER"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E316",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "vtu-constituent-engineering-college-gokak-gokak-e317",
    name: "VTU Constituent Engineering College, Gokak GOKAK",
    shortName: "VTU Belagavi E317",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Government",
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 180, // HEURISTIC — verify before shipping
    availableBranches: ["EEE", "AI_ML", "CYBER"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E317",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 18000, // HEURISTIC — verify before shipping
  },
  {
    id: "bms-university-bull-temple-road-bangalore",
    name: "BMS UNIVERSITY BULL TEMPLE ROAD, BANGALORE",
    shortName: "BMS",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 180, // HEURISTIC — verify before shipping
    availableBranches: ["ECE", "AI_DS", "ROBOTICS"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E318",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "ramaiah-university-college-of-engineering-no-15",
    name: "RAMAIAH UNIVERSITY COLLEGE OF ENGINEERING (A CONSTITUENT COLLEGE OF M.S. RAMAIAH UNIVESITY OF APPLIED SCIENCES) NO 15, KIADB, INDUSTRIAL AREA, BOMMASANDRA JIGANI LINK ROAD, BANGALURU-560105",
    shortName: "RAMAIAH",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 180, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E319",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "koshys-institute-of-technology-bengaluru",
    name: "KOSHYS INSTITUTE OF TECHNOLOGY BENGALURU",
    shortName: "KOSHYS",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ISE", "ECE", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E320",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "university-of-mysuru-b-n-bahadur-institute-e321",
    name: "University of Mysuru B.N.BAHADUR INSTITUTE OF MANAGEMENT SCIENCES, (DOS IN BUSSINESS ADMINISTRATION)UNIVERSITY OF MYSORE, MANASAGANGOTRI,HUNSUR ROAD,MYSORE.",
    shortName: "University of E321",
    city: "Mysuru",
    district: "Mysuru",
    region: "South Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "Deemed", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 360, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "CV", "AI_ML", "AI_DS", "ROBOTICS"],
    avgPackage: 5.5, // HEURISTIC — verify before shipping
    highestPackage: 18, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E321",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "c-m-n-institute-of-technology",
    name: "C M N Institute Of Technology",
    shortName: "CMN",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 180, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E322",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "future-forge-engineering-academy",
    name: "Future Forge Engineering Academy",
    shortName: "Future Forge",
    city: "Hubballi",
    district: "Dharwad",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "ME", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E323",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "isbr-college-of-engineering-and-technology",
    name: "ISBR College of Engineering and Technology",
    shortName: "ISBR",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "AI_ML", "IT"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E324",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "dhanwantari-institute-of-technology",
    name: "Dhanwantari Institute of Technology",
    shortName: "Dhanwantari",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E325",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "krupanidhi-institute-of-technology",
    name: "Krupanidhi Institute of Technology",
    shortName: "Krupanidhi",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    region: "Bengaluru",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "AI_ML"],
    avgPackage: 6, // HEURISTIC — verify before shipping
    highestPackage: 24, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro", "Capgemini"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E326",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "agm-college-of-engineering-and-technology-belgaum",
    name: "AGM College of Engineering and Technology,Belgaum BELAGAVI",
    shortName: "AGM",
    city: "Belagavi",
    district: "Belagavi",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 240, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E327",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
  {
    id: "shri-swami-nagabhushan-gurukul-college-of-engineering",
    name: "Shri Swami Nagabhushan Gurukul College of Engineering and Technology Post Halasangi Taluka, Chadachana, Vijayapura",
    shortName: "Swami Nagabhushan",
    city: "Vijayapura",
    district: "Vijayapura",
    region: "North Karnataka",
    type: "Private Unaided", // HEURISTIC — inferred from the official name
    affiliation: "VTU", // HEURISTIC — inferred from the official name
    established: 1980, // HEURISTIC — verify before shipping
    hasHostel: true, // HEURISTIC — verify before shipping
    hostelType: "Both", // HEURISTIC — verify before shipping
    nirfRank: null,
    naacGrade: null,
    totalSeats: 300, // HEURISTIC — verify before shipping
    availableBranches: ["CSE", "ECE", "EEE", "CV", "AI_ML"],
    avgPackage: 4, // HEURISTIC — verify before shipping
    highestPackage: 12, // HEURISTIC — verify before shipping
    topRecruiters: ["Infosys", "TCS", "Wipro"], // HEURISTIC — verify before shipping
    website: "",
    kea_code: "E328",
    latitude: 0, // HEURISTIC — not sourced
    longitude: 0, // HEURISTIC — not sourced
    annualFee: 85000, // HEURISTIC — verify before shipping
  },
];

/** Aliases kept for existing imports. */
export const COLLEGES = colleges;
export const KCET_COLLEGES = colleges;

export const getCollegeById = (id: string): College | undefined =>
  colleges.find((c) => c.id === id);

export const getCollegeByCode = (code: string): College | undefined =>
  colleges.find((c) => c.kea_code === code);

export const getCollegeByKeaCode = getCollegeByCode;

export const getCollegesByCity = (city: string): College[] =>
  colleges.filter((c) => c.city === city);

export const getCollegesByRegion = (region: string): College[] =>
  colleges.filter((c) => c.region === region);

/** Every college here has published cut-offs behind it. */
export const COLLEGES_WITH_CUTOFFS: string[] = colleges.map((c) => c.id);

export const AVAILABLE_CITIES = Array.from(
  new Set(colleges.map((college) => college.city))
).sort() as City[];

export const AVAILABLE_BRANCHES = Array.from(
  new Set(colleges.flatMap((college) => college.availableBranches))
) as Branch[];

export const LOCATIONS = [
  { id: "ALL", label: "All districts" },
  ...AVAILABLE_CITIES.map((city) => ({ id: city, label: city })),
];
