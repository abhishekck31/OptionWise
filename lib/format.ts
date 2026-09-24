/**
 * Number formatting shared by every rank and figure on the site.
 *
 * Indian digit grouping throughout (1,35,000), because that is how KEA prints
 * its own reports and how students read them.
 */

/** A whole count: colleges, seats, candidates. */
export const formatCount = (n: number): string => n.toLocaleString("en-IN");

/**
 * A rank as KEA publishes it. Ties are broken with fractional ranks — 3898.5,
 * 28144.875, 77697.84375 — and every digit is kept, because that is the figure
 * the report printed.
 */
export const formatRank = (n: number): string =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 5 });

/** Annual fee in rupees, shortened to lakhs once it gets there. */
export const formatFee = (n: number): string =>
  n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${formatCount(n)}`;
