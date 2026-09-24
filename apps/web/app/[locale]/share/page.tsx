"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ChanceChip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { decodeShareData, type ShareEntry } from "@/lib/optionList/share";

type LoadState = { status: "loading" } | { status: "invalid" } | { status: "loaded"; entries: ShareEntry[] };

export default function SharePage() {
  const t = useTranslations("Share");
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    // The share payload lives only in the URL fragment (never sent to the server),
    // so it can only be read client-side, post-mount.
    const encoded = window.location.hash.slice(1);
    const decoded = encoded ? decodeShareData(encoded) : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(decoded ? { status: "loaded", entries: decoded } : { status: "invalid" });
  }, []);

  if (state.status === "loading") {
    return null;
  }

  if (state.status === "invalid") {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-start gap-4 px-6 py-10">
        <ErrorState
          title={t("invalid")}
          description={t("invalidDescription")}
          action={
            <Button asChild>
              <Link href="/">{t("invalidAction")}</Link>
            </Button>
          }
        />
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold text-ink">{t("title")}</h1>
        <p className="text-sm text-ink/70">{t("description")}</p>
      </div>

      {state.entries.length === 0 ? (
        <EmptyState title={t("empty")} description={t("description")} />
      ) : (
        <ol className="flex flex-col gap-3">
          {state.entries.map((entry, index) => (
            <li key={`${entry.collegeCode}-${entry.courseCode}`} className="rounded-lg border border-ink/10 bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading font-semibold text-ink">
                    {index + 1}. {entry.collegeName}
                  </p>
                  <p className="text-sm text-ink/70">
                    {entry.courseName} · {entry.collegeCode}/{entry.courseCode}
                  </p>
                </div>
                <ChanceChip chance={entry.chance} className="shrink-0" />
              </div>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
