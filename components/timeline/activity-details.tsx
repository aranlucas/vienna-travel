import type { DayActivity } from "@/lib/tripData";

export function ActivityDetails({
  details,
  links,
  label = "Details & sources",
}: ActivityDetailsProps) {
  if (!details?.length && !links?.length) {
    return null;
  }

  return (
    <details className="group mbs-1 text-sm leading-relaxed text-cream-muted">
      <summary className="flex min-h-touch cursor-pointer list-none items-center gap-2 text-xs font-medium text-amber [&::-webkit-details-marker]:hidden">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          className="size-3.5 transition-transform group-open:rotate-90"
          aria-hidden="true"
        >
          <path d="m6 3 5 5-5 5" strokeWidth="1.5" />
        </svg>
        {label}
      </summary>
      {!!details?.length && (
        <ul className="grid list-disc gap-y-2 ps-4 pbe-2">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      )}
      {!!links?.length && (
        <div className="flex flex-wrap gap-x-4 border-bs border-cream-muted/10 pbs-1">
          {links.map((link) => (
            <a
              key={`${link.href}-${link.label}`}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-touch items-center text-xs wrap-break-word text-amber underline underline-offset-4"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </details>
  );
}

type ActivityDetailsProps = Pick<DayActivity, "details" | "links"> & { label?: string };
