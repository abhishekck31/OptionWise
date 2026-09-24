"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import type { FieldErrors, OnboardingAnswers } from "@/lib/onboarding/schema";

export interface StepProps {
  answers: OnboardingAnswers;
  errors: FieldErrors;
  onChange: (field: keyof OnboardingAnswers, value: string) => void;
}

export function MarksStep({ answers, errors, onChange }: StepProps) {
  const t = useTranslations("Onboarding");

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-heading text-xl font-semibold text-ink">{t("marksStepTitle")}</h2>
      <Input
        label={t("kcetMarksLabel")}
        hint={t("kcetMarksHint")}
        error={errors.kcetMarks ? t(errors.kcetMarks) : undefined}
        type="number"
        inputMode="decimal"
        min={0}
        max={180}
        value={answers.kcetMarks}
        onChange={(e) => onChange("kcetMarks", e.target.value)}
      />
      <Input
        label={t("boardPcmPercentLabel")}
        hint={t("boardPcmPercentHint")}
        error={errors.boardPcmPercent ? t(errors.boardPcmPercent) : undefined}
        type="number"
        inputMode="decimal"
        min={0}
        max={100}
        value={answers.boardPcmPercent}
        onChange={(e) => onChange("boardPcmPercent", e.target.value)}
      />
    </div>
  );
}
