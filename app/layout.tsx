import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/Toast";
import PageWrapper from "@/components/layout/PageWrapper";
import "./globals.css";

/**
 * DM Sans carries the interface; DM Mono, drawn to match it, carries every
 * rank and figure. next/font self-hosts both and inlines the @font-face, so
 * there is no render-blocking request to Google and no flash of fallback text.
 *
 * DM Sans is loaded as the variable font with its optical-size axis, so the
 * display headline and the 11px captions each get the cut drawn for that size.
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KCET Predictor 2026 — Find Your Engineering College | Karnataka",
    template: "%s | KCET Predictor",
  },
  description:
    "Work out your KCET 50:50 rank from board and entrance marks, see which colleges that rank actually reaches across all three rounds, and order your KEA option entry before the deadline.",
  keywords: [
    "KCET Predictor",
    "KCET Rank Predictor 2026",
    "KEA Option Entry",
    "KCET Cutoff 2026",
    "RVCE Cutoff",
    "BMSCE Cutoff",
    "Karnataka Engineering",
  ],
  authors: [{ name: "KCET Predictor" }],
};

export const viewport: Viewport = {
  themeColor: "#F7F4F0",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${dmSans.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      {/* pt matches the fixed navbar's 52px, so nothing starts underneath it. */}
      <body className="min-h-screen bg-[#F7F4F0] pt-[52px] font-sans text-[#1A1A1A] antialiased">
        <NuqsAdapter>
          <TooltipProvider delayDuration={150}>
            <ToastProvider>
              <PageWrapper>{children}</PageWrapper>
            </ToastProvider>
          </TooltipProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
