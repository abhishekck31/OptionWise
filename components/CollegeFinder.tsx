"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import CollegeCard from "@/components/CollegeCard";
import CollegePredictorForm from "@/components/CollegePredictorForm";
import { SkeletonCardGrid } from "@/components/SkeletonCard";
import { predictColleges } from "@/lib/predict";
import {
  useKCETHydration,
  usePreferenceInput,
  useSetPreferences,
} from "@/hooks/useKCETStore";
import { VERIFIED_YEAR } from "@/lib/data/cutoffs";
import { CATEGORIES, isCategory } from "@/types";
import type { CollegePreferenceInput, PredictionResult } from "@/types";
import { cn } from "@/lib/utils";

type SortKey = "chance" | "package" | "govt" | "nirf" | "name";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "chance", label: "Best Chance" },
  { key: "package", label: "Best Package" },
  { key: "govt", label: "Govt First" },
  { key: "nirf", label: "NIRF Rank" },
  { key: "name", label: "A–Z" },
];

const inr = (n: number) => n.toLocaleString("en-IN");

/** Re-orders an already-scored list without re-running the prediction. */
function sortResults(
  results: PredictionResult[],
  key: SortKey
): PredictionResult[] {
  const sorted = [...results];
  switch (key) {
    case "package":
      return sorted.sort((a, b) => b.avgPackage - a.avgPackage);
    case "govt":
      return sorted.sort((a, b) => {
        const rank = (t: string) =>
          t === "Government" ? 0 : t === "Government Aided" ? 1 : 2;
        return (
          rank(a.college.type) - rank(b.college.type) ||
          a.closingRank - b.closingRank
        );
      });
    case "nirf":
      return sorted.sort(
        (a, b) =>
          (a.college.nirfRank ?? Number.MAX_SAFE_INTEGER) -
          (b.college.nirfRank ?? Number.MAX_SAFE_INTEGER)
      );
    case "name":
      return sorted.sort((a, b) =>
        a.college.shortName.localeCompare(b.college.shortName)
      );
    default:
      return sorted;
  }
}

function EmptyResults({ rank }: { rank: number }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-[#E5E0D8] bg-white px-6 py-16 text-center">
      <SearchX className="size-10 text-[#E5E0D8]" aria-hidden />
      <p className="mt-4 text-sm text-[#1A1A1A]">
        Nothing matched rank {inr(rank)}
      </p>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#9B9B9B]">
        Every filter narrows the list further. Try clearing a city or branch
        filter, raising the fee ceiling, or checking the rank you entered.
      </p>
    </div>
  );
}

export function CollegeFinder() {
  const params = useSearchParams();
  const hydrated = useKCETHydration();
  const stored = usePreferenceInput();
  const setPreferences = useSetPreferences();

  const [draft, setDraft] = useState<CollegePreferenceInput | null>(null);
  const [applied, setApplied] = useState<CollegePreferenceInput | null>(null);
  const [busy, setBusy] = useState(false);
  const [sort, setSort] = useState<SortKey>("chance");
  const seeded = useRef(false);

  // usePreferenceInput builds a fresh object every render, so listing it as a
  // dependency would tear down this effect on the very next one — taking the
  // 400ms timer with it, and the auto-run would never fire. The effect keys on
  // hydration alone and reads the rest through a ref.
  const latest = useRef({ params, stored });
  latest.current = { params, stored };

  useEffect(() => {
    if (!hydrated || seeded.current) return;
    seeded.current = true;

    const { params, stored } = latest.current;
    const rankParam = Number(params.get("rank"));
    const categoryParam = params.get("category");

    const next: CollegePreferenceInput = {
      ...stored,
      ...(Number.isFinite(rankParam) && rankParam > 0 ? { rank: rankParam } : {}),
      ...(categoryParam && isCategory(categoryParam)
        ? { category: categoryParam }
        : {}),
    };

    setDraft(next);

    // A rank arriving in the URL means the student just came from the
    // calculator and expects to land on results, not an empty page.
    const timer = window.setTimeout(() => setApplied(next), 400);
    return () => window.clearTimeout(timer);
  }, [hydrated]);

  const results = useMemo(
    () => (applied ? predictColleges(applied) : []),
    [applied]
  );

  const sorted = useMemo(() => sortResults(results, sort), [results, sort]);

  const run = () => {
    if (!draft) return;
    setBusy(true);
    window.setTimeout(() => {
      setApplied(draft);
      setPreferences(draft);
      setBusy(false);
    }, 260);
  };

  if (!draft) {
    return (
      <div className="mt-8">
        <SkeletonCardGrid count={6} />
      </div>
    );
  }

  return (
    <>
      <div className="mt-6">
        <CollegePredictorForm
          value={draft}
          onChange={setDraft}
          onSubmit={run}
          busy={busy}
        />
      </div>

      {applied && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#6B6B6B]">
            {results.length === 0
              ? "No results"
              : `${results.length} result${results.length === 1 ? "" : "s"}`}{" "}
            for rank{" "}
            <span className="font-mono text-[#1A1A1A]">{inr(applied.rank)}</span>{" "}
            <span className="text-[#9B9B9B]">
              ({CATEGORIES[applied.category]}, {VERIFIED_YEAR} data)
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-1.5">
            {SORTS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSort(option.key)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors active:scale-[0.97]",
                  sort === option.key
                    ? "border-[#E8C4BF] bg-[#F5E8E6] text-[#CC3D2E]"
                    : "border-[#E5E0D8] bg-transparent text-[#6B6B6B] hover:bg-[#F0EDE8]"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        {busy ? (
          <SkeletonCardGrid count={6} />
        ) : applied && results.length === 0 ? (
          <EmptyResults rank={applied.rank} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sorted.map((prediction) => (
              <CollegeCard
                key={`${prediction.college.id}-${prediction.branch}`}
                prediction={prediction}
                category={applied ? applied.category : "GM"}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default CollegeFinder;
