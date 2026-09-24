"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChanceChip } from "@/components/ui/chip";
import { formatIndianNumber } from "@/lib/formatNumber";
import { cn } from "@/lib/cn";
import { optionId } from "@/lib/optionList/storage";
import type { OptionListRowView } from "@/lib/optionList/warnings";

export interface OptionListRowProps {
  row: OptionListRowView;
  /** Total number of rows — used for "position X of Y" announcements. */
  total: number;
  /** The safe_above_reach warning message for this exact row, if it's the one
   * shadowing a later Reach option (SPEC.md: "Warnings appear inline on the exact
   * row that causes them"). */
  warningMessage?: string;
  onFixWarning?: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

/** One draggable row of the option ladder — college + course, a chance chip, a
 * one-line reason, drag handle, and explicit move-up/move-down/remove buttons so
 * reordering and removal are fully keyboard/screen-reader operable, not just
 * drag-only (SPEC.md: "Full keyboard and screen-reader support for reordering"). */
export function OptionListRow({ row, total, warningMessage, onFixWarning, onMoveUp, onMoveDown, onRemove }: OptionListRowProps) {
  const t = useTranslations("OptionList");
  const prefersReducedMotion = useReducedMotion();
  const { prediction, entry } = row;
  const id = optionId(prediction);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: prefersReducedMotion ? undefined : transition,
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      layout={!prefersReducedMotion}
      className={cn(
        "rounded-lg border bg-card p-4",
        warningMessage ? "border-target-text/50" : "border-ink/10",
        isDragging && "relative z-10 shadow-lg",
      )}
      aria-label={t("positionLabel", { position: entry.position + 1, total })}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={t("dragHandleLabel", { college: prediction.collegeName })}
          className="mt-1 flex h-8 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-ink/40 hover:bg-ink/5 hover:text-ink active:cursor-grabbing"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="h-4 w-4">
            <circle cx="5" cy="3" r="1.2" />
            <circle cx="11" cy="3" r="1.2" />
            <circle cx="5" cy="8" r="1.2" />
            <circle cx="11" cy="8" r="1.2" />
            <circle cx="5" cy="13" r="1.2" />
            <circle cx="11" cy="13" r="1.2" />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-heading font-semibold text-ink">
                {entry.position + 1}. {prediction.collegeName}
              </p>
              <p className="text-sm text-ink/70">
                {prediction.courseName} · {prediction.collegeCode}/{prediction.courseCode}
              </p>
              <p className="mt-1 text-xs tabular-nums text-ink/60">
                {prediction.feesInr != null ? t("feesKnown", { fees: formatIndianNumber(prediction.feesInr) }) : t("feesUnknown")}
              </p>
              {/* entry.explanation (from lib/optionBuilder) is hardcoded English, not
               * translated — render the equivalent translated sentence instead, keyed
               * off the same chance it was derived from. */}
              <p className="mt-1 text-sm text-ink/70">{t(`explanation.${prediction.chance}`)}</p>
            </div>
            <ChanceChip chance={prediction.chance} className="shrink-0" />
          </div>

          {warningMessage ? (
            <div className="mt-3 flex flex-col items-start gap-2 rounded-md bg-target-surface p-3 text-sm text-target-text">
              <p>{warningMessage}</p>
              {onFixWarning ? (
                <Button type="button" size="sm" variant="secondary" onClick={onFixWarning}>
                  {t("fixNow")}
                </Button>
              ) : null}
            </div>
          ) : null}

          <div className="mt-3 flex items-center gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={onMoveUp} disabled={entry.position === 0}>
              {t("moveUp")}
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={onMoveDown} disabled={entry.position === total - 1}>
              {t("moveDown")}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={onRemove}>
              {t("remove")}
            </Button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}
