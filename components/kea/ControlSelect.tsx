"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryName, groupCategories } from "@/lib/kea/meta";
import { cn } from "@/lib/utils";

/** `!` because this Select merges classes without deduping. */
const TRIGGER = "h-10! rounded-xl! border-0! bg-transparent! px-3! text-[14px]! font-medium! shadow-none! hover:bg-[#F7F4F0]! data-[state=open]:bg-[#F7F4F0]!";

export function YearSelect({
  years,
  value,
  onChange,
  className,
}: {
  years: number[];
  value: number;
  onChange: (year: number) => void;
  className?: string;
}) {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger aria-label="Year" className={cn(TRIGGER, "w-auto! gap-1.5!", className)}>
        <span className="text-[12px] font-normal text-[#9B9B9B]">Year</span>
        <SelectValue>
          <span className="font-mono">{value}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {years.map((y) => (
          <SelectItem key={y} value={String(y)} className="font-mono">
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function CategorySelect({
  categories,
  value,
  onChange,
  className,
}: {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={`Category, ${categoryName(value)}`} className={cn(TRIGGER, "w-auto! gap-1.5!", className)}>
        <span className="text-[12px] font-normal text-[#9B9B9B]">Category</span>
        {/* The trigger shows only the code; the list shows code and name. */}
        <SelectValue>
          <span className="font-mono">{value}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[360px]">
        {groupCategories(categories).map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel className="type-caption">{group.label}</SelectLabel>
            {group.codes.map((code) => (
              <SelectItem key={code} value={code}>
                <span className="font-mono">{code}</span>
                <span className="ml-2 text-[12px] text-[#9B9B9B]">{categoryName(code)}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

/** A two-way switch between KEA's general report and its 371(j) report. */
export function PoolToggle({
  value,
  onChange,
  labels = ["General", "371(j)"],
}: {
  value: "GEN" | "HK";
  onChange: (pool: "GEN" | "HK") => void;
  labels?: [string, string];
}) {
  return (
    <div role="group" aria-label="Seat pool" className="inline-flex rounded-full bg-[#F0EDE8] p-0.5">
      {(["GEN", "HK"] as const).map((pool, i) => (
        <button
          key={pool}
          type="button"
          aria-pressed={value === pool}
          onClick={() => onChange(pool)}
          className={cn(
            "h-8 rounded-full px-3.5 text-[13px] font-medium transition-colors duration-150",
            value === pool ? "bg-white text-[#1A1A1A] shadow-[0_1px_2px_rgba(26,26,26,0.06)]" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
          )}
        >
          {labels[i]}
        </button>
      ))}
    </div>
  );
}

/** Round tabs, with a note where KEA called the list a mock or provisional. */
export function RoundTabs({
  rounds,
  value,
  onChange,
  counts,
}: {
  rounds: { round: string; label: string; mock?: boolean; provisional?: boolean }[];
  value: string;
  onChange: (round: string) => void;
  counts?: Record<string, number>;
}) {
  return (
    <div role="tablist" aria-label="Round" className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
      {rounds.map((r) => {
        const active = r.round === value;
        return (
          <button
            key={r.round}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(r.round)}
            className={cn(
              "shrink-0 rounded-2xl border px-4 py-2.5 text-left transition-colors duration-150",
              active ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-[#E5E0D8] bg-white text-[#1A1A1A] hover:border-[#C9C4BC]"
            )}
          >
            <span className="flex items-center gap-2 text-[13px] font-medium">
              {r.label}
              {(r.mock || r.provisional) && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-px text-[10px] font-medium uppercase tracking-[0.06em]",
                    active ? "bg-white/15 text-white/80" : "bg-[#FEF3E2] text-[#B45309]"
                  )}
                >
                  {r.mock ? "Mock" : "Provisional"}
                </span>
              )}
            </span>
            {counts && (
              <span className={cn("mt-0.5 block font-mono text-[18px] leading-tight", active ? "text-white" : "text-[#1A1A1A]")}>
                {(counts[r.round] ?? 0).toLocaleString("en-IN")}
                <span className={cn("ml-1 font-sans text-[11px]", active ? "text-white/50" : "text-[#9B9B9B]")}>seats</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
