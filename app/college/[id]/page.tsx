import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import CollegeDetail from "@/components/CollegeDetail";
import { getCollegeById } from "@/lib/data/colleges";
import { keaCollege } from "@/lib/kea/meta";
import type { KeaCollegeFile } from "@/lib/kea/types";
import { isBranch } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

/**
 * A college is addressed by its app slug when it has a profile, or by its KEA
 * code (/college/E123) when it only appears in KEA's older reports.
 */
function resolve(id: string) {
  const entry = keaCollege(id);
  const college = getCollegeById(id) ?? (entry?.appId ? getCollegeById(entry.appId) : undefined) ?? null;
  const code = entry?.code ?? college?.kea_code ?? null;
  return { entry, college, code };
}

/** One college's ten years of cut-offs, read on the server; only this college reaches the browser. */
async function loadHistory(code: string): Promise<KeaCollegeFile | null> {
  if (!/^E\d{3}$/.test(code)) return null;
  try {
    const mod = await import(`@/data/kea/colleges/${code}.json`);
    return mod.default as KeaCollegeFile;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { entry, college } = resolve(id);
  const name = college?.name ?? entry?.name;
  if (!name) return { title: "College not found" };
  const years = entry?.years ?? [];
  return {
    title: `${name} KCET Cut-offs ${years.at(-1) ?? ""}–${years[0] ?? ""}`,
    description: `Year-wise KCET closing ranks for ${name} (KEA code ${entry?.code ?? college?.kea_code}), every round and category, from KEA's official allotment reports.`,
  };
}

export default async function CollegeDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  const { college, code } = resolve(id);
  if (!code) notFound();

  const history = await loadHistory(code);
  if (!history || history.years.length === 0) notFound();

  const branch = first(query.branch);
  const category = first(query.category);

  return (
    <PageWrapper className="py-0 md:py-0">
      <CollegeDetail
        history={history}
        college={college}
        initialCategory={category ?? "GM"}
        initialBranch={branch && isBranch(branch) ? branch : "CSE"}
      />
    </PageWrapper>
  );
}
