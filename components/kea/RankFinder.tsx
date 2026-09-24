"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { parseAsBoolean, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Magnetic from "@/components/motion/Magnetic";
import LoadingDots from "@/components/motion/LoadingDots";
import Reveal from "@/components/motion/Reveal";
import { CategorySelect, RoundTabs, YearSelect } from "@/components/kea/ControlSelect";
import { SourceNote, VariesNote } from "@/components/kea/SourceNote";
import { useKeaYear } from "@/hooks/useKeaYear";
import { useSetPreferences, usePreferenceInput } from "@/hooks/useKCETStore";
import { findSeats, type Route, type SeatMatch } from "@/lib/kea/finder";
import { categoryName, collegeHref, collegeShortName, KEA_YEARS, LATEST_YEAR, yearMeta } from "@/lib/kea/meta";
import { titleCase } from "@/lib/kea/courses";
import { formatCount, formatRank } from "@/lib/format";
import { isCategory } from "@/types";
import { cn } from "@/lib/utils";

const PAGE = 60;

const ROUTE_LABEL: Record<Route, string | null> = {
  category: null,
  GM: "via GM",
  HK: "371(j)",
  "HK-GM": "371(j) GM",
};

function SeatRow({ seat, index }: { seat: SeatMatch; index: number }) {
  const route = ROUTE_LABEL[seat.route];
  return (
    <li>
      <Link
        href={collegeHref(seat.code)}
        className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-b border-[#F0EDE8] px-2 py-4 transition-colors hover:bg-[#FAFAF8] md:grid-cols-[2.5rem_minmax(0,1.1fr)_minmax(0,1fr)_7rem_6rem] md:px-4"
      >
        <span className="font-mono text-[12px] text-[#B0AAA2]">{String(index + 1).padStart(2, "0")}</span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-medium text-[#1A1A1A] group-hover:text-[#CC3D2E]">
            {collegeShortName(seat.code, seat.college)}
            <span className="ml-2 font-mono text-[11px] font-normal text-[#B0AAA2]">{seat.code}</span>
          </span>
          <span className="block truncate text-[12px] text-[#9B9B9B] md:hidden">{titleCase(seat.course)}</span>
        </span>
        <span className="hidden min-w-0 truncate text-[14px] text-[#6B6B6B] md:block">{titleCase(seat.course)}</span>
        <span className="text-right">
          <span className="block font-mono text-[15px] font-medium text-[#1A1A1A]">{formatRank(seat.closingRank)}</span>
          {route && (
            <span className="mt-0.5 inline-block rounded-full bg-[#F0EDE8] px-1.5 py-px text-[10px] font-medium text-[#6B6B6B]">
              {route}
            </span>
          )}
        </span>
        <span className="hidden text-right font-mono text-[12px] md:block">
          {seat.room >= 0 ? (
            <span className="text-[#1F7A4A]">+{formatCount(Math.round(seat.room))}</span>
          ) : (
            <span className="text-[#B45309]">{formatCount(Math.round(seat.room))}</span>
          )}
        </span>
      </Link>
    </li>
  );
}

export function RankFinder() {
  const [query, setQuery] = useQueryStates({
    rank: parseAsInteger,
    category: parseAsString.withDefault("GM"),
    year: parseAsInteger.withDefault(LATEST_YEAR),
    hk: parseAsBoolean.withDefault(false),
    round: parseAsString,
  });
  const stored = usePreferenceInput();
  const setPreferences = useSetPreferences();

  const year = KEA_YEARS.includes(query.year) ? query.year : LATEST_YEAR;
  const categories = yearMeta(year)?.categories ?? [];

  const [draftRank, setDraftRank] = useState<string>(query.rank ? String(query.rank) : "");
  const [draftCategory, setDraftCategory] = useState(query.category);
  const [search, setSearch] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [showNear, setShowNear] = useState(false);

  // Keep the form in step when the URL changes underneath it (back button).
  useEffect(() => {
    setDraftRank(query.rank ? String(query.rank) : "");
    setDraftCategory(query.category);
  }, [query.rank, query.category]);

  // A student who searched before lands with their rank ready to go.
  useEffect(() => {
    if (query.rank === null && stored.rank > 0 && !draftRank) setDraftRank(String(stored.rank));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stored.rank]);

  const { data, loading, error } = useKeaYear(query.rank ? year : null);

  const results = useMemo(() => {
    if (!data || !query.rank) return null;
    // A category this year never printed (e.g. S1G before 2026) matches nothing.
    return findSeats(data, { rank: query.rank, category: query.category, hk: query.hk });
  }, [data, query.rank, query.category, query.hk]);

  const activeRound = results?.find((r) => r.round === query.round) ?? results?.at(-1) ?? null;

  const filtered = useMemo(() => {
    if (!activeRound) return [];
    const needle = search.trim().toUpperCase();
    if (!needle) return activeRound.seats;
    return activeRound.seats.filter(
      (s) => s.college.toUpperCase().includes(needle) || s.course.toUpperCase().includes(needle) || s.code === needle
    );
  }, [activeRound, search]);

  useEffect(() => setShown(PAGE), [activeRound?.round, search, query.rank, query.category, query.year, query.hk]);

  const submit = () => {
    const rank = Math.round(Number(draftRank));
    if (!Number.isFinite(rank) || rank < 1) return;
    void setQuery({ rank, category: draftCategory, round: null });
    if (isCategory(draftCategory)) {
      setPreferences({ ...stored, rank, category: draftCategory });
    }
  };

  const genReport = activeRound?.reports.find((r) => r.pool === "GEN");
  const categoryMissing = query.rank !== null && !categories.includes(query.category);

  return (
    <>
      {/* ── Header ── */}
      <section className="relative isolate overflow-hidden pb-12 pt-16 md:pt-24">
        <p aria-hidden className="watermark -right-[0.08em] top-6 -z-10 text-[clamp(7rem,22vw,20rem)] text-black/[0.03]">
          {query.rank ? formatRank(query.rank) : "R1·R2·R3"}
        </p>
        <div className="wrap">
          <Reveal className="max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9B9B9B]">
              College Finder · KEA cut-offs {KEA_YEARS.at(-1)}–{LATEST_YEAR}
            </p>
            <h1 className="mt-4 text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] tracking-[-0.04em] text-[#1A1A1A]">
              <span className="block font-light">Your rank,</span>
              <span className="block font-bold">round by round.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.7] text-[#6B6B6B]">
              Enter your KCET rank and category. See every college and course that
              rank reached in each round, read straight off KEA&rsquo;s published
              cut-off reports.
            </p>
          </Reveal>

          {/* ── Form ── */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="mt-12 max-w-3xl"
          >
            <div className="flex flex-wrap items-center gap-1 rounded-2xl border-2 border-[#E5E0D8] bg-white p-2 transition-colors focus-within:border-[#C9C4BC] md:flex-nowrap">
              <label htmlFor="finder-rank" className="sr-only">
                Your KCET rank
              </label>
              <input
                id="finder-rank"
                type="number"
                inputMode="numeric"
                min={1}
                value={draftRank}
                onChange={(e) => setDraftRank(e.target.value)}
                placeholder="Your rank"
                className="h-10 w-full min-w-0 bg-transparent px-3 font-mono text-[18px] font-medium text-[#1A1A1A] placeholder:font-sans placeholder:text-[15px] placeholder:font-normal placeholder:text-[#B0AAA2] focus-visible:shadow-none focus-visible:outline-none md:w-[150px]"
              />
              <span aria-hidden className="hidden h-6 w-px bg-[#E5E0D8] md:block" />
              <CategorySelect categories={categories} value={draftCategory} onChange={setDraftCategory} />
              <span aria-hidden className="hidden h-6 w-px bg-[#E5E0D8] md:block" />
              <YearSelect years={KEA_YEARS} value={year} onChange={(y) => void setQuery({ year: y, round: null })} />
              <span aria-hidden className="hidden h-6 w-px bg-[#E5E0D8] md:block" />
              <label className="flex h-10 items-center gap-2 rounded-xl px-3 text-[13px] text-[#6B6B6B]">
                371(j)
                <Switch checked={query.hk} onCheckedChange={(hk) => void setQuery({ hk })} aria-label="Kalyana-Karnataka 371(j) candidate" />
              </label>
              <Magnetic className="w-full md:ml-auto md:w-auto">
                <button
                  type="submit"
                  data-cursor="button"
                  disabled={!draftRank}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#CC3D2E] disabled:opacity-40 disabled:hover:bg-[#1A1A1A] md:w-auto"
                >
                  Find colleges
                  <ArrowRight className="size-3.5" strokeWidth={1.5} aria-hidden />
                </button>
              </Magnetic>
            </div>
            <p className="mt-3 px-2 text-[12px] text-[#9B9B9B]">
              {categoryName(draftCategory)} · reserved categories also include General Merit seats, since KEA
              considers every candidate for those on merit.
            </p>
          </form>
        </div>
      </section>

      {/* ── Results ── */}
      <section className="wrap pb-20">
        {!query.rank ? (
          <div className="py-20 text-center">
            <p className="text-[clamp(1.5rem,3vw,2.5rem)] font-light tracking-[-0.03em] text-[#C9C4BC]">
              Your rank. Every round.
            </p>
            <p className="mt-3 text-[15px] text-[#9B9B9B]">Enter a rank above to begin</p>
          </div>
        ) : error ? (
          <p className="py-20 text-center text-[15px] text-[#B45309]">{error}</p>
        ) : loading || !results ? (
          <LoadingDots
            label={
              <>
                Reading KEA&rsquo;s {year} cut-offs for rank{" "}
                <span className="font-mono text-[#6B6B6B]">{formatRank(query.rank)}</span>…
              </>
            }
          />
        ) : (
          <div>
            {categoryMissing && (
              <p className="mb-6 rounded-2xl bg-[#FEF3E2] px-5 py-4 text-[13px] text-[#8A4B0F]">
                KEA did not print a <span className="font-mono">{query.category}</span> column in {year}; the
                results below are General Merit seats only. SC was a single category until 2026 split it into
                S1–S4.
              </p>
            )}

            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="text-[15px] text-[#6B6B6B]">
                Rank <span className="font-mono font-medium text-[#1A1A1A]">{formatRank(query.rank)}</span> ·{" "}
                <span className="font-mono text-[#1A1A1A]">{query.category}</span> · {year}
                {query.hk && " · with 371(j) seats"}
              </p>
            </div>

            <div className="mt-6">
              <RoundTabs
                rounds={results.map((r) => {
                  const report = r.reports.find((x) => x.pool === "GEN");
                  return { round: r.round, label: r.label, mock: report?.mock, provisional: report?.provisional };
                })}
                value={activeRound?.round ?? ""}
                onChange={(round) => void setQuery({ round })}
                counts={Object.fromEntries(results.map((r) => [r.round, r.seats.length]))}
              />
            </div>

            {activeRound && genReport && (
              <div className="mt-8 rounded-3xl border border-[#E5E0D8] bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0EDE8] px-4 py-4 md:px-6">
                  <p className="text-[15px] text-[#1A1A1A]">
                    <span className="font-mono text-[22px] font-medium tracking-[-0.02em]">{formatCount(activeRound.seats.length)}</span>{" "}
                    {activeRound.seats.length === 1 ? "seat" : "seats"} in {activeRound.label}
                  </p>
                  <div className="relative w-full md:w-72">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#B0AAA2]" strokeWidth={1.5} aria-hidden />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Filter by college or course"
                      aria-label="Filter by college or course"
                      className="h-9 w-full rounded-full border border-[#E5E0D8] bg-[#F7F4F0] pl-9 pr-3 text-[13px] focus:border-[#C9C4BC] focus:bg-white focus-visible:shadow-none focus-visible:outline-none"
                    />
                  </div>
                </div>

                <div className="hidden grid-cols-[2.5rem_minmax(0,1.1fr)_minmax(0,1fr)_7rem_6rem] gap-x-4 border-b border-[#F0EDE8] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[#9B9B9B] md:grid">
                  <span>#</span>
                  <span>College</span>
                  <span>Course</span>
                  <span className="text-right">Closing rank</span>
                  <span className="text-right">Room</span>
                </div>

                {filtered.length === 0 ? (
                  <p className="px-6 py-14 text-center text-[14px] text-[#9B9B9B]">
                    {activeRound.seats.length === 0
                      ? `No seat stayed open to rank ${formatRank(query.rank)} in ${activeRound.label}.`
                      : "Nothing matches that filter."}
                  </p>
                ) : (
                  <ul>
                    {filtered.slice(0, shown).map((seat, i) => (
                      <SeatRow key={`${seat.code}-${seat.course}-${i}`} seat={seat} index={i} />
                    ))}
                  </ul>
                )}

                {filtered.length > shown && (
                  <div className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => setShown((n) => n + PAGE)}
                      className="rounded-full border border-[#E5E0D8] px-5 py-2 text-[13px] font-medium text-[#1A1A1A] transition-colors hover:border-[#C9C4BC]"
                    >
                      Show {Math.min(PAGE, filtered.length - shown)} more of {formatCount(filtered.length - shown)}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeRound && activeRound.nearMisses.length > 0 && (
              <div className="mt-6 rounded-3xl border border-[#E5E0D8] bg-white">
                <button
                  type="button"
                  onClick={() => setShowNear((v) => !v)}
                  aria-expanded={showNear}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left md:px-6"
                >
                  <span className="text-[14px] text-[#6B6B6B]">
                    <span className="font-mono font-medium text-[#1A1A1A]">{formatCount(activeRound.nearMisses.length)}</span>{" "}
                    near misses — closed within 10% before your rank
                  </span>
                  <ChevronDown className={cn("size-4 text-[#9B9B9B] transition-transform", showNear && "rotate-180")} strokeWidth={1.5} aria-hidden />
                </button>
                {showNear && (
                  <ul className="border-t border-[#F0EDE8]">
                    {activeRound.nearMisses.slice(0, 40).map((seat, i) => (
                      <SeatRow key={`near-${seat.code}-${seat.course}-${i}`} seat={seat} index={i} />
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="mt-8 space-y-4">
              {genReport && <SourceNote report={genReport} year={year} />}
              <VariesNote year={year} />
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default RankFinder;
