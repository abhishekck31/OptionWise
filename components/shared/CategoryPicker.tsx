"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CATEGORIES } from "@/types";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

/** KEA's sixteen categories, grouped and ordered the way its reports list them. */
export const CATEGORY_GROUPS: { label: string; keys: Category[] }[] = [
  { label: "General", keys: ["GM", "GMK", "GMR"] },
  { label: "Category 1", keys: ["1G"] },
  { label: "OBC", keys: ["2AG", "2AR", "2BG", "3AG", "3BG"] },
  { label: "SC", keys: ["S1G", "S2G", "S3G", "S4R"] },
  { label: "ST", keys: ["STG", "STK", "STR"] },
];

/**
 * What each code means, in a sentence. The suffixes carry the pattern: G is
 * the general pool of a category, K the Kannada-medium pool and R the rural
 * pool, each for candidates who studied 1st to 10th standard that way.
 */
export const CATEGORY_HELP: Record<Category, string> = {
  GM: "General Merit — open to every eligible Karnataka candidate.",
  GMK: "General Merit, Kannada medium — studied 1st to 10th standard in Kannada medium.",
  GMR: "General Merit, rural — studied 1st to 10th standard in a rural school.",
  "1G": "Category 1 — seats reserved for backward classes group 1.",
  "2AG": "OBC 2A — seats reserved for backward classes group 2A.",
  "2AR": "OBC 2A, rural — group 2A candidates who studied in a rural school.",
  "2BG": "OBC 2B — seats reserved for backward classes group 2B.",
  "3AG": "OBC 3A — seats reserved for backward classes group 3A.",
  "3BG": "OBC 3B — seats reserved for backward classes group 3B.",
  S1G: "SC Category 1 — Scheduled Caste seats, sub-group 1.",
  S2G: "SC Category 2 — Scheduled Caste seats, sub-group 2.",
  S3G: "SC Category 3 — Scheduled Caste seats, sub-group 3.",
  S4R: "SC Category 4, rural — sub-group 4 candidates who studied in a rural school.",
  STG: "Scheduled Tribe — the general ST seat pool.",
  STK: "Scheduled Tribe, Kannada medium — studied 1st to 10th standard in Kannada medium.",
  STR: "Scheduled Tribe, rural — studied 1st to 10th standard in a rural school.",
};

/**
 * Every category on screen at once, as pills under their group names.
 *
 * A dropdown hides fifteen of the sixteen codes; students recognise their own
 * code on sight faster than they can find it in a list. With `explain`, each
 * pill carries a tooltip saying what the code means.
 */
export function CategoryPicker({
  value,
  onChange,
  explain = false,
  className,
}: {
  value: Category;
  onChange: (next: Category) => void;
  explain?: boolean;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="Category"
      className={cn("space-y-3", className)}
    >
      {CATEGORY_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="type-caption mb-1.5">{group.label}</p>
          <div className="grid grid-cols-4 gap-1.5">
            {group.keys.map((key) => {
              const selected = key === value;
              const pill = (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  aria-label={CATEGORIES[key]}
                  title={explain ? undefined : CATEGORIES[key]}
                  onClick={() => onChange(key)}
                  className={cn(
                    "h-8 rounded-full border px-2 font-mono text-[12px] font-medium transition-colors duration-150 active:scale-[0.97]",
                    selected
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                      : "border-[#E5E0D8] bg-white text-[#6B6B6B] hover:border-[#C9C4BC] hover:text-[#1A1A1A]"
                  )}
                >
                  {key}
                </button>
              );

              if (!explain) return pill;
              return (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>{pill}</TooltipTrigger>
                  <TooltipContent sideOffset={6} className="max-w-[240px]">
                    <span className="font-mono">{key}</span> · {CATEGORY_HELP[key].replace(" — ", ": ")}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CategoryPicker;
