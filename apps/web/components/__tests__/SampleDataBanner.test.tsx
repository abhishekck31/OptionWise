// @vitest-environment jsdom
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { prisma } from "@/lib/db";
import { SampleDataBanner } from "@/components/SampleDataBanner";

async function truncateAll() {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "Cutoff", "CollegeCourse", "PlacementStat", "College", "Course",
      "Message", "Report", "AuditLog", "AlumniProfile", "User" RESTART IDENTITY CASCADE;`,
  );
}

beforeAll(async () => {
  await truncateAll();
});

afterEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("SampleDataBanner", () => {
  it("renders nothing when no sample data is in use", async () => {
    // Doesn't reach the getTranslations() call at all in this branch — see
    // SampleDataBannerView.test.tsx for the rendered-content coverage (next-intl's
    // server-only getTranslations can't run under Vitest; see AUDIT.md's i18n notes).
    const { container } = render(await SampleDataBanner({ locale: "en" }));
    expect(container).toBeEmptyDOMElement();
  });
});
