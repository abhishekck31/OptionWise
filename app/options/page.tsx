import type { Metadata } from "next";
import dynamic from "next/dynamic";
import PageWrapper from "@/components/PageWrapper";
import StrategyPanel from "@/components/StrategyPanel";
import Disclaimer from "@/components/shared/Disclaimer";

export const metadata: Metadata = {
  title: "KCET Option Entry Builder 2026 — Plan Your Counselling",
  description:
    "Order your KEA option entry list, check whether it has enough safe choices, and print it before the deadline. Built on KEA's published 2026 closing ranks.",
};

// dnd-kit only matters once there is a list to drag, so it loads with the
// component rather than with the page.
const OptionEntryBuilder = dynamic(
  () => import("@/components/OptionEntryBuilder"),
  {
    loading: () => (
      <div className="h-64 animate-shimmer rounded-2xl border border-[#E5E0D8]" />
    ),
  }
);

export default function OptionsPage() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-[1120px] px-6 sm:px-8">
        <header className="max-w-[720px]">
          <h1 className="type-h1">
            Option Entry Builder
          </h1>
          <p className="type-body-lg mt-4">
            KEA walks your list from the top and gives you the first seat you
            qualify for. Drag to set the order, and keep enough safe choices at
            the bottom that the list cannot run out.
          </p>
        </header>

        <div className="mt-8">
          <Disclaimer />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
          <OptionEntryBuilder />
          <StrategyPanel />
        </div>
      </div>
    </PageWrapper>
  );
}
