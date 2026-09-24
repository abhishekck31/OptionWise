import { PDFParse } from "pdf-parse";

/** Extracts plain text from a PDF buffer, concatenating all pages. */
export async function extractPdfText(data: Buffer | Uint8Array): Promise<string> {
  const parser = new PDFParse({ data });
  try {
    // pageJoiner: "" — otherwise pdf-parse inserts a "-- page N of M --" marker line
    // between pages, which parseCutoffRows would otherwise trip over as a data line.
    const result = await parser.getText({ pageJoiner: "" });
    return result.text;
  } finally {
    await parser.destroy();
  }
}
