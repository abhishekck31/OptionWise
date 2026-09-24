"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { loadOnboarding, type StoredOnboarding } from "@/lib/onboarding/storage";

// A minimal read-back of the onboarding answers, proving the flow end-to-end.
// The full Safe/Target/Reach college list, filters, and evidence is the dedicated
// "Results page" task's job (TASKS.md) — this route is what it extends.
export default function ResultsPlaceholderPage() {
  const t = useTranslations("ResultsPlaceholder");
  const [stored, setStored] = useState<StoredOnboarding | null | undefined>(undefined);

  useEffect(() => {
    // localStorage doesn't exist during SSR, so this can only be read client-side,
    // post-mount — a legitimate one-time sync from an external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStored(loadOnboarding());
  }, []);

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
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-10">
      <h1 className="font-heading text-2xl font-semibold text-ink">{t("title")}</h1>
      <p className="text-lg text-ink tabular-nums">
        {t("likelyRank", {
          optimistic: prediction.optimisticRank.toLocaleString(),
          conservative: prediction.conservativeRank.toLocaleString(),
        })}
      </p>
      <p className="text-sm text-ink/70">{t("confidenceLabel", { confidence: prediction.confidence })}</p>
      {prediction.basedOnSampleData ? <p className="text-sm text-target-text">{t("sampleDataNotice")}</p> : null}
      <Link href="/onboarding" className="text-sm text-brand underline underline-offset-2">
        {t("startOver")}
      </Link>
    </main>
  );
}
