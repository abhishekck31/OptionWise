"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { MarksStep } from "@/components/onboarding/MarksStep";
import { CategoryStep } from "@/components/onboarding/CategoryStep";
import { PreferencesStep } from "@/components/onboarding/PreferencesStep";
import {
  EMPTY_ANSWERS,
  hasErrors,
  resolveCategoryCode,
  validateCategoryStep,
  validateMarksStep,
  validatePreferencesStep,
  type FieldErrors,
  type OnboardingAnswers,
} from "@/lib/onboarding/schema";
import { saveOnboarding } from "@/lib/onboarding/storage";
import { predictRank } from "@/lib/predictors/rankPredictor";

const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const t = useTranslations("Onboarding");
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<OnboardingAnswers>(EMPTY_ANSWERS);
  const [errors, setErrors] = useState<FieldErrors>({});

  function onChange(field: keyof OnboardingAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }

  function validateStep(n: number): FieldErrors {
    if (n === 1) return validateMarksStep(answers);
    if (n === 2) return validateCategoryStep(answers);
    return validatePreferencesStep(answers);
  }

  function goNext() {
    const stepErrors = validateStep(step);
    setErrors(stepErrors);
    if (hasErrors(stepErrors)) return;

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }

    const categoryCode = resolveCategoryCode(answers);
    if (!categoryCode) return;

    const prediction = predictRank(Number(answers.kcetMarks), Number(answers.boardPcmPercent));
    saveOnboarding({ answers, categoryCode, prediction });
    router.push("/results");
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <StepIndicator current={step} total={TOTAL_STEPS} />

      {step === 1 ? <MarksStep answers={answers} errors={errors} onChange={onChange} /> : null}
      {step === 2 ? <CategoryStep answers={answers} errors={errors} onChange={onChange} /> : null}
      {step === 3 ? <PreferencesStep answers={answers} errors={errors} onChange={onChange} /> : null}

      <div className="mt-2 flex justify-between gap-3">
        {step > 1 ? (
          <Button variant="secondary" onClick={goBack}>
            {t("back")}
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={goNext}>{step < TOTAL_STEPS ? t("next") : t("finish")}</Button>
      </div>
    </main>
  );
}
