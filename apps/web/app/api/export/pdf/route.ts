import { NextResponse } from "next/server";
import { optionListToPdf, type ExportOptionEntry } from "@/lib/export/exportOptionList";

const CHANCES = new Set(["safe", "target", "reach"]);

function isValidEntry(value: unknown): value is ExportOptionEntry {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.position === "number" &&
    typeof entry.collegeCode === "string" &&
    typeof entry.collegeName === "string" &&
    typeof entry.courseCode === "string" &&
    typeof entry.courseName === "string" &&
    (entry.chance === undefined || CHANCES.has(entry.chance as string))
  );
}

/** Generates the option list's printable PDF server-side (pdfkit is Node-only, so
 * this can't run in the browser) from whatever the client currently has in
 * localStorage — there's no server-stored option list to read instead. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const entries = (body as { entries?: unknown } | null)?.entries;
  if (!Array.isArray(entries) || !entries.every(isValidEntry)) {
    return NextResponse.json({ error: "'entries' must be an array of option-list entries." }, { status: 400 });
  }

  const pdf = await optionListToPdf(entries);
  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="optionwise-option-list.pdf"',
    },
  });
}
