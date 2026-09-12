/**
 * Small line drawings for empty states, all in the border tone so they sit
 * back from the copy beneath them. Decorative only.
 */

const STROKE = "#E5E0D8";

/** Three blocks under a pitched roof: a college, before there is a search. */
export function CollegeIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 64"
      width="80"
      height="64"
      fill="none"
      stroke={STROKE}
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M8 24 40 6l32 18" />
      <rect x="14" y="26" width="52" height="30" rx="2" />
      <rect x="24" y="34" width="8" height="22" rx="1" />
      <rect x="36" y="34" width="8" height="22" rx="1" />
      <rect x="48" y="34" width="8" height="22" rx="1" />
      <path d="M4 58h72" strokeLinecap="round" />
    </svg>
  );
}

/** A list with one row lifted out of line: an option list waiting to be built. */
export function ListIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 64"
      width="80"
      height="64"
      fill="none"
      stroke={STROKE}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="10" y="6" width="56" height="12" rx="3" />
      <path d="M18 12h24" />
      <rect x="16" y="24" width="56" height="12" rx="3" strokeDasharray="4 4" />
      <path d="M24 30h20" strokeDasharray="4 4" />
      <rect x="10" y="44" width="56" height="12" rx="3" strokeDasharray="4 4" />
      <path d="M18 50h16" strokeDasharray="4 4" />
      <path d="M4 26v8M4 26l-2 2M4 26l2 2M4 34l-2-2M4 34l2-2" />
    </svg>
  );
}

/** Two bars meeting at an equals sign: the 50:50 formula, before any marks. */
export function FormulaIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 64"
      width="80"
      height="64"
      fill="none"
      stroke={STROKE}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="6" y="10" width="68" height="44" rx="6" />
      <path d="M16 24h18M16 34h12" />
      <path d="M40 22v14M33 29h14" />
      <path d="M52 26h12M52 32h12" />
      <path d="M16 44h48" strokeDasharray="3 4" />
    </svg>
  );
}
