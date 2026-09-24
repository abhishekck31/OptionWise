import { getSampleDataStatus } from "@/lib/sampleDataStatus";

export async function SampleDataBanner() {
  const { isSampleDataInUse } = await getSampleDataStatus();

  if (!isSampleDataInUse) {
    return null;
  }

  return (
    <div role="status" className="flex items-start gap-2 border-b border-brand bg-card px-4 py-2 text-sm text-ink">
      <span aria-hidden="true">⚠️</span>
      <p>
        <strong>Sample data — not real cutoffs.</strong> Colleges, fees, and cutoff
        ranks shown right now are made up for testing and don&apos;t reflect real KEA
        results.
      </p>
    </div>
  );
}
