import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/db";
import { ingestFromRawDir } from "../lib/ingestion/ingest";

async function main() {
  // Invoked via `pnpm --filter web exec tsx prisma/seed.ts`, so cwd is apps/web.
  const repoRoot = path.resolve(process.cwd(), "../..");
  const rawDir = path.join(repoRoot, "data", "raw");
  const dataDir = path.join(repoRoot, "data");

  const report = await ingestFromRawDir(prisma, rawDir);

  await mkdir(dataDir, { recursive: true });
  await writeFile(path.join(dataDir, "ingestion-report.json"), JSON.stringify(report, null, 2));

  if (report.usedSampleDataset) {
    console.log(
      `[seed] No PDFs found in data/raw/ — wrote a small, obviously-fake sample dataset ` +
        `(${report.totalCutoffRowsWritten} cutoff rows, isSample=true).`,
    );
  } else {
    console.log(
      `[seed] Ingested ${report.totalCutoffRowsWritten} cutoff rows from ${report.files.length} PDF(s) ` +
        `in data/raw/.`,
    );
    for (const file of report.files) {
      console.log(
        `  ${file.source}: ${file.parsedRows}/${file.totalDataLines} rows parsed, ` +
          `${file.rejectedRows.length} rejected` +
          (file.unknownCategoryCodes.length > 0
            ? `, unknown category codes: ${file.unknownCategoryCodes.join(", ")}`
            : ""),
      );
    }
  }
  console.log(`[seed] Full report written to data/ingestion-report.json`);
}

main()
  .catch((error) => {
    console.error("[seed] Failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
