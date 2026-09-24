import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { HomeView } from "@/components/HomeView";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "HomePage" });

  return (
    <HomeView title={t("title")} tagline={t("tagline")} devNotice={t("devNotice")} footer={t("footer")} />
  );
}
