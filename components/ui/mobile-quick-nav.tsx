import Link from "next/link";
import { HOME_SECTION_IDS } from "@/lib/home-anchors";

const LINKS = [
  { label: "Plan", href: `#${HOME_SECTION_IDS.itinerary}` },
  { label: "Stays", href: `#${HOME_SECTION_IDS.bookingStatus}` },
  { label: "Timeline", href: "/timeline" },
  { label: "Pack", href: "/packing" },
  { label: "Weather", href: `#${HOME_SECTION_IDS.weatherOutlook}` },
] as const;

export function MobileQuickNav() {
  return (
    <nav
      aria-label="Trip sections"
      className="fixed inset-x-0 inset-be-0 z-40 border-bs border-forest-green/30 bg-dark-surface/95 backdrop-blur-sm md:hidden"
    >
      <div className="grid grid-cols-5">
        {LINKS.map((link) =>
          link.href.startsWith("/") ? (
            <Link
              key={link.label}
              href={link.href}
              className="flex min-h-touch-large items-center justify-center text-xs font-semibold tracking-label-tight text-cream-muted uppercase transition-colors hover:text-cream"
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={link.label}
              href={link.href}
              className="flex min-h-touch-large items-center justify-center text-xs font-semibold tracking-label-tight text-cream-muted uppercase transition-colors hover:text-cream"
            >
              {link.label}
            </a>
          ),
        )}
      </div>
    </nav>
  );
}
