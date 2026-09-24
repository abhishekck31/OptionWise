import { Suspense } from "react";
import type { Metadata } from "next";
import PageWrapper from "@/components/PageWrapper";
import CutoffBrowser from "@/components/kea/CutoffBrowser";
import LoadingDots from "@/components/motion/LoadingDots";

export const metadata: Metadata = {
  title: "KCET Cut-offs 2016–2026 — Every College, Every Round",
  description:
    "Year-wise KCET engineering cut-off ranks for every Karnataka college, course, round and category, read from KEA's official allotment reports.",
};

export default function CutoffsPage() {
  return (
    <PageWrapper className="py-0 md:py-0">
      <Suspense fallback={<LoadingDots />}>
        <CutoffBrowser />
      </Suspense>
    </PageWrapper>
  );
}
