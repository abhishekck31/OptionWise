"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft,
  ArrowRight,
  GripVertical,
  Layers,
  Pencil,
  Printer,
  Search,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ListIllustration } from "@/components/shared/Illustrations";
import { searchColleges } from "@/lib/predict";
import { getCutoff } from "@/lib/data/cutoffs";
import { TIER_ORDER } from "@/lib/predict";
import {
  calculateChancePercent,
  getChanceLabel,
  getTier,
} from "@/lib/kcet-formula";
import {
  useCategory,
  useKCETHydration,
  useOptionList,
  useRank,
  useRemoveFromOptionList,
  useSetOptionList,
  useUpdateOptionNote,
} from "@/hooks/useKCETStore";
import { useToast } from "@/components/Toast";
import { formatRank } from "@/lib/format";
import { BRANCHES, CATEGORIES } from "@/types";
import type { Branch, College, OptionEntry, PredictionResult, Tier } from "@/types";
import { cn } from "@/lib/utils";

/** The left edge of each row, and the dot beside each tier heading. */
const TIER_COLOR: Record<Tier, string> = {
  Aspirational: "#CC3D2E",
  Moderate: "#F59E0B",
  Safe: "#10B981",
};

const CHANCE_TEXT = {
  High: "text-[#1F7A4A]",
  Moderate: "text-[#B45309]",
  Low: "text-[#CC3D2E]",
} as const;

/* ─── One draggable row ───────────────────────────────────────────────── */

