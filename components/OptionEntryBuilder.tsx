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
  type DragStartEvent,
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
import ChanceArc from "@/components/shared/ChanceArc";
import Magnetic from "@/components/motion/Magnetic";
import { searchColleges, TIER_ORDER } from "@/lib/predict";
import { getCutoff } from "@/lib/data/cutoffs";
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

/** The left accent of each row, and the dot beside each tier band. */
export const TIER_COLOR: Record<Tier, string> = {
  Aspirational: "#CC3D2E",
  Moderate: "#F59E0B",
  Safe: "#10B981",
};

const TIER_BAND: Record<Tier, string> = {
  Aspirational: "bg-[#FEE8E6]/30 border-[#F5C4BF]",
  Moderate: "bg-[#FEF3E2]/30 border-[#F5D9A0]",
  Safe: "bg-[#E8F5EE]/30 border-[#B8DFC9]",
};

const averagePackage = (entries: OptionEntry[]) =>
  entries.length
    ? entries.reduce((sum, e) => sum + e.prediction.avgPackage, 0) / entries.length
    : 0;

/* ─── A tier band ─────────────────────────────────────────────────────────── */

function TierBand({ tier, entries }: { tier: Tier; entries: OptionEntry[] }) {
  return (
    <li
      aria-label={`${tier}, ${entries.length} options`}
      className={cn("flex items-center justify-between gap-3 border-y px-6 py-2", TIER_BAND[tier])}
    >
      <span className="flex items-center gap-2 text-[13px] font-medium text-[#1A1A1A]">
        <span aria-hidden className="size-1.5 rounded-full" style={{ background: TIER_COLOR[tier] }} />
        {tier}
      </span>
      <span className="text-[12px] text-[#9B9B9B]">
        <span className="font-mono text-[#6B6B6B]">{entries.length}</span>
        <span className="mx-1.5">·</span>
        avg <span className="font-mono text-[#6B6B6B]">₹{averagePackage(entries).toFixed(1)}</span> LPA
      </span>
    </li>
  );
}

/* ─── One draggable row ───────────────────────────────────────────────────── */

