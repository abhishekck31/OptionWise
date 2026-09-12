import { Briefcase, ExternalLink } from "lucide-react";
import type { College } from "@/types";

export interface LinkedInSectionProps {
  college: College;
}

/**
 * Where graduates end up.
 *
 * Recruiter names come from the dataset; the alumni link hands off to
 * LinkedIn's own search rather than pretending to hold profile data.
 */
export function LinkedInSection({ college }: LinkedInSectionProps) {
  const alumniSearch = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
    college.name
  )}`;

  return (
    <section className="rounded-xl border border-white/8 bg-white p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-semibold text-[#1A1A1A] flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#CC3D2E]" aria-hidden />
            Where graduates go
          </h2>
          <p className="text-xs text-[#6B6B6B] mt-1">
            Companies that recruit on campus, and a way to find people who
            studied here.
          </p>
        </div>

        <a
          href={alumniSearch}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-[#1A1A1A] bg-transparent hover:bg-[#F0EDE8] border border-[#E5E0D8] rounded-lg px-3 py-2 transition-colors"
        >
          <span>Find alumni on LinkedIn</span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden />
        </a>
      </div>

      <ul className="flex flex-wrap gap-2">
        {college.topRecruiters.map((recruiter) => (
          <li
            key={recruiter}
            className="text-xs text-[#1A1A1A] rounded-lg border border-white/8 bg-[#F0EDE8] px-3 py-1.5"
          >
            {recruiter}
          </li>
        ))}
      </ul>

      <p className="mt-5 pt-4 border-t border-white/8 text-xs text-[#6B6B6B]">
        Average package{" "}
        <span className="font-mono text-[#1A1A1A]">
          {college.avgPackage} LPA
        </span>
        , highest{" "}
        <span className="font-mono text-[#1A1A1A]">
          {college.highestPackage} LPA
        </span>
        . Package figures are self-reported by colleges and usually count only
        students who took part in placements.
      </p>
    </section>
  );
}

export default LinkedInSection;
