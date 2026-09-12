"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import ButtonLabel from "@/components/shared/ButtonLabel";
import CategoryPicker from "@/components/shared/CategoryPicker";
import { AVAILABLE_BRANCHES, AVAILABLE_CITIES } from "@/lib/data/colleges";
import { formatRank } from "@/lib/format";
import { BRANCHES, CATEGORIES } from "@/types";
import type {
  Branch,
  CollegePreferenceInput,
  CollegeType,
  Gender,
} from "@/types";
import { cn } from "@/lib/utils";

const FEE_OPTIONS: { label: string; fee: number | null }[] = [
  { label: "Any", fee: null },
  { label: "Under ₹50K", fee: 50_000 },
  { label: "Under ₹1L", fee: 100_000 },
  { label: "Under ₹2L", fee: 200_000 },
  { label: "Under ₹5L", fee: 500_000 },
];

const COLLEGE_TYPES: { label: string; value: CollegeType }[] = [
  { label: "Govt", value: "Government" },
  { label: "Aided", value: "Government Aided" },
  { label: "Private", value: "Private Unaided" },
];

const BRANCH_CHOICES = AVAILABLE_BRANCHES.slice().sort((a, b) =>
  BRANCHES[a].localeCompare(BRANCHES[b])
);

/* ─── A pill that opens a panel ───────────────────────────────────────── */

function FilterPill({
  label,
  value,
  active = false,
  mono = false,
  open,
  onOpenChange,
  panelClassName,
  children,
}: {
  label: string;
  value: string;
  active?: boolean;
  mono?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  panelClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger data-active={active} className="pill group">
        <span className={active ? "opacity-70" : "text-[#9B9B9B]"}>{label}:</span>
        <span
          className={cn(
            mono && "font-mono",
            active ? "" : "text-[#1A1A1A]"
          )}
        >
          {value}
        </span>
        <ChevronDown
          className="size-3.5 opacity-60 transition-transform duration-150 group-data-[state=open]:rotate-180"
          strokeWidth={1.5}
          aria-hidden
        />
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} className={panelClassName}>
        {children}
      </PopoverContent>
    </Popover>
  );
}

/* ─── A checklist inside a panel ──────────────────────────────────────── */

