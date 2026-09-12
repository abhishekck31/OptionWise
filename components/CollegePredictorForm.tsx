"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Loader2, Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { AVAILABLE_BRANCHES, AVAILABLE_CITIES } from "@/lib/data/colleges";
import { BRANCHES, CATEGORIES } from "@/types";
import type {
  Branch,
  Category,
  CollegePreferenceInput,
  CollegeType,
  Gender,
} from "@/types";
import { cn } from "@/lib/utils";

const CATEGORY_GROUPS: { label: string; keys: Category[] }[] = [
  { label: "General", keys: ["GM", "GMK", "GMR"] },
  { label: "Category 1", keys: ["1G"] },
  { label: "OBC", keys: ["2AG", "2AR", "2BG", "3AG", "3BG"] },
  { label: "SC", keys: ["S1G", "S2G", "S3G", "S4R"] },
  { label: "ST", keys: ["STG", "STK", "STR"] },
];

const FEE_OPTIONS: { label: string; value: string; fee: number | null }[] = [
  { label: "Any fee", value: "any", fee: null },
  { label: "Under ₹50K", value: "50000", fee: 50_000 },
  { label: "Under ₹1L", value: "100000", fee: 100_000 },
  { label: "Under ₹2L", value: "200000", fee: 200_000 },
  { label: "Under ₹5L", value: "500000", fee: 500_000 },
];

const COLLEGE_TYPES: { label: string; value: CollegeType }[] = [
  { label: "Govt", value: "Government" },
  { label: "Aided", value: "Government Aided" },
  { label: "Private", value: "Private Unaided" },
];

const BRANCH_CHOICES = AVAILABLE_BRANCHES.slice().sort((a, b) =>
  BRANCHES[a].localeCompare(BRANCHES[b])
);

/* ─── A pill that opens a checklist ───────────────────────────────────── */

