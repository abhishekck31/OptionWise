"use client";

import { useTranslations } from "next-intl";
import { Select } from "@/components/ui/select";
import { getCategoryBases, QUOTA_SUFFIXES } from "@/lib/categories";
import type { StepProps } from "./MarksStep";

export function CategoryStep({ answers, errors, onChange }: StepProps) {
  const t = useTranslations("Onboarding");
  // t()'s key type is checked against messages/en.json's literal shape, which works
  // great for the static keys below — but "categoryBases.<base>" and "quotas.<code>"
  // are built from config/categories.json's runtime data (not a compile-time
  // literal), so there's no way to type-check those two specifically. Every base and
  // quota code does have a matching messages/*.json entry (see __tests__).
  const td = t as unknown as (key: string) => string;
  const bases = getCategoryBases();
  const selectedBase = bases.find((b) => b.base === answers.categoryBase);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-heading text-xl font-semibold text-ink">{t("categoryStepTitle")}</h2>
      <Select
        label={t("categoryBaseLabel")}
        hint={t("categoryBaseHint")}
        error={errors.categoryBase ? t(errors.categoryBase) : undefined}
        placeholder={t("categoryBaseLabel")}
        value={answers.categoryBase}
        onChange={(e) => onChange("categoryBase", e.target.value)}
        options={bases.map((b) => ({ value: b.base, label: td(`categoryBases.${b.base}`) }))}
      />
      {selectedBase?.hasQuota ? (
        <Select
          label={t("categoryQuotaLabel")}
          hint={t("categoryQuotaHint")}
          error={errors.categoryQuota ? t(errors.categoryQuota) : undefined}
          placeholder={t("categoryQuotaLabel")}
          value={answers.categoryQuota}
          onChange={(e) => onChange("categoryQuota", e.target.value)}
          options={QUOTA_SUFFIXES.map((q) => ({ value: q.code, label: td(`quotas.${q.code}`) }))}
        />
      ) : selectedBase ? (
        <p className="text-sm text-ink/60">{t("categoryQuotaNotApplicable")}</p>
      ) : null}
    </div>
  );
}
