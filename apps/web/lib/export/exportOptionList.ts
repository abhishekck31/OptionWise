import PDFDocument from "pdfkit";
import type { Chance } from "../predictors/collegePredictor";

export interface ExportOptionEntry {
  /** 1-based position — this is the order KEA will consider the options in. */
  position: number;
  collegeCode: string;
  collegeName: string;
  courseCode: string;
  courseName: string;
  chance?: Chance;
}

function csvEscape(field: string): string {
  if (/[",\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

const CSV_HEADER = ["Position", "College Code", "College Name", "Course Code", "Course Name", "Chance"];

/** CSV of the option list, college code + course code in order (SPEC.md's export
 * requirement), with names and chance included for readability. */
export function optionListToCsv(entries: ExportOptionEntry[]): string {
  const rows = entries.map((entry) =>
    [
      String(entry.position),
      entry.collegeCode,
      entry.collegeName,
      entry.courseCode,
      entry.courseName,
      entry.chance ?? "",
    ]
      .map(csvEscape)
      .join(","),
  );
  return [CSV_HEADER.join(","), ...rows].join("\r\n") + "\r\n";
}

const CHANCE_LABEL: Record<Chance, string> = { safe: "Safe", target: "Target", reach: "Reach" };

/** Printable PDF of the option list, college code + course code in order (SPEC.md's
 * export requirement) — one row per option, in preference/allotment-priority order. */
export function optionListToPdf(entries: ExportOptionEntry[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(18).text("OptionWise — My Option List", { align: "left" });
    doc
      .fontSize(9)
      .fillColor("#555555")
      .text(`Generated ${new Date().toISOString().slice(0, 10)} — not affiliated with KEA.`);
    doc.moveDown();
    doc.fillColor("#000000");

    if (entries.length === 0) {
      doc.fontSize(11).text("No options in this list yet.");
    } else {
      doc.fontSize(11);
      for (const entry of entries) {
        const chanceLabel = entry.chance ? ` — ${CHANCE_LABEL[entry.chance]}` : "";
        doc.text(
          `${entry.position}. ${entry.collegeCode} / ${entry.courseCode} — ` +
            `${entry.collegeName}, ${entry.courseName}${chanceLabel}`,
          { lineBreak: true },
        );
      }
    }

    doc.end();
  });
}
