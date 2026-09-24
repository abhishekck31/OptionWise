"use client";

import { useEffect, useState } from "react";
import type { KeaYearFile } from "@/lib/kea/types";

/** One fetch per year per visit, shared by every component that asks. */
const cache = new Map<number, Promise<KeaYearFile>>();

function fetchYear(year: number): Promise<KeaYearFile> {
  let request = cache.get(year);
  if (!request) {
    request = fetch(`/kea/${year}.json`).then((res) => {
      if (!res.ok) throw new Error(`Could not load ${year} cut-offs (${res.status})`);
      return res.json() as Promise<KeaYearFile>;
    });
    // A failed request should be retried next time, not cached.
    request.catch(() => cache.delete(year));
    cache.set(year, request);
  }
  return request;
}

/**
 * Every college's cut-offs for one year, fetched on demand.
 *
 * A year is several hundred kilobytes before compression, so it is loaded
 * only on the pages that need all colleges at once, and only for the year the
 * student picks.
 */
export function useKeaYear(year: number | null) {
  const [state, setState] = useState<{
    year: number | null;
    data: KeaYearFile | null;
    error: string | null;
  }>({ year: null, data: null, error: null });

  useEffect(() => {
    if (year === null) return;
    let cancelled = false;
    fetchYear(year)
      .then((data) => !cancelled && setState({ year, data, error: null }))
      .catch((err: Error) => !cancelled && setState({ year, data: null, error: err.message }));
    return () => {
      cancelled = true;
    };
  }, [year]);

  const current = state.year === year;
  return {
    data: current ? state.data : null,
    error: current ? state.error : null,
    loading: year !== null && (!current || (!state.data && !state.error)),
  };
}
