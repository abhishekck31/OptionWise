// A small, obviously-fake dataset used only when data/raw/ has no real KEA PDFs to
// ingest. Every college/course name says "(sample, not real)" and every row is
// tagged isSample:true / source:"generated sample dataset (no data/raw PDFs
// present)" — see SPEC.md's "Data honesty" rule.

export const SAMPLE_SOURCE = "generated sample dataset (no data/raw PDFs present)";

export interface SampleCollege {
  code: string;
  name: string;
  city: string;
}

export interface SampleCourse {
  code: string;
  name: string;
}

export interface SampleCollegeCourse {
  collegeCode: string;
  courseCode: string;
  feesInr: number;
  intake: number;
}

export interface SampleCutoff {
  collegeCode: string;
  courseCode: string;
  categoryCode: string;
  closingRank: number;
  year: number;
  round: number;
}

export const SAMPLE_COLLEGES: SampleCollege[] = [
  { code: "S001", name: "Sample Institute of Technology (sample, not real)", city: "Sampletown" },
  { code: "S002", name: "Sample College of Engineering (sample, not real)", city: "Sampletown" },
];

export const SAMPLE_COURSES: SampleCourse[] = [
  { code: "CS", name: "Computer Science (sample)" },
  { code: "EC", name: "Electronics & Communication (sample)" },
];

export const SAMPLE_COLLEGE_COURSES: SampleCollegeCourse[] = [
  { collegeCode: "S001", courseCode: "CS", feesInr: 100000, intake: 60 },
  { collegeCode: "S001", courseCode: "EC", feesInr: 90000, intake: 60 },
  { collegeCode: "S002", courseCode: "CS", feesInr: 80000, intake: 60 },
];

const SAMPLE_CATEGORIES = ["GM", "1G"];
const SAMPLE_ROUNDS = [1, 2];
const SAMPLE_YEAR = 2024;

function buildSampleCutoffs(): SampleCutoff[] {
  const cutoffs: SampleCutoff[] = [];
  let baseRank = 10000;
  for (const collegeCourse of SAMPLE_COLLEGE_COURSES) {
    for (const round of SAMPLE_ROUNDS) {
      for (const categoryCode of SAMPLE_CATEGORIES) {
        cutoffs.push({
          collegeCode: collegeCourse.collegeCode,
          courseCode: collegeCourse.courseCode,
          categoryCode,
          closingRank: baseRank,
          year: SAMPLE_YEAR,
          round,
        });
        baseRank += 1000;
      }
    }
  }
  return cutoffs;
}

export const SAMPLE_CUTOFFS: SampleCutoff[] = buildSampleCutoffs();
