import Link from 'next/link'
import { HOME_SECTION_IDS } from '@/lib/homeAnchors'

const LINKS = [
  { label: 'Fly', href: `#${HOME_SECTION_IDS.flight}` },
  { label: 'Stays', href: `#${HOME_SECTION_IDS.bookingStatus}` },
  { label: 'Timeline', href: '/timeline' },
  { label: 'Pack', href: `#${HOME_SECTION_IDS.packing}` },
  { label: 'Weather', href: `#${HOME_SECTION_IDS.weatherOutlook}` },
] as const

export function MobileQuickNav() {
  return (
    <nav
      aria-label="Trip sections"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-forest-green/30 bg-dark-surface/95 backdrop-blur-sm md:hidden"
    >
      <div className="grid grid-cols-5">
        {LINKS.map((link) =>
          link.href.startsWith('/') ? (
            <Link
              key={link.label}
              href={link.href}
              className="flex min-h-[52px] items-center justify-center text-xs font-semibold uppercase tracking-[0.12em] text-cream-muted transition-colors hover:text-cream"
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={link.label}
              href={link.href}
              className="flex min-h-[52px] items-center justify-center text-xs font-semibold uppercase tracking-[0.12em] text-cream-muted transition-colors hover:text-cream"
            >
              {link.label}
            </a>
          ),
        )}
      </div>
    </nav>
  )
}
