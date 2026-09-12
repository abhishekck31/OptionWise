"use client";

import PageWrapper from "@/components/PageWrapper";
import CutoffExplorer from "@/components/features/college-predictor/CutoffExplorer";
import CollegeComparison from "@/components/features/college-detail/CollegeComparison";
import Disclaimer from "@/components/shared/Disclaimer";
import { useCategory } from "@/hooks/useKCETStore";

export default function ExplorePage() {
  const category = useCategory();

  return (
    <PageWrapper className="py-0">
      <section id="compare" className="scroll-mt-16">
        <CollegeComparison category={category} />
      </section>

      <section id="cutoffs" className="scroll-mt-16 border-t border-[#E5E0D8]">
        <CutoffExplorer initialCategory={category} />
      </section>

      <div className="mx-auto max-w-[1120px] px-6 pb-[96px] sm:px-8">
        <Disclaimer />
      </div>
    </PageWrapper>
  );
}
