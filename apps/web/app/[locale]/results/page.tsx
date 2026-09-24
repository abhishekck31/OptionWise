"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ChanceFilterTabs, type ChanceFilterValue } from "@/components/results/ChanceFilterTabs";
import { CollegeResultRow } from "@/components/results/CollegeResultRow";
import { loadOnboarding, type StoredOnboarding } from "@/lib/onboarding/storage";
import { formatIndianNumber } from "@/lib/formatNumber";
import type { CollegePrediction } from "@/lib/predictors/predictColleges";

type LoadState = "loading" | "loaded" | "error";

function buildCollegesUrl(stored: StoredOnboarding): string {
  const params = new URLSearchParams({
    rank: String(stored.prediction.likelyRank),
    categoryCode: stored.categoryCode,
  });
  if (stored.answers.location.trim()) params.set("city", stored.answers.location.trim());
  if (stored.answers.maxFeesInr.trim()) params.set("maxFeesInr", stored.answers.maxFeesInr.trim());
  if (stored.answers.branches.trim()) params.set("branches", stored.answers.branches.trim());
  return `/api/colleges?${params.toString()}`;
}

export default function ResultsPage() {
  const t = useTranslations("Results");
  const [stored, setStored] = useState<StoredOnboarding | null | undefined>(undefined);
  const [predictions, setPredictions] = useState<CollegePrediction[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [chanceFilter, setChanceFilter] = useState<ChanceFilterValue>("all");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // localStorage doesn't exist during SSR, so this can only be read client-side,
    // post-mount — a legitimate one-time sync from an external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStored(loadOnboarding());
  }, []);

  useEffect(() => {
    if (!stored) return;
    let cancelled = false;
    // Resets loading state at the start of each fetch (initial load and retries) —
    // a legitimate data-fetching effect, not an avoidable derived-state pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadState("loading");
    fetch(buildCollegesUrl(stored))
      .then((res) => {
        if (!res.ok) throw new Error(`request failed: ${res.status}`);
        return res.json();
      })
      .then((body: { predictions: CollegePrediction[] }) => {
        if (cancelled) return;
        setPredictions(body.predictions);
        setLoadState("loaded");
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [stored, reloadKey]);

  const filteredPredictions = useMemo(
    () => (chanceFilter === "all" ? predictions : predictions.filter((p) => p.chance === chanceFilter)),
    [predictions, chanceFilter],
  );

  if (stored === undefined) {
    return null;
  }

  if (stored === null) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-start gap-4 px-6 py-10">
        <p className="text-ink/70">{t("noAnswers")}</p>
        <Button asChild>
          <Link href="/onboarding">{t("noAnswersAction")}</Link>
        </Button>
      </main>
    );
  }

  const { prediction } = stored;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold text-ink">{t("title")}</h1>
        <p className="text-lg text-ink tabular-nums">
          {t("likelyRank", {
            optimistic: formatIndianNumber(prediction.optimisticRank),
            conservative: formatIndianNumber(prediction.conservativeRank),
          })}
        </p>
        <p className="text-sm text-ink/70">{t("confidenceLabel", { confidence: prediction.confidence })}</p>
        {prediction.basedOnSampleData ? <p className="text-sm text-target-text">{t("sampleDataNotice")}</p> : null}
        <Link href="/onboarding" className="text-sm text-brand underline underline-offset-2">
          {t("startOver")}
        </Link>
      </div>

      <div className="flex flex-col gap-4 border-t border-ink/10 pt-6">
        <h2 className="font-heading text-xl font-semibold text-ink">{t("collegesTitle")}</h2>
        <ChanceFilterTabs value={chanceFilter} onChange={setChanceFilter} />

        {loadState === "loading" ? (
          <div className="flex flex-col gap-2" aria-live="polite" aria-busy="true">
            <span className="sr-only">{t("loading")}</span>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : loadState === "error" ? (
          <ErrorState
            title={t("errorLoadingTitle")}
            description={t("errorLoadingDescription")}
            action={
              <Button size="sm" variant="secondary" onClick={() => setReloadKey((k) => k + 1)}>
                {t("retry")}
              </Button>
            }
          />
        ) : filteredPredictions.length === 0 ? (
          <EmptyState title={t("noResults")} description={t("noResultsAction")} />
        ) : (
          <>
            <p className="text-sm text-ink/60">{t("resultCount", { count: filteredPredictions.length })}</p>
            <ul className="flex flex-col gap-3">
              {filteredPredictions.map((p) => (
                <CollegeResultRow key={`${p.collegeCode}-${p.courseCode}`} prediction={p} />
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
