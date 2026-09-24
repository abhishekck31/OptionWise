"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip, ChanceChip } from "@/components/ui/chip";
import { Sheet } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { useToast } from "@/components/ui/toast";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-b border-ink/10 pb-8">
      <h2 className="font-heading text-xl font-semibold text-ink">{title}</h2>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  );
}

export default function DesignPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedChip, setSelectedChip] = useState(false);
  const { showToast } = useToast();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10">
      <div>
        <h1 className="font-heading text-3xl font-bold text-ink">Design system</h1>
        <p className="mt-1 text-ink/70">
          Every token, font, and core component OptionWise&apos;s UI is built from — SPEC.md
          &quot;UI / UX&quot;. Not a real page; a living reference.
        </p>
      </div>

      <Section title="Colour tokens">
        {(
          [
            ["ink", "bg-ink"],
            ["surface", "bg-surface border border-ink/10"],
            ["card", "bg-card border border-ink/10"],
            ["brand", "bg-brand"],
          ] as const
        ).map(([name, cls]) => (
          <div key={name} className="flex flex-col items-center gap-1">
            <div className={`h-14 w-14 rounded-lg ${cls}`} />
            <span className="text-xs text-ink/70">{name}</span>
          </div>
        ))}
      </Section>

      <Section title="Chance chips (label + icon, colour-blind safe)">
        <ChanceChip chance="safe" />
        <ChanceChip chance="target" />
        <ChanceChip chance="reach" />
      </Section>

      <Section title="Type">
        <div className="flex flex-col gap-2">
          <p className="font-heading text-3xl">Heading — Bricolage Grotesque</p>
          <p className="text-base">Body / UI — Manrope</p>
          <p lang="kn" className="font-kannada text-lg">
            ಕನ್ನಡ — Noto Sans Kannada
          </p>
          <p className="tabular-nums text-sm text-ink/70">Rank 12,480 · Fee ₹1,20,000 (tabular figures)</p>
        </div>
      </Section>

      <Section title="Buttons">
        <Button>Save my list</Button>
        <Button variant="secondary">Compare 3 colleges</Button>
        <Button variant="ghost">Cancel</Button>
        <Button disabled>Disabled</Button>
      </Section>

      <Section title="Input">
        <Input label="KCET marks" hint="Out of 180 — why we ask: used for your merit score." type="number" inputMode="numeric" className="max-w-xs" />
        <Input label="Category" error="Choose a category to continue." className="max-w-xs" />
      </Section>

      <Section title="Chips">
        <Chip selected={selectedChip} onClick={() => setSelectedChip((s) => !s)}>
          Bengaluru
        </Chip>
        <Chip>Computer Science</Chip>
        <Chip>Fee under ₹1L</Chip>
      </Section>

      <Section title="Sheet">
        <Sheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title="Compare colleges"
          trigger={<Button variant="secondary">Open compare tray</Button>}
        >
          <p className="mt-2 text-sm text-ink/70">Slides up from the bottom — SPEC.md&apos;s compare tray pattern.</p>
        </Sheet>
      </Section>

      <Section title="Toast">
        <Button variant="secondary" onClick={() => showToast({ title: "Saved", description: "Your option list was saved." })}>
          Trigger toast
        </Button>
        <Button variant="secondary" onClick={() => showToast({ title: "Couldn't save", description: "Check your connection and try again.", variant: "error" })}>
          Trigger error toast
        </Button>
      </Section>

      <Section title="Skeleton">
        <div className="flex w-full max-w-sm flex-col gap-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </Section>

      <Section title="Empty / error states">
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <EmptyState
            title="No colleges yet"
            description="Enter your marks and category to see colleges you can realistically get."
            action={<Button size="sm">Get started</Button>}
          />
          <ErrorState
            title="Couldn't load cutoffs"
            description="Check your connection and try again."
            action={
              <Button size="sm" variant="secondary">
                Retry
              </Button>
            }
          />
        </div>
      </Section>
    </main>
  );
}
