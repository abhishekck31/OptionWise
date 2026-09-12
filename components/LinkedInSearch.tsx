"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.5 9.75h4.96V21H2.5V9.75ZM9.5 9.75h4.75v1.54h.07c.66-1.19 2.27-2.44 4.68-2.44 5 0 5.92 3.13 5.92 7.2V21h-4.96v-4.9c0-1.17-.02-2.67-1.7-2.67-1.7 0-1.96 1.27-1.96 2.58V21H11.4V9.75H9.5Z" />
    </svg>
  );
}

/**
 * A LinkedIn people search for one college, optionally narrowed to a branch.
 *
 * We hold no alumni data. This only builds the query string — everything that
 * comes back is whatever LinkedIn decides to show for it.
 */
export function linkedInAlumniUrl(
  collegeName: string,
  branchName?: string
): string {
  const keywords = `${collegeName} ${branchName ?? ""} engineer Karnataka`
    .replace(/\s+/g, " ")
    .trim();
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(keywords)}&origin=GLOBAL_SEARCH_HEADER`;
}

export interface LinkedInSearchProps {
  collegeName: string;
  collegeShortName: string;
  /** Narrows the search to one branch's graduates. */
  branch?: string;
}

export function LinkedInSearch({
  collegeName,
  collegeShortName,
  branch,
}: LinkedInSearchProps) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!opened) return;
    const timer = window.setTimeout(() => setOpened(false), 2000);
    return () => window.clearTimeout(timer);
  }, [opened]);

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#E5E0D8] bg-white p-4 transition-colors hover:border-[#C9C4BC]">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0A66C2]">
          <LinkedInGlyph className="size-4" />
        </span>
        <p className="min-w-0 truncate text-sm font-medium text-[#1A1A1A]">
          {branch ?? `Alumni from ${collegeShortName}`}
          {branch && (
            <span className="font-normal text-[#9B9B9B]">
              {" "}
              &mdash; {collegeShortName}
            </span>
          )}
        </p>
      </div>

      <a
        href={linkedInAlumniUrl(collegeName, branch)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpened(true)}
        className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3.5 text-xs font-medium transition-colors active:scale-[0.97] ${
          opened
            ? "border-[#B8DFC9] bg-[#E8F5EE] text-[#1F7A4A]"
            : "border-[#E5E0D8] bg-transparent text-[#1A1A1A] hover:bg-[#F0EDE8]"
        }`}
      >
        {opened ? (
          <>
            <Check className="size-3.5" aria-hidden />
            Opened
          </>
        ) : (
          <>
            Find Alumni
            <ArrowUpRight className="size-3.5" aria-hidden />
          </>
        )}
      </a>
    </div>
  );
}

export default LinkedInSearch;
