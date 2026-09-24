"use client";

import { useTranslations } from "next-intl";
import { ChanceChip } from "@/components/ui/chip";
import type { SimulationResult } from "@/lib/simulator/allotmentSimulator";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";
import { optionId } from "@/lib/optionList/storage";

export interface SimulatorPanelProps {
  result: SimulationResult;
  orderedList: CollegePrediction[];
}

/**
 * "The simulator sits right under the list and updates live as the student
 * reorders" (SPEC.md). Purely presentational — the caller re-runs
 * `simulateOptionList` on every reorder and passes the fresh result down, so this
 * component has no state of its own and just reflects whatever it's given.
 */
export function SimulatorPanel({ result, orderedList }: SimulatorPanelProps) {
  const t = useTranslations("OptionList");
  const byId = new Map(orderedList.map((p) => [optionId(p), p]));

  if (orderedList.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-ink/15 p-4 text-sm text-ink/60">
        {t("simulatorEmpty")}
      </div>
    );
  }

  const finalOption = result.finalOptionId ? byId.get(result.finalOptionId) : null;

  return (
    <div className="rounded-lg border border-ink/10 bg-card p-4">
      <h3 className="font-heading font-semibold text-ink">{t("simulatorTitle")}</h3>
      <p className="mt-1 text-xs text-ink/60">{t("simulatorCaveat")}</p>

      <ol className="mt-3 flex flex-col gap-1.5">
        {result.rounds.map((round) => {
          const held = round.allottedOptionId ? byId.get(round.allottedOptionId) : null;
          return (
            <li key={round.round} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-ink/70">{t("simulatorRound", { round: round.round })}</span>
              <span className="tabular-nums text-ink">
                {held ? t("simulatorHeld", { college: held.collegeName, course: held.courseName }) : t("simulatorNotYet")}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
        <p className="text-sm font-medium text-ink">{t("simulatorFinalTitle")}</p>
        {finalOption ? (
          <div className="flex items-center gap-2">
            <span className="text-right text-sm text-ink">{finalOption.collegeName}</span>
            <ChanceChip chance={finalOption.chance} />
          </div>
        ) : (
          <span className="text-sm text-ink/60">{t("simulatorFinalNone")}</span>
        )}
      </div>
    </div>
  );
}
