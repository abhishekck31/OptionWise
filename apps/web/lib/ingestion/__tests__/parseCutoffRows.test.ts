import { describe, expect, it } from "vitest";
import { parseCutoffRows } from "../parseCutoffRows";

const FIXTURE = `
# year: 2024 round: 1
E001|Sample Engineering College|CS|Computer Science|GM|15000
E001|Sample Engineering College|CS|Computer Science|1G|18000

# year: 2024 round: 2
E001|Sample Engineering College|CS|Computer Science|GM|16500

this line has no header context yet? actually it does now, but is malformed
E002|Sample College Two|EC|Electronics|ZZ|9000
E002|Sample College Two|EC|Electronics|GM|not-a-number
E002||EC|Electronics|GM|9500
`;

describe("parseCutoffRows", () => {
  it("parses well-formed rows under their nearest year/round header", () => {
    const { rows, report } = parseCutoffRows(FIXTURE, "fixture.pdf");

    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual({
      collegeCode: "E001",
      collegeName: "Sample Engineering College",
      courseCode: "CS",
      courseName: "Computer Science",
      categoryCode: "GM",
      closingRank: 15000,
      year: 2024,
      round: 1,
    });
    expect(rows[2].round).toBe(2);
    expect(report.parsedRows).toBe(3);
  });

  it("rejects malformed field counts, unknown category codes, bad ranks, and empty fields", () => {
    const { report } = parseCutoffRows(FIXTURE, "fixture.pdf");

    expect(report.rejectedRows).toHaveLength(4);
    expect(report.rejectedRows.map((r) => r.reason)).toEqual([
      expect.stringContaining("expected 6 fields"),
      expect.stringContaining("unknown category code 'ZZ'"),
      expect.stringContaining("closing rank must be a positive integer"),
      expect.stringContaining("must not be empty"),
    ]);
    expect(report.unknownCategoryCodes).toEqual(["ZZ"]);
  });

  it("rejects data lines that appear before any header", () => {
    const { report } = parseCutoffRows("E001|Name|CS|Course|GM|1000", "fixture.pdf");
    expect(report.rejectedRows).toHaveLength(1);
    expect(report.rejectedRows[0].reason).toContain("no '# year: N round: N' header");
  });

  it("reports zero rows for empty input", () => {
    const { rows, report } = parseCutoffRows("", "empty.pdf");
    expect(rows).toHaveLength(0);
    expect(report.totalDataLines).toBe(0);
  });
});
