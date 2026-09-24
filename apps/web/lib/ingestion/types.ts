export interface RawCutoffRow {
  collegeCode: string;
  collegeName: string;
  courseCode: string;
  courseName: string;
  categoryCode: string;
  closingRank: number;
  year: number;
  round: number;
}

export interface RejectedRow {
  line: string;
  reason: string;
}

export interface ValidationReport {
  source: string;
  totalDataLines: number;
  parsedRows: number;
  rejectedRows: RejectedRow[];
  unknownCategoryCodes: string[];
}

export interface IngestionReport {
  usedSampleDataset: boolean;
  files: ValidationReport[];
  totalCutoffRowsWritten: number;
}
