import type { Metadata } from "next";
import Hero from "@/components/Hero";

export const metadata: Metadata = {
  title: "KCET Predictor 2026 — Find Your Engineering College | Karnataka",
  description:
    "Estimate your KCET 2026 rank from board and entrance marks, then see every Karnataka engineering college and branch that rank reaches — measured against the closing ranks KEA published for 2026.",
};

export default function HomePage() {
  return <Hero />;
}
