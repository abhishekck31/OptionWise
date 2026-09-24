// @vitest-environment node
import { describe, expect, it } from "vitest";
import { extractPdfText } from "../../ingestion/extractPdfText";
import { optionListToPdf, type ExportOptionEntry } from "../exportOptionList";

const entries: ExportOptionEntry[] = [
  { position: 1, collegeCode: "E001", collegeName: "First College", courseCode: "CS", courseName: "Computer Science", chance: "safe" },
  { position: 2, collegeCode: "E002", collegeName: "Second College", courseCode: "EC", courseName: "Electronics", chance: "reach" },
];

describe("optionListToPdf", () => {
  it("produces a real PDF with college/course codes in list order", async () => {
    const buffer = await optionListToPdf(entries);
    expect(buffer.subarray(0, 4).toString("latin1")).toBe("%PDF");

    const text = await extractPdfText(buffer);
    expect(text).toContain("OptionWise");
    expect(text).toContain("not affiliated with KEA");

    const indexE001 = text.indexOf("E001");
    const indexE002 = text.indexOf("E002");
    expect(indexE001).toBeGreaterThanOrEqual(0);
    expect(indexE002).toBeGreaterThan(indexE001);
  });

  it("still produces a valid PDF for an empty list", async () => {
    const buffer = await optionListToPdf([]);
    const text = await extractPdfText(buffer);
    expect(text).toContain("No options in this list yet");
  });
});
