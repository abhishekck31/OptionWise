"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { OptionListRow } from "@/components/optionList/OptionListRow";
import { SimulatorPanel } from "@/components/optionList/SimulatorPanel";
import { loadOnboarding, type StoredOnboarding } from "@/lib/onboarding/storage";
import { loadOptionList, optionId, saveOptionList } from "@/lib/optionList/storage";
import { simulateOptionList } from "@/lib/optionList/simulate";
import { buildOptionListView, fixSafeAboveReach } from "@/lib/optionList/warnings";
import { encodeShareData } from "@/lib/optionList/share";
import { optionListToCsv, type ExportOptionEntry } from "@/lib/export/exportOptionList";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";
import type { Warning } from "@/lib/optionBuilder/optionBuilder";

function toExportEntries(list: CollegePrediction[]): ExportOptionEntry[] {
  return list.map((p, index) => ({
    position: index + 1,
    collegeCode: p.collegeCode,
    collegeName: p.collegeName,
    courseCode: p.courseCode,
    courseName: p.courseName,
    chance: p.chance,
  }));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Share links live entirely in the URL fragment (never a query string), so they
 * work with no backend and are never sent to a server or logged. */
function buildShareUrl(list: CollegePrediction[]): string {
  return `${window.location.origin}/share#${encodeShareData(list)}`;
}

export default function OptionListPage() {
  const t = useTranslations("OptionList");
  const { showToast } = useToast();
  const [stored, setStored] = useState<StoredOnboarding | null | undefined>(undefined);
  const [list, setList] = useState<CollegePrediction[]>([]);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    // localStorage doesn't exist during SSR, so this can only be read client-side,
    // post-mount — a legitimate one-time sync from an external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStored(loadOnboarding());
    setList(loadOptionList());
  }, []);

  const { rows, warnings } = useMemo(() => buildOptionListView(list), [list]);
  const tooFewSafe = warnings.find((w): w is Extract<Warning, { type: "too_few_safe" }> => w.type === "too_few_safe");
  const safeAboveReachById = new Map(
    warnings
      .filter((w): w is Extract<Warning, { type: "safe_above_reach" }> => w.type === "safe_above_reach")
      .map((w) => [w.safeEntryId, w]),
  );

  const rank = stored?.prediction.likelyRank;
  const simulation = useMemo(
    () => (rank !== undefined ? simulateOptionList(list, rank) : null),
    [list, rank],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function persist(next: CollegePrediction[]) {
    setList(next);
    saveOptionList(next);
  }

  function announceMove(item: CollegePrediction, position: number, total: number) {
    setAnnouncement(t("movedAnnouncement", { college: item.collegeName, position: position + 1, total }));
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const next = [...list];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    persist(next);
    announceMove(next[index - 1], index - 1, next.length);
  }

  function handleMoveDown(index: number) {
    if (index === list.length - 1) return;
    const next = [...list];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    persist(next);
    announceMove(next[index + 1], index + 1, next.length);
  }

  function handleRemove(index: number) {
    const removed = list[index];
    const next = list.filter((_, i) => i !== index);
    persist(next);
    showToast({
      title: t("removedToast", { college: removed.collegeName }),
      action: {
        label: t("undo"),
        onClick: () => {
          const restored = [...next];
          restored.splice(index, 0, removed);
          persist(restored);
        },
      },
    });
  }

  function handleFixWarning(warning: Extract<Warning, { type: "safe_above_reach" }>) {
    persist(fixSafeAboveReach(list, warning));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = list.map(optionId);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    const next = arrayMove(list, oldIndex, newIndex);
    persist(next);
    announceMove(next[newIndex], newIndex, next.length);
  }

  function handleExportCsv() {
    const csv = optionListToCsv(toExportEntries(list));
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), "optionwise-option-list.csv");
  }

  async function handleExportPdf() {
    try {
      const response = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: toExportEntries(list) }),
      });
      if (!response.ok) throw new Error(`request failed: ${response.status}`);
      const blob = await response.blob();
      downloadBlob(blob, "optionwise-option-list.pdf");
    } catch {
      showToast({ title: t("exportPdfError"), variant: "error" });
    }
  }

  async function handleShare() {
    const url = buildShareUrl(list);
    await navigator.clipboard.writeText(url);
    showToast({ title: t("shareCopied") });
  }

  if (stored === undefined) {
    return null;
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold text-ink">{t("title")}</h1>
        <p className="text-sm text-ink/70">{t("description")}</p>
        <Link href="/results" className="text-sm text-brand underline underline-offset-2">
          {t("backToResults")}
        </Link>
      </div>

      <span aria-live="assertive" className="sr-only">
        {announcement}
      </span>

      {list.length === 0 ? (
        <EmptyState
          title={t("empty")}
          description={t("description")}
          action={
            <Button asChild>
              <Link href="/results">{t("emptyAction")}</Link>
            </Button>
          }
        />
      ) : (
        <>
          {tooFewSafe ? (
            <div className="rounded-lg border border-target-text/30 bg-target-surface p-4 text-sm text-target-text">
              <p className="font-semibold">{t("warningsTitle")}</p>
              <p className="mt-1">{t("tooFewSafe", { count: tooFewSafe.safeCount, minimum: tooFewSafe.minimum })}</p>
              <Link href="/results" className="mt-2 inline-block underline underline-offset-2">
                {t("tooFewSafeAction")}
              </Link>
            </div>
          ) : null}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={list.map(optionId)} strategy={verticalListSortingStrategy}>
              <ul className="flex flex-col gap-3">
                {rows.map((row, index) => {
                  const warning = safeAboveReachById.get(row.entry.id);
                  return (
                    <OptionListRow
                      key={optionId(row.prediction)}
                      row={row}
                      total={rows.length}
                      warningMessage={
                        warning
                          ? t("safeAboveReach", { safeCollege: row.prediction.collegeName, count: warning.reachEntryIds.length })
                          : undefined
                      }
                      onFixWarning={warning ? () => handleFixWarning(warning) : undefined}
                      onMoveUp={() => handleMoveUp(index)}
                      onMoveDown={() => handleMoveDown(index)}
                      onRemove={() => handleRemove(index)}
                    />
                  );
                })}
              </ul>
            </SortableContext>
          </DndContext>

          {simulation ? <SimulatorPanel result={simulation} orderedList={list} /> : null}

          <div className="flex flex-col gap-3 border-t border-ink/10 pt-6">
            <h2 className="font-heading text-lg font-semibold text-ink">{t("exportTitle")}</h2>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={handleExportCsv}>
                {t("exportCsv")}
              </Button>
              <Button type="button" variant="secondary" onClick={handleExportPdf}>
                {t("exportPdf")}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-ink/10 pt-6">
            <h2 className="font-heading text-lg font-semibold text-ink">{t("shareTitle")}</h2>
            <p className="text-sm text-ink/70">{t("shareDescription")}</p>
            <Button type="button" variant="secondary" className="self-start" onClick={handleShare}>
              {t("shareAction")}
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
