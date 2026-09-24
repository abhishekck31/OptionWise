import type { Metadata } from "next";
import dynamic from "next/dynamic";
import PageWrapper from "@/components/PageWrapper";
import OptionsHeader from "@/components/OptionsHeader";
import StrategyPanel, { CounsellingNotes } from "@/components/StrategyPanel";
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
      <div className="blur-load h-72 rounded-3xl border border-[#E5E0D8] bg-white" data-loading="true" />
    ),
  }
);

export default function OptionsPage() {
  return (
    <PageWrapper className="py-0 md:py-0">
      <OptionsHeader />

      <div className="wrap pb-24">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="min-w-0 space-y-6">
            <OptionEntryBuilder />
            <CounsellingNotes />
            <Disclaimer />
          </div>
          {/* On a phone the dashboard comes first, folded, so the list is not buried. */}
          <div className="order-first lg:order-none">
            <StrategyPanel />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
