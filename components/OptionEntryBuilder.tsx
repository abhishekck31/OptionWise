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
  ArrowRight,
  GripVertical,
  ListOrdered,
  Pencil,
  Printer,
  Search,
  Layers,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { BRANCHES, CATEGORIES } from "@/types";
import type { Branch, College, OptionEntry, PredictionResult, Tier } from "@/types";
import { cn } from "@/lib/utils";

const inr = (n: number) => n.toLocaleString("en-IN");

const TIER_LABEL: Record<Tier, string> = {
  Aspirational: "🎯 Aspirational",
  Moderate: "⚡ Moderate",
  Safe: "✅ Safe",
};

const TIER_PILL: Record<Tier, string> = {
  Aspirational: "border-[#E8C4BF] bg-[#F5E8E6] text-[#CC3D2E]",
  Moderate: "border-[#F5D9A0] bg-[#FEF3E2] text-[#B45309]",
  Safe: "border-[#B8DFC9] bg-[#E8F5EE] text-[#1F7A4A]",
};

/** The heading above each tier run, in that tier's own colour. */
const TIER_HEADING: Record<Tier, string> = {
  Aspirational: "text-[#CC3D2E]",
  Moderate: "text-[#B45309]",
  Safe: "text-[#1F7A4A]",
};

const CHANCE_PILL = {
  High: "border-[#B8DFC9] bg-[#E8F5EE] text-[#1F7A4A]",
  Moderate: "border-[#F5D9A0] bg-[#FEF3E2] text-[#B45309]",
  Low: "border-[#F5C4BF] bg-[#FEE8E6] text-[#CC3D2E]",
} as const;

/* ─── One draggable row ───────────────────────────────────────────────── */

