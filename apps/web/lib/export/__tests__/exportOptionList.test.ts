import { describe, expect, it } from "vitest";
import { optionListToCsv, type ExportOptionEntry } from "../exportOptionList";

const entries: ExportOptionEntry[] = [
  { position: 1, collegeCode: "E001", collegeName: "First College", courseCode: "CS", courseName: "Computer Science", chance: "safe" },
  { position: 2, collegeCode: "E002", collegeName: "Second, College", courseCode: "EC", courseName: 'Electronics "EC"', chance: "reach" },
];

describe("optionListToCsv", () => {
  it("includes a header row and one row per entry, codes in order", () => {
    const csv = optionListToCsv(entries);
    const lines = csv.trim().split("\r\n");
    expect(lines[0]).toBe("Position,College Code,College Name,Course Code,Course Name,Chance");
    expect(lines[1]).toBe("1,E001,First College,CS,Computer Science,safe");
  });

  it("escapes fields containing commas or quotes", () => {
    const csv = optionListToCsv(entries);
    const lines = csv.trim().split("\r\n");
    expect(lines[2]).toBe('2,E002,"Second, College",EC,"Electronics ""EC""",reach');
  });

  it("produces just the header for an empty list", () => {
    const csv = optionListToCsv([]);
    expect(csv).toBe("Position,College Code,College Name,Course Code,Course Name,Chance\r\n");
  });

  it("preserves list order in the output row order", () => {
    const csv = optionListToCsv(entries);
    const collegeCodesInOrder = csv
      .trim()
      .split("\r\n")
      .slice(1)
      .map((line) => line.split(",")[1]);
    expect(collegeCodesInOrder).toEqual(["E001", "E002"]);
  });
});
