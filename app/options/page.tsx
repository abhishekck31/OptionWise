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
      <div className="h-64 animate-shimmer rounded-xl border border-[#E5E0D8]" />
    ),
  }
);

export default function OptionsPage() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-light tracking-tight text-[#1A1A1A]">
            Option Entry Builder
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#6B6B6B]">
            KEA walks your list from the top and gives you the first seat you
            qualify for. Drag to set the order, and keep enough safe choices at
            the bottom that the list cannot run out.
          </p>
        </header>

        <div className="mt-6">
          <Disclaimer />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
          <OptionEntryBuilder />
          <StrategyPanel />
        </div>
      </div>
    </PageWrapper>
  );
}