function OptionItem({
  entry,
  position,
  showTierHeader,
}: {
  entry: OptionEntry;
  position: number;
  showTierHeader: boolean;
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

  return (
    <>
      {showTierHeader && (
        <li className="px-1 pb-1 pt-4 first:pt-0">
          <span className={cn("text-sm font-medium", TIER_HEADING[entry.tier])}>
            {TIER_LABEL[entry.tier]}
          </span>
        </li>
      )}
      <li
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className={cn(
          "rounded-xl border bg-white p-4 transition-colors",
          isDragging
            ? "z-10 scale-[1.01] border-[#CC3D2E] shadow-md"
            : "border-[#E5E0D8] hover:border-[#C9C4BC]"
        )}
      >
        <div className="flex items-start gap-3">
          <button
            type="button"
            className="mt-0.5 cursor-grab touch-none text-[#9B9B9B] transition-colors hover:text-[#6B6B6B] active:cursor-grabbing focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CC3D2E]/40"
            aria-label={`Reorder ${prediction.college.shortName}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" aria-hidden />
          </button>

          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#F5E8E6] text-xs font-semibold text-[#CC3D2E]">
            {position}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-medium text-[#1A1A1A]">
                {prediction.college.shortName}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[11px]",
                  TIER_PILL[entry.tier]
                )}
              >
                {entry.tier}
              </span>
            </div>
            <p className="mt-1 truncate text-xs text-[#6B6B6B]">
              {prediction.branchName}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-[#1A1A1A]">
                #{inr(prediction.closingRank)}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[11px]",
                  CHANCE_PILL[prediction.chanceLabel]
                )}
              >
                {prediction.chancePercent}%
              </span>
              <span className="font-mono text-[11px] text-[#9B9B9B]">
                {prediction.college.kea_code}
              </span>
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
                className="mt-3 w-full rounded-lg border border-[#E5E0D8] bg-[#F0EDE8] p-2.5 text-xs text-[#1A1A1A] placeholder:text-[#9B9B9B] focus:border-[#E8C4BF] focus-visible:outline-none"
              />
            ) : (
              entry.userNote && (
                <p className="mt-2 text-xs italic text-[#9B9B9B]">
                  {entry.userNote}
                </p>
              )
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              aria-label="Add a note"
              className="rounded-md p-1.5 text-[#9B9B9B] transition-colors hover:bg-[#F0EDE8] hover:text-[#6B6B6B] active:scale-[0.97]"
            >
              <Pencil className="size-3.5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => {
                remove(entry.id);
                toast("Removed", "neutral");
              }}
              aria-label={`Remove ${prediction.college.shortName}`}
              className="rounded-md p-1.5 text-[#9B9B9B] transition-colors hover:bg-[#F0EDE8] hover:text-[#CC3D2E] active:scale-[0.97]"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </div>
        </div>
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
      <div className="flex items-center gap-2 rounded-lg border border-[#E5E0D8] bg-[#F0EDE8] px-3">
        <Search className="size-4 shrink-0 text-[#9B9B9B]" aria-hidden />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPicked(null);
          }}
          placeholder="Search a college to add…"
          className="h-11 w-full bg-transparent text-sm text-[#1A1A1A] placeholder:text-[#9B9B9B] focus-visible:outline-none"
        />
      </div>

      {query && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-xl border border-[#E5E0D8] bg-white p-1.5">
          {picked ? (
            <>
              <button
                type="button"
                onClick={() => setPicked(null)}
                className="mb-1 w-full rounded-md px-2.5 py-1.5 text-left text-[11px] text-[#9B9B9B] hover:bg-[#F0EDE8]"
              >
                ← {picked.shortName} · pick a branch
              </button>
              {picked.availableBranches.map((branch) => (
                <button
                  key={branch}
                  type="button"
                  onClick={() => addBranch(picked, branch)}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-xs text-[#1A1A1A] transition-colors hover:bg-[#F0EDE8]"
                >
                  <span className="truncate">{BRANCHES[branch]}</span>
                  <span className="font-mono text-[10px] text-[#9B9B9B]">
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
                className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-[#F0EDE8]"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[#1A1A1A]">
                    {college.shortName}
                  </span>
                  <span className="block truncate text-[10px] text-[#9B9B9B]">
                    {college.city} · {college.kea_code}
                  </span>
                </span>
                <ArrowRight className="size-3 shrink-0 text-[#9B9B9B]" aria-hidden />
              </button>
            ))
          ) : (
            <p className="px-2.5 py-3 text-xs text-[#9B9B9B]">No match</p>
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
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-transparent px-3 text-xs text-[#6B6B6B] transition-colors hover:bg-[#F0EDE8] hover:text-[#1A1A1A] active:scale-[0.97] disabled:opacity-40"
      >
        <Printer className="size-3.5" aria-hidden />
        Export
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto border-[#E5E0D8] bg-white">
        <DialogHeader className="print-hide">
          <DialogTitle>Your option entry list</DialogTitle>
        </DialogHeader>

        <div className="print-area">
          <h2 className="mb-1 text-base font-semibold">
            KCET Option Entry — {CATEGORIES[category]}
          </h2>
          <p className="mb-4 text-xs text-[#9B9B9B]">
            {entries.length} options · closing ranks from KEA&rsquo;s published
            2026 round 3 report
          </p>
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E0D8] text-[#6B6B6B]">
                <th className="py-2 pr-3 font-medium">S.No</th>
                <th className="py-2 pr-3 font-medium">College</th>
                <th className="py-2 pr-3 font-medium">Code</th>
                <th className="py-2 pr-3 font-medium">Branch</th>
                <th className="py-2 pr-3 font-medium">Closing Rank</th>
                <th className="py-2 font-medium">Category</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={entry.id} className="border-b border-[#E5E0D8]">
                  <td className="py-2 pr-3 font-mono">{i + 1}</td>
                  <td className="py-2 pr-3">{entry.prediction.college.shortName}</td>
                  <td className="py-2 pr-3 font-mono">
                    {entry.prediction.college.kea_code}
                  </td>
                  <td className="py-2 pr-3">{entry.prediction.branchName}</td>
                  <td className="py-2 pr-3 font-mono">
                    {inr(entry.prediction.closingRank)}
                  </td>
                  <td className="py-2">{category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="print-hide mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#CC3D2E] text-sm font-medium text-white transition-colors hover:bg-[#B5351F] active:scale-[0.97]"
        >
          <Printer className="size-4" aria-hidden />
          Print / Save as PDF
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

  if (!hydrated) {
    return (
      <div className="h-64 animate-shimmer rounded-xl border border-[#E5E0D8]" />
    );
  }

  if (optionList.length === 0) {
    return (
      <div className="rounded-xl border border-[#E5E0D8] bg-white p-6">
        <AddBySearch />
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <ListOrdered className="size-10 text-[#E5E0D8]" aria-hidden />
          <p className="mt-4 text-sm text-[#1A1A1A]">No options yet</p>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#9B9B9B]">
            Add colleges from the finder, or search for one above. KEA takes your
            list in order, so the first choice you can get is the one you get.
          </p>
          <Link
            href="/predict/college"
            className="group mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-[#CC3D2E] px-5 text-sm font-medium text-white transition-colors hover:bg-[#B5351F] active:scale-[0.97]"
          >
            Find Colleges
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="min-w-[220px] flex-1">
          <AddBySearch />
        </div>
        <button
          type="button"
          onClick={groupByTier}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-transparent px-3 text-xs text-[#1A1A1A] transition-colors hover:bg-[#F0EDE8] active:scale-[0.97]"
        >
          <Layers className="size-3.5" aria-hidden />
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
          <ul className="space-y-2.5">
            {optionList.map((entry, index) => (
              <OptionItem
                key={entry.id}
                entry={entry}
                position={index + 1}
                // A heading appears wherever the tier changes going down the
                // list, so an ordered list shows its shape without the grouping
                // being forced on a list the student has arranged by hand.
                showTierHeader={
                  index === 0 || optionList[index - 1].tier !== entry.tier
                }
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default OptionEntryBuilder;
