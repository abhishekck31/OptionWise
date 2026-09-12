"use client";

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
 * Every category on screen at once, as pills under their group names.
 *
 * A dropdown hides fifteen of the sixteen codes; students recognise their own
 * code on sight faster than they can find it in a list. The full name rides
 * along as the tooltip and the accessible label.
 */
export function CategoryPicker({
  value,
  onChange,
  className,
}: {
  value: Category;
  onChange: (next: Category) => void;
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
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  aria-label={CATEGORIES[key]}
                  title={CATEGORIES[key]}
                  onClick={() => onChange(key)}
                  className={cn(
                    "h-8 rounded-lg border px-2 font-mono text-[12px] font-medium transition-colors duration-150 active:scale-[0.97]",
                    selected
                      ? "border-[#CC3D2E] bg-[#CC3D2E] text-white"
                      : "border-[#E5E0D8] bg-[#F7F4F0] text-[#6B6B6B] hover:border-[#C9C4BC] hover:text-[#1A1A1A]"
                  )}
                >
                  {key}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CategoryPicker;
