"use client";

import { ActivityDetails } from "./activity-details";
import { useTripProgress } from "@/components/planning/trip-progress-context";
import type { DayActivity, DayPlan } from "@/lib/tripData";
import { useLiveWeatherDays } from "@/components/weather/live-weather-context";

interface DayEntryProps {
  day: DayPlan;
  index: number;
}

function ActivityBadge({ activity }: ActivityBadgeProps) {
  if (activity.highlight === "important") {
    return (
      <span className="shrink-0 rounded-full border border-amber/30 bg-amber/10 px-2 py-0.5 text-caption-small font-medium tracking-eyebrow text-amber uppercase">
        Important
      </span>
    );
  }

  if (activity.highlight === "fun") {
    return (
      <span className="shrink-0 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-caption-small font-medium tracking-eyebrow text-emerald-300 uppercase">
        Fun
      </span>
    );
  }

  return null;
}

function DayEntry({ day }: DayEntryProps) {
  return (
    <div className="relative ps-10">
      {/* Dot */}
      <div className="absolute inset-s-0 inset-bs-2 size-4 rounded-full border-2 border-dark-surface bg-amber shadow-lg" />

      <div className="mbe-4 rounded-lg border border-forest-green/30 bg-dark-card p-4">
        <div className="mbe-2">
          <span className="text-sm font-medium tracking-widest text-amber uppercase">
            {day.dayLabel}
          </span>
        </div>
        <h4 className="mbe-3 font-serif-display text-base text-cream">{day.title}</h4>

        {day.recommendation && (
          <p className="mbe-3 text-sm leading-relaxed text-cream">
            <strong className="text-amber">Best experience: </strong>
            {day.recommendation}
          </p>
        )}
        {day.alternative && (
          <ActivityDetails
            details={[day.alternative]}
            links={day.alternativeLinks}
            label="Alternative plan"
          />
        )}

        {day.weather && (
          <div className="mbe-3 rounded-lg border border-slate-blue/30 bg-slate-blue/12 px-3 py-2">
            <div className="text-caption-small font-medium tracking-eyebrow-wide text-blue-200 uppercase">
              {day.weatherStatus === "stale"
                ? "Stale Forecast Weather"
                : day.weatherStatus === "unavailable"
                  ? "Saved Weather Guidance"
                  : day.weatherSource === "forecast"
                    ? "Forecast Weather"
                    : "Typical Weather"}
            </div>
            <div className="mbs-1 text-sm leading-snug text-cream">{day.weather}</div>
            {day.weatherNote && (
              <div className="mbs-1 text-xs leading-relaxed text-cream-muted/80">
                {day.weatherNote}
              </div>
            )}
          </div>
        )}

        {day.carryToday && day.carryToday.length > 0 && (
          <div className="mbe-3 rounded-lg border border-forest-green/25 bg-forest-green/10 px-3 py-2">
            <div className="text-caption-small font-medium tracking-eyebrow-wide text-emerald-300 uppercase">
              What to Carry Today
            </div>
            <div className="mbs-2 flex flex-wrap gap-2">
              {day.carryToday.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-forest-green/30 bg-dark-surface/70 px-2 py-1 text-xs text-cream-muted"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <ul className="grid gap-y-2">
          {day.activities.map((activity) => (
            <li
              key={`${activity.time ?? "flexible"}-${activity.title}`}
              className="flex gap-2 text-base text-cream-muted"
            >
              <span className="mbs-0.5 shrink-0 text-amber/50">›</span>
              <div className="grid min-w-0 gap-y-1">
                <span className="block leading-snug">
                  {activity.time ? `${activity.time} — ${activity.title}` : activity.title}
                </span>
                <ActivityBadge activity={activity} />
                <ActivityDetails details={activity.details} links={activity.links} />
              </div>
            </li>
          ))}
        </ul>

        {day.accommodation && (
          <div className="mbs-3 flex items-center gap-2 border-bs border-forest-green/20 pbs-3 text-sm text-cream-muted/70">
            <span>🛏</span>
            <span>{day.accommodation}</span>
          </div>
        )}

        {day.notes && (
          <div className="mbs-2 text-sm leading-relaxed text-amber/70 italic">{day.notes}</div>
        )}
      </div>
    </div>
  );
}

interface DayTimelineProps {
  days: DayPlan[];
}

export function DayTimeline({ days }: DayTimelineProps) {
  const liveDays = useLiveWeatherDays(days);
  const { today, showPast } = useTripProgress();

  if (!liveDays.length) {
    return null;
  }

  return (
    <div className="relative">
      {/* Vertical connecting line */}
      <div className="absolute inset-y-4 inset-s-timeline-marker w-px bg-amber/25" />
      <div className="grid gap-y-0">
        {liveDays
          .filter((day) => showPast || day.isoDate >= today)
          .map((day, i) => (
            <DayEntry key={day.date} day={day} index={i} />
          ))}
      </div>
    </div>
  );
}

type ActivityBadgeProps = { activity: DayActivity };
