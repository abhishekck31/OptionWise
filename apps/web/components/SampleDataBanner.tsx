import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSampleDataStatus } from "@/lib/sampleDataStatus";
import { SampleDataBannerView } from "@/components/SampleDataBannerView";

export async function SampleDataBanner({ locale }: { locale: Locale }) {
  const { isSampleDataInUse } = await getSampleDataStatus();

  if (!isSampleDataInUse) {
    return null;
  }

  const t = await getTranslations({ locale, namespace: "SampleDataBanner" });

  return <SampleDataBannerView title={t("title")} description={t("description")} />;
}
