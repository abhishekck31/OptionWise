import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope, Noto_Sans_Kannada } from "next/font/google";
import { SampleDataBanner } from "@/components/SampleDataBanner";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "OptionWise",
  description: "Smarter option entry, from rank to college.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${manrope.variable} ${notoSansKannada.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <SampleDataBanner />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
