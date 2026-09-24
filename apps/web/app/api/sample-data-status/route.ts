import { NextResponse } from "next/server";
import { getSampleDataStatus } from "@/lib/sampleDataStatus";

export async function GET() {
  const status = await getSampleDataStatus();
  return NextResponse.json(status);
}
