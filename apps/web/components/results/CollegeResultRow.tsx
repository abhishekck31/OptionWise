"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChanceChip } from "@/components/ui/chip";
import { formatIndianNumber } from "@/lib/formatNumber";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";

export interface CollegeResultRowProps {
  prediction: CollegePrediction;
  /** Whether this college+course is already on the student's option list — flips
   * the action button between "add" and "remove". Omit to hide the action entirely
   * (used by contexts, like the future share view, that shouldn't offer it). */
  inOptionList?: boolean;
  onToggleOptionList?: (prediction: CollegePrediction) => void;
}

/** One row of the results list — college + course, a chance chip, and (tap to
 * expand) the cutoff evidence behind it. SPEC.md "UI / UX": "Each row shows college
 * + course, a chance chip, and a one-line reason. Tap to expand for cutoff
 * evidence." */
export function CollegeResultRow({ prediction, inOptionList, onToggleOptionList }: CollegeResultRowProps) {
  const t = useTranslations("Results");

  return (
    <li className="rounded-lg border border-ink/10 bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading font-semibold text-ink">{prediction.collegeName}</p>
          <p className="text-sm text-ink/70">
            {prediction.courseName} · {prediction.collegeCode}/{prediction.courseCode}
          </p>
          <p className="mt-1 text-xs tabular-nums text-ink/60">
            {prediction.feesInr != null ? t("feesKnown", { fees: formatIndianNumber(prediction.feesInr) }) : t("feesUnknown")}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <ChanceChip chance={prediction.chance} />
          {onToggleOptionList ? (
            <Button
              type="button"
              size="sm"
              variant={inOptionList ? "secondary" : "primary"}
              onClick={() => onToggleOptionList(prediction)}
            >
              {inOptionList ? t("removeFromList") : t("addToList")}
            </Button>
          ) : null}
        </div>
      </div>

      <details className="mt-3 group">
        <summary className="cursor-pointer text-sm font-medium text-brand [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">{t("evidenceShow")}</span>
          <span className="hidden group-open:inline">{t("evidenceHide")}</span>
        </summary>
        {prediction.evidence.length === 0 ? (
          <p className="mt-2 text-sm text-ink/60">{t("evidenceEmpty")}</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1">
            {prediction.evidence.map((row) => (
              <li key={`${row.year}-${row.round}`} className="text-sm tabular-nums text-ink/70">
                {t("evidenceRow", { year: row.year, round: row.round, rank: formatIndianNumber(row.closingRank) })}
              </li>
            ))}
          </ul>
        )}
      </details>
    </li>
  );
}
