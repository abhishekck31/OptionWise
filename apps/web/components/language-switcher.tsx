"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Chip } from "@/components/ui/chip";

/** SPEC.md "UI / UX": "English and Kannada, switchable anywhere." Keeps the current
 * page, only swaps the locale. */
export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div role="group" aria-label={t("label")} className="flex items-center gap-2">
      {routing.locales.map((loc) => (
        <Chip
          key={loc}
          selected={loc === locale}
          onClick={() => router.replace(pathname, { locale: loc })}
        >
          {t(loc)}
        </Chip>
      ))}
    </div>
  );
}
