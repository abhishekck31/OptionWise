// @vitest-environment node
import { describe, expect, it } from "vitest";
import { extractPdfText } from "../extractPdfText";
import { buildFixturePdf } from "./testHelpers";

describe("extractPdfText", () => {
  it("extracts plain text from a real (small, generated) PDF fixture", async () => {
    const buffer = await buildFixturePdf([
      "# year: 2024 round: 1",
      "E001|Sample Engineering College|CS|Computer Science|GM|15000",
    ]);

    const text = await extractPdfText(buffer);

    expect(text).toContain("year: 2024 round: 1");
    expect(text).toContain("E001");
    expect(text).toContain("15000");
  });
});
