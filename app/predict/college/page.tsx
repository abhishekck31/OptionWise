import { Suspense } from "react";
import type { Metadata } from "next";
import PageWrapper from "@/components/PageWrapper";
import CollegeFinder from "@/components/CollegeFinder";
import Disclaimer from "@/components/shared/Disclaimer";
import { SkeletonCardGrid } from "@/components/SkeletonCard";
import { VERIFIED_YEAR } from "@/lib/data/cutoffs";

export const metadata: Metadata = {
  title: "KCET College Finder 2026 — Search by Rank & Category",
  description:
    "Enter your KCET rank and category to see every Karnataka engineering college and branch it reaches, filtered by city, branch, fee and college type, against KEA's published 2026 closing ranks.",
};

export default function CollegePredictorPage() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-light tracking-tight text-[#1A1A1A]">
            College Finder
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#6B6B6B]">
            Every college and branch your rank reaches, measured against the
            round 3 closing ranks KEA published for {VERIFIED_YEAR}.
          </p>
        </header>

        <div className="mt-6">
          <Disclaimer />
        </div>

        {/* useSearchParams needs a boundary; the skeleton is what shows first. */}
        <Suspense
          fallback={
            <div className="mt-8">
              <SkeletonCardGrid count={6} />
            </div>
          }
        >
          <CollegeFinder />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
