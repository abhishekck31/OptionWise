import { type ButtonHTMLAttributes, type SVGProps } from "react";
import { cn } from "@/lib/cn";
import type { Chance } from "@/lib/predictors/collegePredictor";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

/** A generic filter/selection chip — e.g. location or branch filters. */
export function Chip({ selected, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-medium transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        selected ? "border-brand bg-brand text-brand-contrast" : "border-ink/15 bg-card text-ink hover:bg-ink/5",
        className,
      )}
      {...props}
    />
  );
}

function SafeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8.2 7.1 10.3 11.2 5.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TargetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="0.9" fill="currentColor" />
    </svg>
  );
}

function ReachIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M8 1.5 9.9 5.7 14.5 6.3 11.1 9.4 12 14 8 11.7 4 14 4.9 9.4 1.5 6.3 6.1 5.7 8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const CHANCE_CONFIG: Record<
  Chance,
  { label: string; textClass: string; surfaceClass: string; Icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement }
> = {
  safe: { label: "Safe", textClass: "text-safe-text", surfaceClass: "bg-safe-surface", Icon: SafeIcon },
  target: { label: "Target", textClass: "text-target-text", surfaceClass: "bg-target-surface", Icon: TargetIcon },
  reach: { label: "Reach", textClass: "text-reach-text", surfaceClass: "bg-reach-surface", Icon: ReachIcon },
};

export interface ChanceChipProps {
  chance: Chance;
  className?: string;
}

/**
 * Safe/Target/Reach chip — label + a shape-distinct icon, never colour alone
 * (SPEC.md "UI / UX": "Chance is NEVER shown by colour alone: always a label + icon
 * too (colour-blind safe)").
 */
export function ChanceChip({ chance, className }: ChanceChipProps) {
  const config = CHANCE_CONFIG[chance];
  const Icon = config.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        config.surfaceClass,
        config.textClass,
        className,
      )}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {config.label}
    </span>
  );
}
