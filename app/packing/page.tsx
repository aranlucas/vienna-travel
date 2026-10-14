import Link from "next/link";
import type { Metadata } from "next";
import { PackingSection } from "@/components/packing/packing-section";
import { PACKING_PLAN } from "@/lib/data/packing";

export const metadata: Metadata = {
  title: "Packing Guide | Austria Expedition 2026",
  description:
    "Carry-on packing guide for the Austria trip, including clothing, mountain layers and essentials.",
};

export default function PackingPage() {
  return (
    <main className="min-h-screen">
      <header className="sticky inset-bs-0 z-20 border-be border-forest-green/30 bg-dark-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <Link
            href="/"
            className="inline-flex min-h-touch items-center text-sm text-amber hover:text-cream"
          >
            ← Trip Overview
          </Link>
          <h1 className="font-serif-display text-xl text-cream">Packing Guide</h1>
          <Link
            href="/timeline"
            className="inline-flex min-h-touch items-center text-sm text-amber hover:text-cream"
          >
            Timeline →
          </Link>
        </div>
      </header>
      <div className="pbs-8">
        <PackingSection packing={PACKING_PLAN} />
      </div>
    </main>
  );
}
