"use client";

import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/chip";
import type { Chance } from "@/lib/predictors/collegePredictor";

export type ChanceFilterValue = "all" | Chance;

export interface ChanceFilterTabsProps {
  value: ChanceFilterValue;
  onChange: (value: ChanceFilterValue) => void;
}

const OPTIONS: ChanceFilterValue[] = ["all", "safe", "target", "reach"];

/** SPEC.md "UI / UX": "a Safe / Target / Reach segmented view, instant filtering." */
export function ChanceFilterTabs({ value, onChange }: ChanceFilterTabsProps) {
  const t = useTranslations("Results");
  const tChance = useTranslations("Chance");

  return (
    <div role="group" aria-label={t("collegesTitle")} className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => (
        <Chip key={option} selected={value === option} onClick={() => onChange(option)}>
          {option === "all" ? t("filterAll") : tChance(option)}
        </Chip>
      ))}
    </div>
  );
}
