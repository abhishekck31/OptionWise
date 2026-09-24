/** Indian digit grouping (1,20,000 not 120,000) for ranks, fees, and other numbers
 * shown to Karnataka CET students — SPEC.md's "tabular figures for all ranks,
 * cutoffs and fees" implies numbers formatted the way students actually read them. */
export function formatIndianNumber(value: number): string {
  return value.toLocaleString("en-IN");
}
