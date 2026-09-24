import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Bricolage_Grotesque, Manrope, Noto_Sans_Kannada } from "next/font/google";
import { routing, type Locale } from "@/i18n/routing";
import { SampleDataBanner } from "@/components/SampleDataBanner";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ToastProvider } from "@/components/ui/toast";
import "../globals.css";

// SampleDataBanner reads live DB state on every request — opt out of static
// prerendering so `next build` doesn't need a reachable DB.
export const dynamic = "force-dynamic";

// SPEC.md "UI / UX" -> Type: Bricolage Grotesque for headings, Manrope for UI/body,
// Noto Sans Kannada for Kannada.
const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const notoSansKannada = Noto_Sans_Kannada({
  variable: "--font-noto-sans-kannada",
  subsets: ["kannada"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "OptionWise",
  description: "Smarter option entry, from rank to college.",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  if (!(routing.locales as readonly string[]).includes(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${bricolageGrotesque.variable} ${manrope.variable} ${notoSansKannada.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <SampleDataBanner locale={locale} />
            <div className="flex justify-end px-6 pt-4">
              <LanguageSwitcher />
            </div>
            {children}
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
