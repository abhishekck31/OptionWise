"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import CollegeCard from "@/components/CollegeCard";
import CollegePredictorForm from "@/components/CollegePredictorForm";
import { SkeletonCardGrid } from "@/components/SkeletonCard";
import { CollegeIllustration } from "@/components/shared/Illustrations";
import { predictColleges } from "@/lib/predict";
import {
  useKCETHydration,
  usePreferenceInput,
  usePreferences,
  useRankEstimate,
  useSetPreferences,
} from "@/hooks/useKCETStore";
import { VERIFIED_YEAR } from "@/lib/data/cutoffs";
import { formatCount, formatRank } from "@/lib/format";
import { EASE_OUT, STAGGER } from "@/lib/motion";
import { isCategory } from "@/types";
import type { CollegePreferenceInput, PredictionResult } from "@/types";

type SortKey = "chance" | "package" | "govt" | "nirf" | "name";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "chance", label: "Best chance" },
  { key: "package", label: "Package" },
  { key: "govt", label: "Govt first" },
  { key: "nirf", label: "NIRF" },
  { key: "name", label: "A–Z" },
];

/** Past this many cards the stagger stops adding delay; the rest are off-screen. */
const STAGGER_CAP = 12;

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

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[#E5E0D8] px-6 py-16 text-center">
      <CollegeIllustration />
      <div>
        <p className="text-[15px] text-[#B0AAA2]">{title}</p>
        <p className="type-body-sm mx-auto mt-1.5 max-w-sm text-[#9B9B9B]">{body}</p>
      </div>
    </div>
  );
}

export function CollegeFinder() {
  const params = useSearchParams();
  const hydrated = useKCETHydration();
  const stored = usePreferenceInput();
  const preferences = usePreferences();
  const rankEstimate = useRankEstimate();
  const setPreferences = useSetPreferences();

  const [draft, setDraft] = useState<CollegePreferenceInput | null>(null);
  const [applied, setApplied] = useState<CollegePreferenceInput | null>(null);
  const [searchId, setSearchId] = useState(0);
  const [busy, setBusy] = useState(false);
  // True between seeding a saved rank and the auto-run landing, so a returning
  // student sees skeletons rather than the first-visit prompt.
  const [autoRunning, setAutoRunning] = useState(false);
  const [sort, setSort] = useState<SortKey>("chance");
  const seeded = useRef(false);

  // usePreferenceInput builds a fresh object every render, so listing it as a
  // dependency would tear down this effect on the very next one — taking the
  // 400ms timer with it, and the auto-run would never fire. The effect keys on
  // hydration alone and reads the rest through a ref.
  const latest = useRef({ params, stored, hasHistory: false });
  latest.current = {
    params,
    stored,
    hasHistory: preferences !== null || rankEstimate !== null,
  };

  useEffect(() => {
    if (!hydrated || seeded.current) return;
    seeded.current = true;

    const { params, stored, hasHistory } = latest.current;
    const rankParam = Number(params.get("rank"));
    const categoryParam = params.get("category");
    const hasRankParam = Number.isFinite(rankParam) && rankParam > 0;

    const next: CollegePreferenceInput = {
      ...stored,
      // A first visit has no rank of its own; the default is not shown as one.
      rank: hasRankParam ? rankParam : hasHistory ? stored.rank : 0,
      ...(categoryParam && isCategory(categoryParam)
        ? { category: categoryParam }
        : {}),
    };

    setDraft(next);
    if (next.rank < 1) return;
    setAutoRunning(true);

    // A rank arriving in the URL, or one worked out before, means the student
    // expects to land on results rather than an empty page.
    const timer = window.setTimeout(() => {
      setApplied(next);
      setSearchId((id) => id + 1);
      setAutoRunning(false);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [hydrated]);

  const results = useMemo(
    () => (applied ? predictColleges(applied) : []),
    [applied]
  );

  const sorted = useMemo(() => sortResults(results, sort), [results, sort]);

  const run = () => {
    if (!draft || draft.rank < 1) return;
    setBusy(true);
    window.setTimeout(() => {
      setApplied(draft);
      setSearchId((id) => id + 1);
      setPreferences(draft);
      setBusy(false);
    }, 260);
  };

  if (!draft) {
    return (
      <div className="mt-10">
        <SkeletonCardGrid count={6} />
      </div>
    );
  }

  return (
    <>
      <div className="mt-10">
        <CollegePredictorForm
          value={draft}
          onChange={setDraft}
          onSubmit={run}
          busy={busy}
        />
      </div>

      {applied && !busy && results.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
          <p className="text-[15px] text-[#3D3D3D]">
            <span className="font-mono font-medium text-[#1A1A1A]">
              {formatCount(results.length)}
            </span>{" "}
            {results.length === 1 ? "college matches" : "colleges match"} rank{" "}
            <span className="font-mono font-medium text-[#1A1A1A]">
              {formatRank(applied.rank)}
            </span>{" "}
            <span className="text-[#9B9B9B]">
              ({applied.category}, {VERIFIED_YEAR})
            </span>
          </p>

          <div
            role="group"
            aria-label="Sort results"
            className="scrollbar-none -mx-6 flex items-center gap-1.5 overflow-x-auto px-6 sm:mx-0 sm:px-0"
          >
            {SORTS.map((option) => (
              <button
                key={option.key}
                type="button"
                aria-pressed={sort === option.key}
                data-active={sort === option.key}
                onClick={() => setSort(option.key)}
                className="pill h-8 px-3 text-[12px]"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        {busy || autoRunning ? (
          <SkeletonCardGrid count={6} />
        ) : !applied ? (
          <EmptyState
            title="Enter your rank above to discover colleges"
            body={`Every college and branch it reaches, measured against KEA's round 3 closing ranks for ${VERIFIED_YEAR}.`}
          />
        ) : results.length === 0 ? (
          <EmptyState
            title={`Nothing matched rank ${formatRank(applied.rank)}`}
            body="Each filter narrows the list. Clear a city or branch, raise the fee limit, or check the rank you entered."
          />
        ) : (
          <div key={searchId} className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {sorted.map((prediction, i) => (
              <motion.div
                key={`${prediction.college.id}-${prediction.branch}`}
                layout="position"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  opacity: { duration: 0.3, ease: EASE_OUT, delay: Math.min(i, STAGGER_CAP) * STAGGER },
                  y: { duration: 0.3, ease: EASE_OUT, delay: Math.min(i, STAGGER_CAP) * STAGGER },
                  layout: { duration: 0.35, ease: EASE_OUT },
                }}
              >
                <CollegeCard
                  prediction={prediction}
                  category={applied.category}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default CollegeFinder;
