import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SampleDataBanner } from "@/components/SampleDataBanner";
import "./globals.css";

// SampleDataBanner reads live DB state on every request — opt out of static
// prerendering so `next build` doesn't need a reachable DB.
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SampleDataBanner />
        {children}
      </body>
    </html>
  );
}
