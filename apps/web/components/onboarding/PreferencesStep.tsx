"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import type { StepProps } from "./MarksStep";

export function PreferencesStep({ answers, errors, onChange }: StepProps) {
  const t = useTranslations("Onboarding");

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-heading text-xl font-semibold text-ink">{t("preferencesStepTitle")}</h2>
      <Input
        label={t("locationLabel")}
        hint={t("locationHint")}
        value={answers.location}
        onChange={(e) => onChange("location", e.target.value)}
      />
      <Input
        label={t("maxFeesInrLabel")}
        hint={t("maxFeesInrHint")}
        error={errors.maxFeesInr ? t(errors.maxFeesInr) : undefined}
        type="number"
        inputMode="numeric"
        min={0}
        value={answers.maxFeesInr}
        onChange={(e) => onChange("maxFeesInr", e.target.value)}
      />
      <Input
        label={t("branchesLabel")}
        hint={t("branchesHint")}
        value={answers.branches}
        onChange={(e) => onChange("branches", e.target.value)}
      />
    </div>
  );
}