function OptionItem({
  entry,
  position,
  dimmed,
}: {
  entry: OptionEntry;
  position: number;
  /** Another row is being dragged: this one settles back to make room. */
  dimmed: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: entry.id });

  const remove = useRemoveFromOptionList();
  const updateNote = useUpdateOptionNote();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);

  const { prediction } = entry;

  // dnd-kit owns the transform; the lift, tilt and compression ride on it.
  const base = CSS.Transform.toString(transform) ?? "";
  const style: React.CSSProperties = {
    transform: isDragging
      ? `${base} scale(1.02) rotate(1deg)`
      : dimmed
        ? `${base} scale(0.985)`
        : base || undefined,
    transition: isDragging
      ? "box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1)"
      : [transition, "opacity 200ms ease"].filter(Boolean).join(", "),
    boxShadow: isDragging
      ? `inset 3px 0 0 ${TIER_COLOR[entry.tier]}, 0 8px 30px rgba(0,0,0,0.08)`
      : `inset 3px 0 0 ${TIER_COLOR[entry.tier]}`,
    opacity: dimmed ? 0.75 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative border-b border-[#F7F4F0] bg-white px-6 py-4 last:rounded-b-3xl last:border-b-0",
        isDragging ? "z-10 rounded-xl" : "hover:bg-[#FAFAF8]"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="-my-1 -ml-2 cursor-grab touch-none rounded-md p-1 text-[#C9C4BC] transition-colors hover:text-[#6B6B6B] active:cursor-grabbing"
          aria-label={`Reorder ${prediction.college.shortName}, currently number ${position}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-3.5" strokeWidth={1.5} aria-hidden />
        </button>

        <span className="w-6 shrink-0 font-mono text-[12px] text-[#B0AAA2]">
          {String(position).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-[#1A1A1A]">
            {prediction.college.shortName}
          </p>
          <p className="mt-0.5 truncate text-[13px] text-[#6B6B6B]">
            {prediction.branchName}
          </p>
        </div>

        <span className="ml-auto hidden font-mono text-[13px] text-[#9B9B9B] sm:block">
          {formatRank(prediction.closingRank)}
        </span>

        <ChanceArc percent={prediction.chancePercent} label={prediction.chanceLabel} size={28} />

        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            aria-label={`Add a note to ${prediction.college.shortName}`}
            aria-pressed={editing}
            className="rounded-md p-1.5 text-[#C9C4BC] transition-colors hover:text-[#1A1A1A]"
          >
            <Pencil className="size-3" strokeWidth={1.5} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => {
              remove(entry.id);
              toast("Removed from option list", "neutral");
            }}
            aria-label={`Remove ${prediction.college.shortName}`}
            className="ml-1 rounded-md p-1.5 text-[#C9C4BC] transition-colors hover:text-[#CC3D2E]"
          >
            <X className="size-3" strokeWidth={2} aria-hidden />
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
          <p className="ml-[3.25rem] mt-2 text-[13px] italic leading-[1.6] text-[#9B9B9B]">
            {entry.userNote}
          </p>
        )
      )}
    </li>
  );
}

/* ─── Add by search ───────────────────────────────────────────────────────── */

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
        className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-[#B0AAA2]"
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
        className="h-10 w-full bg-transparent pl-7 text-[14px] text-[#1A1A1A] placeholder:text-[#B0AAA2] focus-visible:shadow-none focus-visible:outline-none"
      />

      {query && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-[#E5E0D8] bg-white p-1.5 shadow-[0_12px_32px_rgba(26,26,26,0.08)]">
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
                  <span className="font-mono text-[11px] text-[#9B9B9B]">{branch}</span>
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

/* ─── Print sheet ─────────────────────────────────────────────────────────── */

function ExportDialog({ entries }: { entries: OptionEntry[] }) {
  const category = useCategory();

  return (
    <Dialog>
      <DialogTrigger
        disabled={entries.length === 0}
        className="group inline-flex items-center gap-1 text-[13px] font-medium text-[#1A1A1A] transition-colors hover:text-[#CC3D2E] disabled:opacity-40"
      >
        Export
        <ArrowRight
          className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          strokeWidth={1.5}
          aria-hidden
        />
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto rounded-3xl border-[#E5E0D8] bg-white p-8">
        <DialogHeader className="print-hide">
          <DialogTitle className="text-[28px] font-light tracking-[-0.02em]">
            Your option entry list
          </DialogTitle>
        </DialogHeader>

        <div className="print-area">
          <h2 className="type-h3 mb-1">KCET option entry, {CATEGORIES[category]}</h2>
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
                    <td className="py-2.5 pr-4 font-mono">{entry.prediction.college.kea_code}</td>
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
          className="btn print-hide mt-6 h-12 w-full rounded-full border-0 bg-[#1A1A1A] text-white transition-colors duration-200 hover:bg-[#CC3D2E]"
        >
          <Printer className="size-4" strokeWidth={1.5} aria-hidden />
          Print or save as PDF
        </button>
      </DialogContent>
    </Dialog>
  );
}

/* ─── The list panel ──────────────────────────────────────────────────────── */

export function OptionEntryBuilder() {
  const hydrated = useKCETHydration();
  const optionList = useOptionList();
  const setOptionList = useSetOptionList();
  const { toast } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id));

  const onDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
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
      [...optionList].sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier))
    );
    toast("Grouped by tier", "accent");
  };

  // Each run of same-tier rows going down the list, so a band appears wherever
  // the tier changes without forcing the grouping on a hand-ordered list.
  const runs = useMemo(() => {
    const result: { start: number; entries: OptionEntry[] }[] = [];
    optionList.forEach((entry, i) => {
      const last = result[result.length - 1];
      if (last && last.entries[0].tier === entry.tier) last.entries.push(entry);
      else result.push({ start: i, entries: [entry] });
    });
    return result;
  }, [optionList]);

  const count = hydrated ? optionList.length : 0;

  return (
    <div className="rounded-3xl border border-[#E5E0D8] bg-white">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-t-3xl border-b border-[#E5E0D8] bg-[#F7F4F0] px-6 py-4">
        <h2 className="text-[15px] font-medium text-[#1A1A1A]">Option Entry</h2>
        <span className="rounded-full bg-[#F5E8E6] px-2.5 py-0.5 font-mono text-xs text-[#CC3D2E]">
          {count} {count === 1 ? "option" : "options"}
        </span>
        <div className="ml-auto flex items-center gap-5">
          {count > 1 && (
            <button
              type="button"
              onClick={groupByTier}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]"
            >
              <Layers className="size-3.5" strokeWidth={1.5} aria-hidden />
              Group by tier
            </button>
          )}
          <ExportDialog entries={hydrated ? optionList : []} />
        </div>
      </div>

      <div className="border-b border-[#F0EDE8] px-6 py-3">
        <AddBySearch />
      </div>

      {!hydrated ? (
        <div className="blur-load px-6 py-10" data-loading="true" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 border-b border-[#F7F4F0] py-4">
              <span className="h-3 w-6 rounded bg-[#E5E0D8]" />
              <span className="h-3 flex-1 rounded bg-[#E5E0D8]" />
              <span className="size-7 rounded-full bg-[#E5E0D8]" />
            </div>
          ))}
        </div>
      ) : optionList.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <p className="text-[clamp(1.5rem,3vw,2.25rem)] font-light leading-tight tracking-[-0.03em] text-[#C9C4BC]">
            Top of the list wins.
          </p>
          <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-[#9B9B9B]">
            KEA reads your list from the top and gives you the first seat you
            qualify for. Add colleges from the finder, or search for one above.
          </p>
          <div className="mt-8">
            <Magnetic>
              <Link
                href="/predict/college"
                data-cursor="button"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#1A1A1A] px-6 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#CC3D2E]"
              >
                Find colleges
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </Link>
            </Magnetic>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <SortableContext items={optionList.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <ul className="pt-3">
              {runs.map((run) => [
                <TierBand key={`band-${run.start}`} tier={run.entries[0].tier} entries={run.entries} />,
                ...run.entries.map((entry, j) => (
                  <OptionItem
                    key={entry.id}
                    entry={entry}
                    position={run.start + j + 1}
                    dimmed={activeId !== null && activeId !== entry.id}
                  />
                )),
              ])}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

export default OptionEntryBuilder;