function OptionItem({
  entry,
  position,
  tierHeader,
}: {
  entry: OptionEntry;
  position: number;
  /** How many rows the tier run starting here holds; absent mid-run. */
  tierHeader?: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id });

  const remove = useRemoveFromOptionList();
  const updateNote = useUpdateOptionNote();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);

  const { prediction } = entry;

  // dnd-kit owns the transform while dragging; the lift and tilt ride on it.
  const baseTransform = CSS.Transform.toString(transform) ?? "";
  const style: React.CSSProperties = {
    transform: isDragging
      ? `${baseTransform} scale(1.02) rotate(0.8deg)`
      : baseTransform || undefined,
    transition: isDragging
      ? "box-shadow 150ms cubic-bezier(0.16, 1, 0.3, 1)"
      : transition,
    borderLeftColor: TIER_COLOR[entry.tier],
    boxShadow: isDragging ? "0 20px 40px rgba(0, 0, 0, 0.08)" : undefined,
  };

  return (
    <>
      {tierHeader !== undefined && (
        <li className="flex items-center gap-2 px-1 pb-1 pt-6 first:pt-0">
          <span
            aria-hidden
            className="size-1.5 rounded-full"
            style={{ background: TIER_COLOR[entry.tier] }}
          />
          <span className="type-caption text-[#6B6B6B]">{entry.tier}</span>
          <span className="font-mono text-[11px] text-[#B0AAA2]">{tierHeader}</span>
        </li>
      )}
      <li
        ref={setNodeRef}
        style={style}
        className={cn(
          "relative rounded-xl border border-l-4 border-[#E5E0D8] bg-white py-3.5 pl-3 pr-3",
          isDragging ? "z-10" : "transition-colors hover:border-[#C9C4BC]"
        )}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="-my-1 cursor-grab touch-none rounded-md p-1 text-[#C9C4BC] transition-colors hover:text-[#6B6B6B] active:cursor-grabbing"
            aria-label={`Reorder ${prediction.college.shortName}, currently number ${position}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" strokeWidth={1.5} aria-hidden />
          </button>

          <span className="w-6 shrink-0 font-mono text-[13px] text-[#B0AAA2]">
            {String(position).padStart(2, "0")}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-medium text-[#1A1A1A]">
              {prediction.college.shortName}
            </p>
            <p className="mt-0.5 truncate text-[13px] text-[#6B6B6B]">
              {prediction.branchName}
              <span className="ml-2 font-mono text-[11px] text-[#B0AAA2]">
                {prediction.college.kea_code}
              </span>
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-mono text-[13px] font-medium text-[#1A1A1A]">
              {formatRank(prediction.closingRank)}
            </p>
            <p
              className={cn(
                "mt-0.5 font-mono text-[11px]",
                CHANCE_TEXT[prediction.chanceLabel]
              )}
            >
              {prediction.chancePercent}%
            </p>
          </div>

          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              aria-label={`Add a note to ${prediction.college.shortName}`}
              aria-pressed={editing}
              className="rounded-md p-1.5 text-[#B0AAA2] transition-colors hover:bg-[#F7F4F0] hover:text-[#1A1A1A]"
            >
              <Pencil className="size-3.5" strokeWidth={1.5} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => {
                remove(entry.id);
                toast("Removed from option list", "neutral");
              }}
              aria-label={`Remove ${prediction.college.shortName}`}
              className="rounded-md p-1.5 text-[#B0AAA2] transition-colors hover:bg-[#F7F4F0] hover:text-[#CC3D2E]"
            >
              <X className="size-3.5" strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        </div>

        {editing ? (
          <textarea
            autoFocus
            rows={2}
            defaultValue={entry.userNote}
            onBlur={(e) => {
              updateNote(entry.id, e.target.value);
              setEditing(false);
            }}
            placeholder="Why this one?"
            className="field mt-3 h-auto py-2.5 text-[13px] leading-[1.6]"
          />
        ) : (
          entry.userNote && (
            <p className="ml-[4.25rem] mt-2 text-[13px] italic leading-[1.6] text-[#9B9B9B]">
              {entry.userNote}
            </p>
          )
        )}
      </li>
    </>
  );
}

/* ─── Add by search ───────────────────────────────────────────────────── */

function AddBySearch() {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<College | null>(null);
  const rank = useRank();
  const category = useCategory();
  const optionList = useOptionList();
  const setOptionList = useSetOptionList();
  const { toast } = useToast();

  const matches = useMemo(() => (query ? searchColleges(query) : []), [query]);

  const addBranch = (college: College, branch: Branch) => {
    const row = getCutoff(college.id, branch, category, "R3");
    if (!row) {
      toast("No published cutoff for that branch", "neutral");
      return;
    }
    const already = optionList.some(
      (e) => e.prediction.college.id === college.id && e.prediction.branch === branch
    );
    if (already) {
      toast("Already on your list", "neutral");
      return;
    }

    const chancePercent = calculateChancePercent(rank, row.closingRank);
    const prediction: PredictionResult = {
      college,
      branch,
      branchName: BRANCHES[branch],
      closingRank: row.closingRank,
      openingRank: row.openingRank,
      yourRank: rank,
      round: "R3",
      year: row.year,
      chancePercent,
      chanceLabel: getChanceLabel(chancePercent),
      trend: "stable",
      trendDelta: 0,
      tier: getTier(chancePercent),
      avgPackage: college.avgPackage,
      highestPackage: college.highestPackage,
    };

    setOptionList([
      ...optionList,
      {
        id: `${college.id}-${branch}-${Date.now()}`,
        prediction,
        tier: prediction.tier,
        userNote: "",
        addedAt: Date.now(),
      },
    ]);
    toast("Added to option list", "success");
    setPicked(null);
    setQuery("");
  };

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#B0AAA2]"
        strokeWidth={1.5}
        aria-hidden
      />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPicked(null);
        }}
        aria-label="Search a college to add"
        placeholder="Search a college to add"
        className="field pl-11"
      />

      {query && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-[#E5E0D8] bg-white p-1.5 shadow-[0_12px_32px_rgba(26,26,26,0.08)]">
          {picked ? (
            <>
              <button
                type="button"
                onClick={() => setPicked(null)}
                className="mb-1 flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-left text-[12px] text-[#9B9B9B] transition-colors hover:bg-[#F7F4F0] hover:text-[#1A1A1A]"
              >
                <ArrowLeft className="size-3.5" strokeWidth={1.5} aria-hidden />
                {picked.shortName}: pick a branch
              </button>
              {picked.availableBranches.map((branch) => (
                <button
                  key={branch}
                  type="button"
                  onClick={() => addBranch(picked, branch)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-[#1A1A1A] transition-colors hover:bg-[#F7F4F0]"
                >
                  <span className="truncate">{BRANCHES[branch]}</span>
                  <span className="font-mono text-[11px] text-[#9B9B9B]">
                    {branch}
                  </span>
                </button>
              ))}
            </>
          ) : matches.length ? (
            matches.map((college) => (
              <button
                key={college.id}
                type="button"
                onClick={() => setPicked(college)}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#F7F4F0]"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium text-[#1A1A1A]">
                    {college.shortName}
                  </span>
                  <span className="block truncate text-[12px] text-[#9B9B9B]">
                    {college.city}
                    <span className="ml-1.5 font-mono">{college.kea_code}</span>
                  </span>
                </span>
                <ArrowRight className="size-3.5 shrink-0 text-[#B0AAA2]" strokeWidth={1.5} aria-hidden />
              </button>
            ))
          ) : (
            <p className="px-3 py-3 text-[13px] text-[#9B9B9B]">
              No college matches &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Print sheet ─────────────────────────────────────────────────────── */

function ExportDialog({ entries }: { entries: OptionEntry[] }) {
  const category = useCategory();

  return (
    <Dialog>
      <DialogTrigger
        disabled={entries.length === 0}
        className="btn btn-ghost btn-sm disabled:opacity-40"
      >
        <Printer className="size-3.5" strokeWidth={1.5} aria-hidden />
        Export
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto rounded-2xl border-[#E5E0D8] bg-white p-8">
        <DialogHeader className="print-hide">
          <DialogTitle className="type-h2">Your option entry list</DialogTitle>
        </DialogHeader>

        <div className="print-area">
          <h2 className="type-h3 mb-1">
            KCET option entry, {CATEGORIES[category]}
          </h2>
          <p className="type-body-sm mb-5">
            <span className="font-mono">{entries.length}</span> options. Closing
            ranks from KEA&rsquo;s published 2026 round 3 report.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#E5E0D8]">
                  {["No.", "College", "Code", "Branch", "Closing rank", "Category"].map((h) => (
                    <th key={h} className="type-caption py-2.5 pr-4 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr key={entry.id} className="border-b border-[#F0EDE8]">
                    <td className="py-2.5 pr-4 font-mono text-[#9B9B9B]">{i + 1}</td>
                    <td className="py-2.5 pr-4 font-medium text-[#1A1A1A]">
                      {entry.prediction.college.shortName}
                    </td>
                    <td className="py-2.5 pr-4 font-mono">
                      {entry.prediction.college.kea_code}
                    </td>
                    <td className="py-2.5 pr-4 text-[#3D3D3D]">{entry.prediction.branchName}</td>
                    <td className="py-2.5 pr-4 font-mono text-[#1A1A1A]">
                      {formatRank(entry.prediction.closingRank)}
                    </td>
                    <td className="py-2.5 font-mono">{category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="btn btn-primary print-hide mt-6 w-full"
        >
          <Printer className="size-4" strokeWidth={1.5} aria-hidden />
          Print or save as PDF
        </button>
      </DialogContent>
    </Dialog>
  );
}

/* ─── The list panel ──────────────────────────────────────────────────── */

export function OptionEntryBuilder() {
  const hydrated = useKCETHydration();
  const optionList = useOptionList();
  const setOptionList = useSetOptionList();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = optionList.findIndex((e) => e.id === active.id);
    const to = optionList.findIndex((e) => e.id === over.id);
    if (from < 0 || to < 0) return;
    const next = [...optionList];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOptionList(next);
  };

  const groupByTier = () => {
    setOptionList(
      [...optionList].sort(
        (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)
      )
    );
    toast("Grouped by tier", "accent");
  };

  // How long the run of same-tier rows starting at each index is.
  const runLengths = useMemo(() => {
    const lengths: (number | undefined)[] = [];
    let i = 0;
    while (i < optionList.length) {
      let j = i;
      while (j < optionList.length && optionList[j].tier === optionList[i].tier) j++;
      lengths[i] = j - i;
      i = j;
    }
    return lengths;
  }, [optionList]);

  if (!hydrated) {
    return (
      <div className="h-64 animate-shimmer rounded-2xl border border-[#E5E0D8]" />
    );
  }

  if (optionList.length === 0) {
    return (
      // Not a .card: the search results drop out below the input and a card
      // clips its overflow.
      <div className="rounded-2xl border border-[#E5E0D8] bg-white p-6">
        <AddBySearch />
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <ListIllustration />
          <div>
            <p className="text-[15px] text-[#6B6B6B]">Your option list is empty</p>
            <p className="type-body-sm mx-auto mt-1.5 max-w-sm text-[#9B9B9B]">
              Add colleges from the finder, or search for one above. KEA reads
              your list from the top, so the first seat you qualify for is the
              one you get.
            </p>
          </div>
          <Link href="/predict/college" className="btn btn-primary group mt-2">
            Find colleges
            <ArrowRight
              className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
              strokeWidth={1.5}
              aria-hidden
            />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="min-w-[220px] flex-1">
          <AddBySearch />
        </div>
        <button type="button" onClick={groupByTier} className="btn btn-ghost btn-sm">
          <Layers className="size-3.5" strokeWidth={1.5} aria-hidden />
          Group by tier
        </button>
        <ExportDialog entries={optionList} />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={optionList.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {optionList.map((entry, index) => (
              <OptionItem
                key={entry.id}
                entry={entry}
                position={index + 1}
                // A heading appears wherever the tier changes going down the
                // list, so an ordered list shows its shape without the grouping
                // being forced on a list the student has arranged by hand.
                tierHeader={runLengths[index]}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default OptionEntryBuilder;