function Checklist<T extends string>({
  options,
  selected,
  onChange,
  renderLabel,
}: {
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
    <div>
      <div className="flex items-center justify-between px-2 pb-2">
        <span className="type-caption">
          {selected.length ? `${selected.length} selected` : "Any"}
        </span>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[12px] font-medium text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]"
          >
            Clear
          </button>
        )}
      </div>
      <div className="-mx-1 max-h-72 overflow-y-auto">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() => toggle(option)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-[#1A1A1A] transition-colors hover:bg-[#F7F4F0]"
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors",
                  checked
                    ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                    : "border-[#C9C4BC] bg-white"
                )}
              >
                {checked && <Check className="size-3" strokeWidth={2} />}
              </span>
              <span className="truncate">
                {renderLabel ? renderLabel(option) : option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Summarises a multi-select for its pill: "Any", the one choice, or a count. */
function summarise(selected: string[], noun: string, label?: (v: string) => string) {
  if (selected.length === 0) return "Any";
  if (selected.length === 1) return label ? label(selected[0]) : selected[0];
  return `${selected.length} ${noun}`;
}

function ChoicePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-8 rounded-lg border px-3 text-[12px] font-medium transition-colors duration-150 active:scale-[0.97]",
        active
          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
          : "border-[#E5E0D8] bg-[#F7F4F0] text-[#6B6B6B] hover:border-[#C9C4BC] hover:text-[#1A1A1A]"
      )}
    >
      {children}
    </button>
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
  // With no rank yet, the rank panel opens itself: it is the one thing a
  // search cannot run without.
  const [rankOpen, setRankOpen] = useState(value.rank < 1);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const patch = (next: Partial<CollegePreferenceInput>) =>
    onChange({ ...value, ...next });

  const moreCount = useMemo(
    () =>
      value.collegeType.length +
      (value.maxFee !== null ? 1 : 0) +
      (value.willingToHostel ? 0 : 1) +
      (value.isHKRegion ? 1 : 0) +
      (value.gender === "F" ? 1 : 0),
    [value]
  );

  const canSearch = value.rank >= 1;

  const submit = () => {
    if (!canSearch) return;
    setRankOpen(false);
    onSubmit();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <FilterPill
        label="Rank"
        value={value.rank >= 1 ? formatRank(value.rank) : "Add"}
        mono={value.rank >= 1}
        open={rankOpen}
        onOpenChange={setRankOpen}
        panelClassName="w-72!"
      >
        <label htmlFor="rank" className="field-label">
          Your KCET rank
        </label>
        <input
          id="rank"
          type="number"
          inputMode="numeric"
          min={1}
          autoFocus
          value={value.rank || ""}
          placeholder="e.g. 2450"
          onChange={(e) => patch({ rank: Math.max(0, Number(e.target.value) || 0) })}
          onKeyDown={(e) => {
            // The panel is portalled out of the form, so Enter is wired here.
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          className="field font-mono"
        />
        <p className="type-body-sm mt-2 text-[#9B9B9B]">
          Press Enter to search.
        </p>
      </FilterPill>

      <FilterPill
        label="Category"
        value={value.category}
        mono
        open={categoryOpen}
        onOpenChange={setCategoryOpen}
        panelClassName="w-[320px]!"
      >
        <p className="type-body-sm mb-3 text-[#1A1A1A]">
          {CATEGORIES[value.category]}
        </p>
        <CategoryPicker
          value={value.category}
          onChange={(category) => {
            patch({ category });
            setCategoryOpen(false);
          }}
        />
      </FilterPill>

      <FilterPill
        label="City"
        value={summarise(value.preferredCities, "cities")}
        active={value.preferredCities.length > 0}
        panelClassName="w-64! p-2!"
      >
        <Checklist
          options={AVAILABLE_CITIES}
          selected={value.preferredCities}
          onChange={(preferredCities) => patch({ preferredCities })}
        />
      </FilterPill>

      <FilterPill
        label="Branch"
        value={summarise(value.preferredBranches, "branches")}
        active={value.preferredBranches.length > 0}
        panelClassName="w-72! p-2!"
      >
        <Checklist
          options={BRANCH_CHOICES}
          selected={value.preferredBranches}
          onChange={(preferredBranches) =>
            patch({ preferredBranches: preferredBranches as Branch[] })
          }
          renderLabel={(b) => BRANCHES[b as Branch]}
        />
      </FilterPill>

      <FilterPill
        label="More"
        value={moreCount ? `${moreCount} set` : "None"}
        active={moreCount > 0}
        panelClassName="w-[320px]! p-5!"
      >
        <div className="space-y-5">
          <div>
            <p className="type-caption mb-2">College type</p>
            <div className="flex flex-wrap gap-1.5">
              {COLLEGE_TYPES.map((type) => {
                const active = value.collegeType.includes(type.value);
                return (
                  <ChoicePill
                    key={type.value}
                    active={active}
                    onClick={() =>
                      patch({
                        collegeType: active
                          ? value.collegeType.filter((t) => t !== type.value)
                          : [...value.collegeType, type.value],
                      })
                    }
                  >
                    {type.label}
                  </ChoicePill>
                );
              })}
            </div>
          </div>

          <div>
            <p className="type-caption mb-2">Annual fee</p>
            <div className="flex flex-wrap gap-1.5">
              {FEE_OPTIONS.map((option) => (
                <ChoicePill
                  key={option.label}
                  active={value.maxFee === option.fee}
                  onClick={() => patch({ maxFee: option.fee })}
                >
                  {option.label}
                </ChoicePill>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-[#F0EDE8] pt-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-medium text-[#6B6B6B]">Gender</span>
              <div className="flex gap-1.5">
                {(["M", "F"] as Gender[]).map((g) => (
                  <ChoicePill
                    key={g}
                    active={value.gender === g}
                    onClick={() => patch({ gender: g })}
                  >
                    {g === "M" ? "Male" : "Female"}
                  </ChoicePill>
                ))}
              </div>
            </div>
            <label className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-medium text-[#6B6B6B]">
                Kalyana-Karnataka (371j)
              </span>
              <Switch
                checked={value.isHKRegion}
                onCheckedChange={(isHKRegion) => patch({ isHKRegion })}
                aria-label="Kalyana-Karnataka region candidate"
              />
            </label>
            <label className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-medium text-[#6B6B6B]">
                Happy to take a hostel seat
              </span>
              <Switch
                checked={value.willingToHostel}
                onCheckedChange={(willingToHostel) => patch({ willingToHostel })}
                aria-label="Willing to take a hostel seat"
              />
            </label>
          </div>
        </div>
      </FilterPill>

      <button
        type="submit"
        disabled={busy || !canSearch}
        data-loading={busy}
        aria-busy={busy}
        className="btn btn-primary group h-9 rounded-full px-5 text-[13px] disabled:opacity-50"
      >
        <ButtonLabel loading={busy}>
          Find
          <ArrowRight
            className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden
          />
        </ButtonLabel>
      </button>
    </form>
  );
}

export default CollegePredictorForm;
