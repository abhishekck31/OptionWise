import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import CategoryBadge from "@/components/shared/CategoryBadge";
import type { Category, College } from "@/types";

export interface CollegeHeaderProps {
  college: College;
  category: Category;
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Identity and the handful of facts worth knowing before the cutoffs. */
export function CollegeHeader({ college, category }: CollegeHeaderProps) {
  const facts = [
    { label: "KEA fee, yearly", value: inr(college.annualFee) },
    { label: "Average package", value: `${college.avgPackage} LPA` },
    { label: "Highest package", value: `${college.highestPackage} LPA` },
    { label: "Sanctioned seats", value: college.totalSeats.toLocaleString("en-IN") },
  ];

  return (
    <header className="border-b border-white/8 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-10">
        <Link
          href="/predict/college"
          className="inline-flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
          Back to matches
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-transparent border border-white/8 text-[#1A1A1A]">
                {college.kea_code}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-transparent border border-white/8 text-[#6B6B6B]">
                {college.affiliation}
              </span>
              {college.nirfRank !== null && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F5E8E6] text-[#CC3D2E] border border-[#E8C4BF]">
                  NIRF #{college.nirfRank}
                </span>
              )}
              {college.naacGrade && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  NAAC {college.naacGrade}
                </span>
              )}
              <CategoryBadge category={category} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#1A1A1A] mb-3">
              {college.name}
            </h1>

            <div className="flex items-center gap-2.5 text-sm text-[#6B6B6B] flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#9B9B9B]" aria-hidden />
                {college.city}, {college.district}
              </span>
              <span className="text-[#9B9B9B]">&bull;</span>
              <span>{college.region}</span>
              <span className="text-[#9B9B9B]">&bull;</span>
              <span>{college.type}</span>
              <span className="text-[#9B9B9B]">&bull;</span>
              <span>Since {college.established}</span>
              {college.website && (
                <>
                  <span className="text-[#9B9B9B]">&bull;</span>
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#CC3D2E] hover:text-[#CC3D2E] transition-colors"
                  >
                    Website
                    <ExternalLink className="w-3 h-3" aria-hidden />
                  </a>
                </>
              )}
            </div>
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-lg border border-white/8 bg-[#F0EDE8] px-3.5 py-2.5"
              >
                <dt className="text-[11px] text-[#6B6B6B]">{fact.label}</dt>
                <dd className="font-mono text-sm font-semibold text-[#1A1A1A] mt-0.5">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </header>
  );
}

export default CollegeHeader;
