"use client";

import { useTranslations } from "next-intl";

export interface StepIndicatorProps {
  current: number;
  total: number;
}

/** SPEC.md "UI / UX": "3 short steps with a progress indicator." */
export function StepIndicator({ current, total }: StepIndicatorProps) {
  const t = useTranslations("Onboarding");
  const percent = Math.round((current / total) * 100);

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium text-ink/70">{t("stepIndicator", { current, total })}</p>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10"
      >
        <div className="h-full rounded-full bg-brand transition-[width] duration-200" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
