import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/Toast";
import PageWrapper from "@/components/layout/PageWrapper";
import "./globals.css";

/**
 * Inter stands in for Söhne, which is proprietary. next/font self-hosts it and
 * inlines the @font-face, so there is no render-blocking request to Google and
 * no flash of fallback text on first paint.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
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
      className={`scroll-smooth ${inter.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#F7F4F0] font-sans text-[#1A1A1A] antialiased">
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
