import type { Metadata } from "next";
import PageWrapper from "@/components/PageWrapper";
import RankCalculator from "@/components/RankCalculator";
import Disclaimer from "@/components/shared/Disclaimer";
import { VERIFIED_YEAR } from "@/lib/data/cutoffs";

export const metadata: Metadata = {
  title: "KCET Rank Predictor 2026 — Estimate Your Rank",
  description:
    "Enter your Physics, Chemistry and Maths board marks and your KCET score to get the rank band KEA's 50:50 composite formula would place you in, with the working shown.",
};

export default function RankPredictorPage() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-light tracking-tight text-[#1A1A1A]">
            Rank Predictor
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#6B6B6B]">
            KEA weighs your 2nd PUC marks and your KCET score equally. Enter both
            and you get the rank band that composite lands in, then the colleges
            it reaches against the {VERIFIED_YEAR} cutoffs.
          </p>
        </header>

        <div className="mt-6">
          <Disclaimer />
        </div>

        <div className="mt-8">
          <RankCalculator />
        </div>
      </div>
    </PageWrapper>
  );
}
