import { prisma } from "./db";

export interface SampleDataStatus {
  isSampleDataInUse: boolean;
}

/**
 * Whether any KEA-derived data currently in the DB is sample/fake data
 * (isSample=true) rather than real ingested data. SPEC.md: "The UI must show a
 * visible 'Sample data — not real cutoffs' banner whenever sample data is used."
 */
export async function getSampleDataStatus(): Promise<SampleDataStatus> {
  const sampleCutoff = await prisma.cutoff.findFirst({
    where: { isSample: true },
    select: { id: true },
  });
  return { isSampleDataInUse: sampleCutoff !== null };
}
