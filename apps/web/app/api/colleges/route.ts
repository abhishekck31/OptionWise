import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { predictColleges } from "@/lib/predictors/predictColleges";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const rankRaw = searchParams.get("rank");
  const categoryCode = searchParams.get("categoryCode");
  const rank = rankRaw ? Number(rankRaw) : NaN;

  if (!categoryCode || !Number.isFinite(rank) || rank <= 0) {
    return NextResponse.json(
      { error: "Query params 'rank' (positive number) and 'categoryCode' are required." },
      { status: 400 },
    );
  }

  const city = searchParams.get("city") || undefined;
  const maxFeesInrRaw = searchParams.get("maxFeesInr");
  const maxFeesInr = maxFeesInrRaw && Number.isFinite(Number(maxFeesInrRaw)) ? Number(maxFeesInrRaw) : undefined;
  const branchesRaw = searchParams.get("branches");
  const courseCodes = branchesRaw
    ? branchesRaw
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean)
    : undefined;

  const predictions = await predictColleges(prisma, {
    rank,
    categoryCode,
    city,
    maxFeesInr,
    courseCodes: courseCodes && courseCodes.length > 0 ? courseCodes : undefined,
  });

  return NextResponse.json({ predictions });
}
