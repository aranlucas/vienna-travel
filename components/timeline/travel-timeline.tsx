"use client";

import { DAYS } from "@/lib/data/itinerary";
import { flushSync } from "react-dom";
import { TripProgressControl } from "@/components/planning/trip-progress";
import { useTripProgress } from "@/components/planning/trip-progress-context";
import { ActivityDetails } from "./activity-details";
import { useMemo, useState } from "react";
import type { DayPlan } from "@/lib/tripData";
import type { TimelineEvent, TimelineEventType } from "@/lib/timeline-events";

// ── Icon components ──

const daysByDate = new Map<string, DayPlan>(Object.entries(DAYS));

function FlightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth={1.8}>
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

function HotelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth={1.8}>
      <path d="M3 21V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14" />
      <path d="M9 21V13h6v8" />
      <path d="M3 21h18" />
    </svg>
  );
}

function TrainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth={1.8}>
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <circle cx="8.5" cy="15.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1" fill="currentColor" />
      <path d="M6 19l-2 3" />
      <path d="M18 19l2 3" />
    </svg>
  );
}

function LayoverIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth={1.8}>
      <path d="M5 17h14v-5H5v5zM7 19a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM17 19a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
      <path d="M5 12l2-5h10l2 5" />
    </svg>
  );
}

function HikeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth={1.8}>
      <path d="M13 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="currentColor" />
      <path d="M7 21l3-9 2.5 2 4.5-5" />
      <path d="M10 12l-3-3 7-4" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  );
}

function getEventIcon(type: TimelineEventType) {
  switch (type) {
    case "flight":
      return <FlightIcon />;
    case "layover":
      return <LayoverIcon />;
    case "hotel-checkin":
    case "hotel-checkout":
      return <HotelIcon />;
    case "train":
      return <TrainIcon />;
    case "drive":
      return <CarIcon />;
    case "hike":
      return <HikeIcon />;
    case "activity":
      return <ActivityIcon />;
  }

  throw new Error(`Unknown timeline event type: ${String(type)}`);
}

function getEventAccent(type: TimelineEventType): string {
  switch (type) {
    case "flight":
      return "border-blue-400/40 bg-blue-400/10 text-blue-300";
    case "layover":
      return "border-cream-muted/20 bg-cream-muted/5 text-cream-muted";
    case "hotel-checkin":
      return "border-emerald-400/40 bg-emerald-400/10 text-emerald-300";
    case "hotel-checkout":
      return "border-amber/40 bg-amber/10 text-amber";
    case "train":
      return "border-purple-400/40 bg-purple-400/10 text-purple-300";
    case "drive":
      return "border-orange-400/40 bg-orange-400/10 text-orange-300";
    case "hike":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
    case "activity":
      return "border-cyan-400/40 bg-cyan-400/10 text-cyan-300";
  }

  throw new Error(`Unknown timeline event type: ${String(type)}`);
}

function getDotColor(type: TimelineEventType): string {
  switch (type) {
    case "flight":
      return "bg-blue-400";
    case "layover":
      return "bg-cream-muted/50";
    case "hotel-checkin":
      return "bg-emerald-400";
    case "hotel-checkout":
      return "bg-amber";
    case "train":
      return "bg-purple-400";
    case "drive":
      return "bg-orange-400";
    case "hike":
      return "bg-emerald-500";
    case "activity":
      return "bg-cyan-400";
  }

  throw new Error(`Unknown timeline event type: ${String(type)}`);
}

function getTypeLabel(type: TimelineEventType): string {
  switch (type) {
    case "flight":
      return "Flight";
    case "layover":
      return "Layover";
    case "hotel-checkin":
      return "Check In";
    case "hotel-checkout":
      return "Check Out";
    case "train":
      return "Train";
    case "drive":
      return "Drive";
    case "hike":
      return "Hike";
    case "activity":
      return "Activity";
  }

  throw new Error(`Unknown timeline event type: ${String(type)}`);
}