function MultiSelect<T extends string>({
  label,
  options,
  selected,
  onChange,
  renderLabel,
}: {
  label: string;
  options: readonly T[];
  selected: T[];
  onChange: (next: T[]) => void;
  renderLabel?: (value: T) => string;
}) {
  const toggle = (value: T) =>
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "inline-flex h-11 items-center gap-1.5 rounded-lg border px-3.5 text-xs transition-colors active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CC3D2E]/40",
          selected.length
            ? "border-[#E8C4BF] bg-[#F5E8E6] text-[#CC3D2E]"
            : "border-[#E5E0D8] bg-white text-[#6B6B6B] hover:bg-[#F0EDE8]"
        )}
      >
        {label}
        {selected.length > 0 && (
          <span className="rounded-full bg-[#F5E8E6] px-1.5 font-mono text-[10px] text-[#CC3D2E]">
            {selected.length}
          </span>
        )}
        <ChevronDown className="size-3" aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="max-h-72 w-56 overflow-y-auto border-[#E5E0D8] bg-white p-1.5"
      >
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="mb-1 w-full rounded-md px-2.5 py-1.5 text-left text-[11px] text-[#9B9B9B] transition-colors hover:bg-[#F0EDE8] hover:text-[#6B6B6B]"
          >
            Clear all
          </button>
        )}
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-xs text-[#1A1A1A] transition-colors hover:bg-[#F0EDE8]"
            >
              <span className="truncate">
                {renderLabel ? renderLabel(option) : option}
              </span>
              {active && (
                <Check className="size-3.5 shrink-0 text-[#CC3D2E]" aria-hidden />
              )}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

/* ─── The bar ─────────────────────────────────────────────────────────── */

export interface CollegePredictorFormProps {
  value: CollegePreferenceInput;
  onChange: (next: CollegePreferenceInput) => void;
  onSubmit: () => void;
  busy?: boolean;
}

export function CollegePredictorForm({
  value,
  onChange,
  onSubmit,
  busy = false,
}: CollegePredictorFormProps) {
  const [expanded, setExpanded] = useState(false);

  const patch = (next: Partial<CollegePreferenceInput>) =>
    onChange({ ...value, ...next });

  // Counted so the collapsed control on mobile can say how much is hidden.
  const activeCount = useMemo(
    () =>
      value.preferredCities.length +
      value.preferredBranches.length +
      value.collegeType.length +
      (value.maxFee !== null ? 1 : 0) +
      (value.willingToHostel ? 0 : 1),
    [value]
  );

  const feeValue =
    FEE_OPTIONS.find((o) => o.fee === value.maxFee)?.value ?? "any";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="rounded-xl border border-[#E5E0D8] bg-white p-4"
    >
      {/* Row 1 — the three things every search needs */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <label htmlFor="rank" className="sr-only">
            Your rank
          </label>
          <input
            id="rank"
            type="number"
            inputMode="numeric"
            min={1}
            value={value.rank || ""}
            placeholder="Your rank"
            onChange={(e) => patch({ rank: Math.max(1, Number(e.target.value) || 0) })}
            className="h-11 w-36 rounded-lg border border-[#E5E0D8] bg-[#F0EDE8] px-3 font-mono text-sm text-[#1A1A1A] transition-colors placeholder:font-sans placeholder:text-[#9B9B9B] focus:border-[#E8C4BF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CC3D2E]/40"
          />
        </div>

        <Select
          value={value.category}
          onValueChange={(category) => patch({ category: category as Category })}
        >
          <SelectTrigger className="h-11 w-[200px] rounded-lg border-[#E5E0D8] bg-[#F0EDE8]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_GROUPS.map((group) => (
              <SelectGroup key={group.label}>
                <SelectLabel className="text-[#9B9B9B]">{group.label}</SelectLabel>
                {group.keys.map((key) => (
                  <SelectItem key={key} value={key}>
                    {CATEGORIES[key]}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        <ToggleGroup
          type="single"
          value={value.gender}
          onValueChange={(gender) => gender && patch({ gender: gender as Gender })}
          className="h-11 rounded-lg border border-[#E5E0D8] bg-[#F0EDE8] p-0.5"
        >
          <ToggleGroupItem
            value="M"
            aria-label="Male"
            className="h-full rounded-md px-4 text-xs data-[state=on]:bg-[#CC3D2E] data-[state=on]:text-white"
          >
            M
          </ToggleGroupItem>
          <ToggleGroupItem
            value="F"
            aria-label="Female"
            className="h-full rounded-md px-4 text-xs data-[state=on]:bg-[#CC3D2E] data-[state=on]:text-white"
          >
            F
          </ToggleGroupItem>
        </ToggleGroup>

        <label className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#E5E0D8] bg-[#F0EDE8] px-3.5 text-xs text-[#6B6B6B]">
          371(j)
          <Switch
            checked={value.isHKRegion}
            onCheckedChange={(isHKRegion) => patch({ isHKRegion })}
            aria-label="Kalyana-Karnataka region candidate"
          />
        </label>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-transparent px-3.5 text-xs text-[#6B6B6B] transition-colors hover:bg-[#F0EDE8] active:scale-[0.97] md:hidden"
        >
          <SlidersHorizontal className="size-3.5" aria-hidden />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-[#F5E8E6] px-1.5 font-mono text-[10px] text-[#CC3D2E]">
              {activeCount}
            </span>
          )}
        </button>

        <button
          type="submit"
          disabled={busy}
          className="ml-auto inline-flex h-11 items-center gap-2 rounded-lg bg-[#CC3D2E] px-5 text-sm font-medium text-white transition-colors hover:bg-[#B5351F] active:scale-[0.97] disabled:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CC3D2E]/40"
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Search className="size-4" aria-hidden />
          )}
          Find Colleges
        </button>
      </div>

      {/* Row 2 — always open on desktop, behind the Filters control on mobile */}
      <div
        className={cn(
          "mt-3 flex-wrap items-center gap-3 border-t border-[#E5E0D8] pt-3",
          expanded ? "flex" : "hidden md:flex"
        )}
      >
        <MultiSelect
          label="City"
          options={AVAILABLE_CITIES}
          selected={value.preferredCities}
          onChange={(preferredCities) => patch({ preferredCities })}
        />

        <MultiSelect
          label="Branch"
          options={BRANCH_CHOICES}
          selected={value.preferredBranches}
          onChange={(preferredBranches) =>
            patch({ preferredBranches: preferredBranches as Branch[] })
          }
          renderLabel={(b) => BRANCHES[b as Branch]}
        />

        <div className="inline-flex items-center gap-1.5">
          {COLLEGE_TYPES.map((type) => {
            const active = value.collegeType.includes(type.value);
            return (
              <button
                key={type.value}
                type="button"
                onClick={() =>
                  patch({
                    collegeType: active
                      ? value.collegeType.filter((t) => t !== type.value)
                      : [...value.collegeType, type.value],
                  })
                }
                className={cn(
                  "h-11 rounded-lg border px-3.5 text-xs transition-colors active:scale-[0.97]",
                  active
                    ? "border-[#E8C4BF] bg-[#F5E8E6] text-[#CC3D2E]"
                    : "border-[#E5E0D8] bg-white text-[#6B6B6B] hover:bg-[#F0EDE8]"
                )}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        <label className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#E5E0D8] bg-[#F0EDE8] px-3.5 text-xs text-[#6B6B6B]">
          Hostel ok
          <Switch
            checked={value.willingToHostel}
            onCheckedChange={(willingToHostel) => patch({ willingToHostel })}
            aria-label="Willing to take a hostel seat"
          />
        </label>

        <Select
          value={feeValue}
          onValueChange={(next) =>
            patch({
              maxFee: FEE_OPTIONS.find((o) => o.value === next)?.fee ?? null,
            })
          }
        >
          <SelectTrigger className="h-11 w-[150px] rounded-lg border-[#E5E0D8] bg-[#F0EDE8]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FEE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
}

export default CollegePredictorForm;
