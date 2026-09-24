import { getSampleDataStatus } from "@/lib/sampleDataStatus";

// Styling here uses only the (partial) design tokens defined in app/globals.css
// (Ink/Surface/Card/Brand, from SPEC.md) for light mode. Dark-mode colours are a
// provisional Tailwind fallback pending the real token derivation in the "Design
// system" task — see AUDIT.md.
export async function SampleDataBanner() {
  const { isSampleDataInUse } = await getSampleDataStatus();

  if (!isSampleDataInUse) {
    return null;
  }

  return (
    <div
      role="status"
      className="flex items-start gap-2 border-b px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-brand)",
        color: "var(--color-ink)",
      }}
    >
      <span aria-hidden="true">⚠️</span>
      <p>
        <strong>Sample data — not real cutoffs.</strong> Colleges, fees, and cutoff
        ranks shown right now are made up for testing and don&apos;t reflect real KEA
        results.
      </p>
    </div>
  );
}
