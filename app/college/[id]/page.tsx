import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import CollegeDetail from "@/components/CollegeDetail";
import { getCollegeById } from "@/lib/data/colleges";
import { getBranchesWithCutoffs } from "@/lib/data/cutoffs";
import { isBranch, isCategory } from "@/types";
import type { Branch, Category } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const college = getCollegeById(id);

  if (!college) {
    return { title: "College not found" };
  }

  return {
    title: `${college.name} KCET Cutoff 2018-2026`,
    description: `Branch-wise KCET closing ranks for ${college.name} (${college.shortName}), ${college.city} — KEA code ${college.kea_code}. Published 2026 round 1-3 cutoffs with the earlier years projected.`,
  };
}

export default async function CollegeDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = await searchParams;

  const college = getCollegeById(id);
  if (!college) notFound();

  const branchParam = first(query.branch);
  const categoryParam = first(query.category);

  // Fall back to a branch this college actually has a cutoff for, so a stale
  // link never lands on an empty chart.
  const published = getBranchesWithCutoffs(college.id);
  const branch: Branch =
    branchParam && isBranch(branchParam) && published.includes(branchParam)
      ? branchParam
      : (published[0] ?? "CSE");

  const category: Category =
    categoryParam && isCategory(categoryParam) ? categoryParam : "GM";

  return (
    <PageWrapper>
      <CollegeDetail
        college={college}
        initialBranch={branch}
        initialCategory={category}
      />
    </PageWrapper>
  );
}
