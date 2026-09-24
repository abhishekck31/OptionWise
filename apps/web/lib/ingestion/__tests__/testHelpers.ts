import PDFDocument from "pdfkit";

/** Renders one line of text per page-row into a real PDF, for ingestion fixtures. */
export function buildFixturePdf(lines: string[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // A generously wide custom page avoids pdfkit wrapping a long row onto a second
    // line, which would otherwise split one logical "|"-delimited row into two.
    const doc = new PDFDocument({ size: [2000, 100 + lines.length * 20], margin: 20 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    for (const line of lines) {
      doc.text(line);
    }
    doc.end();
  });
}