function formatSortTime(sortTime: number): string {
  const normalizedMinutes = ((sortTime % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  const ampm = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

function parseTimeInput(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}

function getViennaNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Vienna",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    date: `${value("year")}-${value("month")}-${value("day")}`,
    time: `${value("hour")}:${value("minute")}`,
  };
}

// ── Event card ──

function TimelineCard({ event, isLast }: TimelineCardProps) {
  const accent = getEventAccent(event.type);

  return (
    <div
      id={`timeline-event-${event.id}`}
      className="grid scroll-mbs-28 grid-cols-timeline-mobile sm:grid-cols-timeline-desktop"
    >
      <div className="pe-1 pbs-4 text-end">
        <p className="text-caption leading-4 font-semibold text-cream-muted tabular-nums sm:text-xs">
          {event.timeLabel ?? formatSortTime(event.sortTime)}
        </p>
      </div>
      <div className="relative flex justify-center" aria-hidden="true">
        {!isLast && (
          <div className="absolute inset-bs-6 -inset-be-timeline-tail w-px bg-cream-muted/20" />
        )}
        <div
          className={`relative mbs-5 size-2.5 shrink-0 rounded-full ring-4 ring-dark-surface ${getDotColor(event.type)}`}
        />
      </div>
      <article className="mbe-3 min-w-0 rounded-xl border border-cream-muted/15 bg-dark-card px-4 py-3 shadow-sm">
        <div className="mbe-1.5 flex items-center gap-2">
          <span
            className={`inline-flex size-7 shrink-0 items-center justify-center rounded-md ${accent}`}
          >
            {getEventIcon(event.type)}
          </span>
          <span className="text-caption-small font-semibold tracking-widest text-cream-muted uppercase">
            {getTypeLabel(event.type)}
          </span>
        </div>
        <h3 className="text-body-fixed leading-snug font-semibold wrap-break-word text-cream sm:text-base">
          {event.title}
        </h3>
        {event.subtitle && (
          <p className="mbs-1 text-xs leading-relaxed text-cream-muted sm:text-sm">
            {event.subtitle}
          </p>
        )}
        {event.location && (
          <p className="mbs-1 text-xs leading-relaxed text-cream-muted/80">{event.location}</p>
        )}
        <ActivityDetails details={event.details} links={event.links} />
      </article>
    </div>
  );
}

function TimelineSummary({ events }: TimelineSummaryProps) {
  const flights = events.filter((e) => e.type === "flight").length;
  const hotels = events.filter((e) => e.type === "hotel-checkin").length;
  const trains = events.filter((e) => e.type === "train").length;
  const drives = events.filter((e) => e.type === "drive").length;

  const items = [
    { label: "Events", value: events.length },
    { label: "Flights", value: flights },
    { label: "Hotels", value: hotels },
    { label: "Trains", value: trains },
    { label: "Drives", value: drives },
  ];

  return (
    <div className="mbe-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-forest-green/35 bg-dark-surface/60 px-3 py-2"
        >
          <p className="text-caption-small tracking-eyebrow text-cream-muted/70 uppercase">
            {item.label}
          </p>
          <p className="text-lg font-semibold text-cream">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function DateHeader({ label }: DateHeaderProps) {
  return (
    <div className="sticky inset-bs-16 z-10 mbe-3 border-y border-cream-muted/15 bg-dark-surface/95 py-3 backdrop-blur-sm">
      <h2 className="text-sm font-semibold tracking-wide text-cream">{label}</h2>
    </div>
  );
}

const FILTER_OPTIONS: TimelineFilterOption[] = [
  { type: "all", label: "All" },
  { type: "flight", label: "Flights" },
  { type: "layover", label: "Layovers" },
  { type: "hotel-checkin", label: "Hotels" },
  { type: "train", label: "Trains" },
  { type: "drive", label: "Drives" },
  { type: "hike", label: "Hikes" },
  { type: "activity", label: "Activities" },
];

interface TravelTimelineProps {
  events: TimelineEvent[];
}

export function TravelTimeline({ events }: TravelTimelineProps) {
  const { today, showPast, setShowPast } = useTripProgress();
  const [filter, setFilter] = useState<TimelineEventType | "all">("all");
  const viennaNow = useMemo(() => getViennaNow(), []);
  const todayIso = viennaNow.date;
  const currentMinutes = parseTimeInput(viennaNow.time);

  const nextEvent = useMemo(
    () =>
      events.find(
        (event) =>
          event.date > todayIso || (event.date === todayIso && event.sortTime >= currentMinutes),
      ),
    [events, todayIso, currentMinutes],
  );

  const [jumpDate, setJumpDate] = useState(viennaNow.date);
  const [jumpTime, setJumpTime] = useState(viennaNow.time);

  const typeFiltered =
    filter === "all"
      ? events
      : events.filter((e) => {
          if (filter === "hotel-checkin") {
            return e.type === "hotel-checkin" || e.type === "hotel-checkout";
          }

          return e.type === filter;
        });

  const filtered = typeFiltered.filter((event) => showPast || event.date >= today);

  const jumpToTime = (date = jumpDate, time = jumpTime) => {
    const targetMinutes = parseTimeInput(time);

    const target =
      typeFiltered.find(
        (event) => event.date > date || (event.date === date && event.sortTime >= targetMinutes),
      ) ?? typeFiltered.at(-1);

    if (!target) {
      return;
    }

    if (target.date < today) {
      flushSync(() => setShowPast(true));
    }

    window.requestAnimationFrame(() =>
      document
        .querySelector(`#${CSS.escape(`timeline-event-${target.id}`)}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  const jumpToNow = () => {
    const now = getViennaNow();
    setJumpDate(now.date);
    setJumpTime(now.time);
    jumpToTime(now.date, now.time);
  };

  const grouped: TimelineGroup[] = [];

  for (const event of filtered) {
    const last = grouped.at(-1);

    if (last && last.date === event.date) {
      last.events.push(event);
    } else {
      grouped.push({ date: event.date, label: event.dateLabel, events: [event] });
    }
  }

  const firstEventDate = events[0]?.date;
  const lastEventDate = events.at(-1)?.date;

  return (
    <div className="font-sans">
      <TripProgressControl />
      <TimelineSummary events={events.filter((event) => showPast || event.date >= today)} />

      {nextEvent && (
        <div className="mbe-4 rounded-xl border border-amber/35 bg-amber/5 p-4">
          <div className="text-caption-small font-medium tracking-eyebrow-wide text-amber uppercase">
            Next up
          </div>
          <p className="mbs-1 leading-snug font-medium text-cream">
            {nextEvent.dateLabel} · {nextEvent.title}
          </p>
          {nextEvent.subtitle && (
            <p className="mbs-0.5 text-sm text-cream-muted">{nextEvent.subtitle}</p>
          )}
          <button
            type="button"
            onClick={jumpToNow}
            className="mbs-3 inline-flex min-h-touch items-center rounded-lg border border-amber/40 px-4 py-2 text-sm font-semibold text-amber transition-colors hover:text-cream"
          >
            Jump to now
          </button>
        </div>
      )}

      <div className="mbe-4 rounded-xl border border-forest-green/35 bg-dark-surface/60 p-4">
        <div className="text-caption-small font-medium tracking-eyebrow-wide text-cream-muted/70 uppercase">
          Jump to time
        </div>
        <div className="mbs-3 grid grid-cols-1 gap-2 sm:grid-cols-weather-details">
          <label className="flex flex-col gap-1 text-xs text-cream-muted">
            Date
            <input
              type="date"
              value={jumpDate}
              min={firstEventDate}
              max={lastEventDate}
              onChange={(event) => setJumpDate(event.target.value)}
              className="min-h-touch rounded-lg border border-forest-green/40 bg-dark-surface px-3 py-2 text-sm text-cream transition-colors outline-none focus:border-amber/60"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-cream-muted">
            Time
            <input
              type="time"
              value={jumpTime}
              onChange={(event) => setJumpTime(event.target.value)}
              className="min-h-touch rounded-lg border border-forest-green/40 bg-dark-surface px-3 py-2 text-sm text-cream transition-colors outline-none focus:border-amber/60"
            />
          </label>
          <button
            type="button"
            onClick={() => jumpToTime()}
            className="min-h-touch self-end rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-dark-surface transition-opacity hover:opacity-90"
          >
            Jump
          </button>
        </div>
        <p className="mbs-2 text-xs text-cream-muted/55">
          Defaults to the current time in Vienna and jumps to the first visible event at or after
          it.
        </p>
      </div>

      <div className="mbe-8 flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            type="button"
            key={opt.type}
            onClick={() => setFilter(opt.type)}
            className={`min-h-touch min-w-touch rounded-full px-4 py-2 text-xs font-medium tracking-label uppercase transition-colors ${
              filter === opt.type
                ? "bg-amber text-dark-surface"
                : "border border-forest-green/40 text-cream-muted hover:border-amber/40 hover:text-cream"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <nav aria-label="Jump to trip date" className="mbe-6 flex flex-wrap gap-2">
        {grouped.map((group) => (
          <a
            key={group.date}
            href={`#timeline-day-${group.date}`}
            className="inline-flex min-h-touch items-center rounded-lg border border-forest-green/40 px-3 text-sm text-amber"
          >
            Sep {Number(group.date.slice(-2))}
          </a>
        ))}
      </nav>
      <p className="mbe-4 text-sm text-cream-muted">
        Activity times are planning targets. Choose one version of each day; optional alternatives
        are not extra commitments. Hotel windows are shown separately from planned arrivals.
      </p>
      {/* Timeline */}
      {grouped.map((group) => {
        const plan = daysByDate.get(group.date);

        return (
          <div key={group.date} id={`timeline-day-${group.date}`} className="mbe-6 scroll-mbs-24">
            <DateHeader label={group.label} />
            {plan?.recommendation && (
              <div className="mbe-4 rounded-xl border border-amber/30 p-4 text-sm leading-relaxed text-cream">
                <strong className="text-amber">Best experience: </strong>
                {plan.recommendation}
                <ActivityDetails
                  label="Alternative plan"
                  details={plan.alternative ? [plan.alternative] : []}
                />
              </div>
            )}
            <div className="pbe-2">
              {group.events.map((event, eventIndex) => (
                <TimelineCard
                  key={event.id}
                  event={event}
                  isLast={eventIndex === group.events.length - 1}
                />
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="py-12 text-center text-cream-muted/70">
          No upcoming events match this filter. Use “Show past days” to browse earlier events.
        </div>
      )}
    </div>
  );
}

type TimelineCardProps = { event: TimelineEvent; isLast: boolean };

type TimelineSummaryProps = { events: TimelineEvent[] };

type DateHeaderProps = { label: string };

type TimelineFilterOption = { type: TimelineEventType | "all"; label: string };

type TimelineGroup = { date: string; label: string; events: TimelineEvent[] };
