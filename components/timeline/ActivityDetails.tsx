import type { DayActivity } from '@/lib/tripData'

export function ActivityDetails({
  details,
  links,
  label = 'Details & sources',
}: Pick<DayActivity, 'details' | 'links'> & { label?: string }) {
  if (!details?.length && !links?.length) return null
  return (
    <details className="group mt-1 text-sm leading-relaxed text-cream-muted">
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 text-xs font-medium text-amber [&::-webkit-details-marker]:hidden">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          className="h-3.5 w-3.5 transition-transform group-open:rotate-90"
          aria-hidden="true"
        >
          <path d="m6 3 5 5-5 5" strokeWidth="1.5" />
        </svg>
        {label}
      </summary>
      {!!details?.length && (
        <ul className="list-disc space-y-2 pl-4 pb-2">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      )}
      {!!links?.length && (
        <div className="flex flex-wrap gap-x-4 border-t border-cream-muted/10 pt-1">
          {links.map((link, index) => (
            <a
              key={`${link.href}-${index}`}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center text-xs text-amber underline underline-offset-4 break-words"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </details>
  )
}
