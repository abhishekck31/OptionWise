import { Suspense } from "react";
import type { Metadata } from "next";
import PageWrapper from "@/components/PageWrapper";
import RankFinder from "@/components/kea/RankFinder";
import LoadingDots from "@/components/motion/LoadingDots";

export const metadata: Metadata = {
  title: "KCET College Finder — Colleges by Rank, Round by Round",
  description:
    "Enter your KCET rank and category to see every Karnataka engineering college and course that rank reached in KEA's round 1, 2 and 3 allotments, from the official cut-off reports 2016–2026.",
};

export default function CollegeFinderPage() {
  return (
    <PageWrapper className="py-0 md:py-0">
      {/* Query state is read from the URL, which needs a Suspense boundary. */}
      <Suspense fallback={<LoadingDots />}>
        <RankFinder />
      </Suspense>
    </PageWrapper>
  );
}
