"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { DayPlan } from "@/lib/tripData";
import { HOME_SECTION_IDS } from "@/lib/home-anchors";
import { getWeatherCode, isRainWeatherCode, isSnowOrStormWeatherCode } from "@/lib/weather-codes";
import { WEATHER_REFRESH_MINUTES } from "@/lib/weather-refresh";
import { useLiveWeather } from "@/components/weather/live-weather-context";
import { useTripProgress } from "@/components/planning/trip-progress-context";

type Unit = "F" | "C";

type HintTone = "cold" | "wet" | "hot" | "alert";

const UNIT_STORAGE_KEY = "weather-unit";

const UNIT_EVENT = "weather-unit-change";

function subscribeToUnit(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(UNIT_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(UNIT_EVENT, onChange);
  };
}

function getUnitSnapshot(): Unit {
  return window.localStorage.getItem(UNIT_STORAGE_KEY) === "C" ? "C" : "F";
}

function getServerUnit(): Unit {
  return "F";
}

const HINT_STYLES: Record<HintTone, string> = {
  cold: "border-slate-blue/40 bg-slate-blue/20 text-blue-200",
  wet: "border-forest-green/40 bg-forest-green/25 text-emerald-200",
  hot: "border-amber/35 bg-amber/12 text-amber",
  alert: "border-red-400/40 bg-red-400/10 text-red-300",
};

function toDisplay(celsius: number, unit: Unit): number {
  return unit === "C" ? Math.round(celsius) : Math.round((celsius * 9) / 5 + 32);
}

function formatWind(kph: number, unit: Unit): string {
  return unit === "C" ? `${Math.round(kph)} km/h` : `${Math.round(kph / 1.609344)} mph`;
}

function formatPrecip(mm: number, unit: Unit): string {
  return unit === "C" ? `${mm.toFixed(1)} mm` : `${(mm / 25.4).toFixed(2)} in`;
}

function formatLocalTime(isoLocal?: string): string {
  const match = isoLocal?.match(/T(\d{2}):(\d{2})/);

  if (!match) {
    return "—";
  }

  const hour = Number(match[1]);
  const suffix = hour >= 12 ? "PM" : "AM";

  return `${hour % 12 || 12}:${match[2]} ${suffix}`;
}

function formatHours(hours?: number): string {
  if (hours == null) {
    return "—";
  }

  if (hours < 0.1) {
    return "Dry signal";
  }

  return `${hours.toFixed(hours < 10 ? 1 : 0)} hr${hours === 1 ? "" : "s"}`;
}

function formatRefreshTime(isoDateTime: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Europe/Vienna",
    timeZoneName: "short",
  }).format(new Date(isoDateTime));
}

function compassDirection(degrees?: number): string {
  if (degrees == null) {
    return "";
  }

  const points = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

  return points[Math.round(degrees / 45) % points.length];
}

function conditionEmoji(code?: number): string {
  return getWeatherCode(code)?.emoji ?? "🗓️";
}

function conditionLabel(code?: number): string {
  if (code == null) {
    return "Early-autumn mix";
  }

  return getWeatherCode(code)?.label ?? "Mixed conditions";
}

function locationLabel(day: DayPlan): string {
  const name = day.weatherLocation?.name ?? "Forecast point";
  const elevation = day.weatherLocation?.elevationM;

  return elevation == null ? name : `${name} · ${elevation.toLocaleString("en-US")} m`;
}

type ForecastHorizon = { label: string; className: string };

function forecastHorizon(day: DayPlan): ForecastHorizon {
  if (day.weatherStatus === "stale" || day.weatherStatus === "unavailable") {
    return {
      label: day.weatherStatus === "stale" ? "Stale forecast" : "Unavailable",
      className: "border-amber/30 bg-amber/10 text-amber",
    };
  }

  const lead = day.weatherForecastLeadDays;

  if (lead == null) {
    return {
      label: "Forecast",
      className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    };
  }

  if (lead <= 3) {
    return {
      label: lead === 0 ? "Today" : `${lead}-day short range`,
      className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    };
  }

  if (lead <= 7) {
    return {
      label: `${lead}-day planning range`,
      className: "border-slate-blue/40 bg-slate-blue/20 text-blue-200",
    };
  }

  return {
    label: `${lead}-day early outlook`,
    className: "border-amber/30 bg-amber/10 text-amber",
  };
}

function forecastHigh(day: DayPlan): number {
  return day.weatherExposure?.highC ?? day.weatherHighC ?? -99;
}

function forecastLow(day: DayPlan): number {
  return day.weatherExposure?.lowC ?? day.weatherLowC ?? 99;
}

function forecastFeelsHigh(day: DayPlan): number | undefined {
  return day.weatherExposure?.feelsHighC ?? day.weatherFeelsHighC;
}

function forecastFeelsLow(day: DayPlan): number | undefined {
  return day.weatherExposure?.feelsLowC ?? day.weatherFeelsLowC;
}

function forecastPrecipPct(day: DayPlan): number | undefined {
  return day.weatherExposure?.precipPct ?? day.weatherPrecipPct;
}

function forecastPrecipMm(day: DayPlan): number {
  return day.weatherExposure?.precipMm ?? day.weatherPrecipMm ?? 0;
}

function forecastWindKph(day: DayPlan): number | undefined {
  return day.weatherExposure?.windKph ?? day.weatherWindKph;
}

function forecastGustKph(day: DayPlan): number | undefined {
  return day.weatherExposure?.gustKph ?? day.weatherGustKph;
}

function formatHour(hour: number): string {
  if (hour === 0) {
    return "12 AM";
  }

  if (hour === 12) {
    return "12 PM";
  }

  return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
}

function gearHints(day: DayPlan): GearHint[] {
  const hints: GearHint[] = [];
  const isAlpine = (day.weatherLocation?.elevationM ?? 0) >= 1500;
  const coldestFeels = forecastFeelsLow(day) ?? forecastLow(day);
  const precipPct = forecastPrecipPct(day);
  const precipMm = forecastPrecipMm(day);
  const gustKph = forecastGustKph(day);
  const hasRainCode = isRainWeatherCode(day.weatherCode);

  if (isSnowOrStormWeatherCode(day.weatherCode)) {
    hints.push({ label: "Recheck trail or lift status", tone: "alert" });
  }

  if (isAlpine && (day.weatherForecastLeadDays ?? 0) > 7) {
    hints.push({ label: "Recheck mountain forecast 24–48h ahead", tone: "alert" });
  }

  if (isAlpine && (precipMm >= 5 || (gustKph ?? 0) >= 50)) {
    hints.push({ label: "Keep the lower-elevation fallback ready", tone: "alert" });
  }

  if ((gustKph ?? 0) >= 40) {
    hints.push({ label: "Exposed-route wind check", tone: "alert" });
  }

  if (coldestFeels <= 7) {
    hints.push({ label: "Insulation + hat + gloves", tone: "cold" });
  }

  if (
    hasRainCode ||
    (precipPct ?? 0) >= 35 ||
    precipMm >= 1 ||
    (!day.weatherExposure && (day.weatherPrecipHours ?? 0) >= 2)
  ) {
    hints.push({ label: "Waterproof shell + pack liner", tone: "wet" });
  }

  if (isAlpine && (hasRainCode || precipMm >= 2)) {
    hints.push({ label: "Pack rain pants", tone: "wet" });
  }

  if (forecastHigh(day) >= 27) {
    hints.push({ label: "Breathable layer + extra water", tone: "hot" });
  }

  if (isAlpine || (day.weatherUvMax ?? 0) >= 5 || forecastHigh(day) >= 25) {
    hints.push({ label: "Sunscreen + sunglasses", tone: "hot" });
  }

  return hints;
}

function WeatherMetric({ label, value, detail }: WeatherMetricProps) {
  return (
    <div className="min-w-0 rounded-lg border border-forest-green/15 bg-dark-surface/35 px-3 py-2.5">
      <div className="text-caption-tiny tracking-eyebrow text-cream-muted/55 uppercase">
        {label}
      </div>
      <div className="mbs-1 text-sm leading-tight font-medium text-cream">{value}</div>
      {detail && (
        <div className="mbs-0.5 text-caption leading-snug text-cream-muted/65">{detail}</div>
      )}
    </div>
  );
}

const changeUnit = (next: Unit) => {
  window.localStorage.setItem(UNIT_STORAGE_KEY, next);
  window.dispatchEvent(new Event(UNIT_EVENT));
};

export function TripWeatherOutlook() {
  const { today, showPast } = useTripProgress();
  const { days, error, isLoading, isRefreshing, refreshedAt, refresh } = useLiveWeather();
  const unit = useSyncExternalStore(subscribeToUnit, getUnitSnapshot, getServerUnit);

  const orderedDays = useMemo(
    () =>
      days
        .filter((day) => showPast || day.isoDate >= today)
        .toSorted((a, b) => a.isoDate.localeCompare(b.isoDate)),
    [days, today, showPast],
  );

  const unitButton = (value: Unit) => (
    <button
      type="button"
      onClick={() => changeUnit(value)}
      className={`min-h-touch min-w-touch rounded-md px-4 py-2 text-xs font-medium transition-colors ${
        unit === value
          ? "bg-amber text-dark-surface"
          : "border border-slate-blue/40 text-cream-muted hover:text-cream"
      }`}
      aria-pressed={unit === value}
    >
      °{value}
    </button>
  );

  return (
    <section
      id={HOME_SECTION_IDS.weatherOutlook}
      className="mx-auto max-w-6xl scroll-mbs-20 px-6 pbe-20"
    >
      <div className="mbe-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-amber/60" />
          <span className="text-sm font-medium tracking-hero text-amber uppercase">
            Weather Outlook
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="flex items-center gap-1.5" aria-label="Weather units">
            {unitButton("F")}
            {unitButton("C")}
          </div>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={isRefreshing}
            className="min-h-touch rounded-md border border-amber/35 px-4 py-2 text-xs font-medium text-amber transition-colors hover:border-amber/60 hover:text-cream disabled:cursor-wait disabled:opacity-60"
          >
            {isRefreshing ? "Checking…" : "Check for update"}
          </button>
        </div>
      </div>

      <details className="mbe-5 max-w-3xl rounded-lg border border-forest-green/25 bg-dark-card px-4 py-3">
        <summary className="flex min-h-touch cursor-pointer list-none items-center text-sm text-cream-muted">
          How to read this outlook — forecasts load separately, recheck mountains 24–48h ahead ▾
        </summary>
        <p className="mbs-2 text-sm leading-relaxed text-cream-muted">
          Forecasts load separately from the static itinerary. The browser checks every{" "}
          {WEATHER_REFRESH_MINUTES} minutes while this page is open, and the server shares that
          forecast cache so open tabs do not multiply Open-Meteo requests. Exposed itinerary days
          use explicit summit or hut elevations instead of a warmer valley proxy. Outlooks beyond
          seven days are useful for choosing gear, but exact rain, wind, trail, and lift decisions
          still need a 24–48 hour recheck.
        </p>
      </details>

      <div className="mbe-5 flex items-center gap-2 text-xs" aria-live="polite">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 font-medium ${
            error
              ? "border-amber/25 bg-amber/10 text-amber"
              : "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {isLoading
            ? "Loading the latest forecast…"
            : refreshedAt
              ? `Last forecast ${formatRefreshTime(refreshedAt)}`
              : "Seasonal guidance loaded"}
        </span>
        {error && <span className="text-cream-muted/70">{error}</span>}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {orderedDays.map((day) => {
          const isLive = day.weatherSource === "forecast" && day.weatherHighC != null;
          const hints = isLive ? gearHints(day) : [];
          const windDirection = compassDirection(day.weatherWindDirectionDeg);
          const horizon = forecastHorizon(day);
          const highC = forecastHigh(day);
          const lowC = forecastLow(day);
          const feelsHighC = forecastFeelsHigh(day);
          const feelsLowC = forecastFeelsLow(day);
          const precipPct = forecastPrecipPct(day);
          const precipMm = forecastPrecipMm(day);
          const windKph = forecastWindKph(day);
          const gustKph = forecastGustKph(day);

          return (
            <details
              key={day.isoDate}
              className={`rounded-xl border px-4 py-3 ${
                isLive
                  ? "bg-dark-card border-slate-blue/30"
                  : "bg-dark-card/50 border-forest-green/15"
              }`}
            >
              <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="text-xl leading-none" aria-hidden="true">
                    {isLive ? conditionEmoji(day.weatherCode) : "⏳"}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate leading-tight font-medium text-cream">
                      {day.date} · {day.title}
                    </div>
                    <div className="mbs-0.5 truncate text-xs text-cream-muted/75">
                      {isLive
                        ? `${toDisplay(highC, unit)}° / ${toDisplay(lowC, unit)}° · ${conditionLabel(day.weatherCode)}`
                        : (day.weather ?? "Seasonal guidance")}
                    </div>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-caption-small font-medium tracking-label-compact uppercase ${horizon.className}`}
                >
                  {horizon.label}
                </span>
              </summary>

              <div className="mbs-3 border-bs border-forest-green/15 pbs-3">
                <div className="text-caption text-cream-muted/70">{locationLabel(day)}</div>

                {isLive ? (
                  <>
                    <div className="mbs-2 text-xs text-cream-muted">
                      {day.weatherExposure
                        ? `Full-day signal · ${conditionLabel(day.weatherCode)}`
                        : conditionLabel(day.weatherCode)}
                      {day.weatherExposure && (
                        <span className="text-blue-200/80">
                          {" "}
                          · {day.weatherExposure.label} ·{" "}
                          {formatHour(day.weatherExposure.startHour)}–
                          {formatHour(day.weatherExposure.endHour)}
                        </span>
                      )}
                    </div>

                    <div className="mbs-3 grid grid-cols-2 gap-2">
                      <WeatherMetric
                        label="Feels like"
                        value={
                          feelsHighC == null
                            ? "—"
                            : `${toDisplay(feelsHighC, unit)}° / ${toDisplay(feelsLowC ?? feelsHighC, unit)}°`
                        }
                        detail={
                          day.weatherExposure
                            ? "Across the planned window"
                            : "Afternoon / overnight"
                        }
                      />
                      <WeatherMetric
                        label="Precipitation"
                        value={`${precipPct == null ? "Chance n/a" : `${precipPct}%`} · ${formatPrecip(precipMm, unit)}`}
                        detail={
                          day.weatherExposure
                            ? "Planned-window total"
                            : formatHours(day.weatherPrecipHours)
                        }
                      />
                      <WeatherMetric
                        label="Wind"
                        value={
                          windKph == null
                            ? "—"
                            : `${day.weatherExposure || !windDirection ? "" : `${windDirection} `}${formatWind(windKph, unit)}`
                        }
                        detail={
                          day.weatherExposure
                            ? gustKph == null
                              ? "Peak in planned window"
                              : `Peak window · gusts ${formatWind(gustKph, unit)}`
                            : gustKph == null
                              ? undefined
                              : `Gusts ${formatWind(gustKph, unit)}`
                        }
                      />
                      <WeatherMetric
                        label="UV max"
                        value={day.weatherUvMax == null ? "—" : day.weatherUvMax.toFixed(1)}
                        detail={
                          (day.weatherUvMax ?? 0) >= 5 ||
                          (day.weatherLocation?.elevationM ?? 0) >= 1500
                            ? "Sun protection needed"
                            : "Lower exposure"
                        }
                      />
                      {day.weatherExposure &&
                        day.weatherHighC != null &&
                        day.weatherLowC != null && (
                          <WeatherMetric
                            label="Full-day range"
                            value={`${toDisplay(day.weatherHighC, unit)}° / ${toDisplay(day.weatherLowC, unit)}°`}
                            detail="Includes hours outside your visit"
                          />
                        )}
                      <div className={day.weatherExposure ? "" : "col-span-2"}>
                        <WeatherMetric
                          label="Local daylight"
                          value={`${formatLocalTime(day.weatherSunrise)} – ${formatLocalTime(day.weatherSunset)}`}
                          detail="Sunrise to sunset at the forecast location"
                        />
                      </div>
                    </div>

                    {day.weatherStatus === "stale" && (
                      <p className="mbs-3 text-xs leading-relaxed text-amber">
                        Last forecast is stale
                        {day.weatherFetchedAt
                          ? `, fetched ${formatRefreshTime(day.weatherFetchedAt)}`
                          : ""}
                        . Recheck before relying on it.
                      </p>
                    )}
                    {day.weatherNote && (
                      <p className="mbs-3 text-xs leading-relaxed text-cream-muted/80">
                        {day.weatherNote}
                      </p>
                    )}

                    {hints.length > 0 && (
                      <div className="mbs-3 flex flex-wrap gap-1.5 border-bs border-forest-green/15 pbs-3">
                        {hints.map((hint) => (
                          <span
                            key={hint.label}
                            className={`rounded-full border px-2 py-0.5 text-caption-small font-medium ${HINT_STYLES[hint.tone]}`}
                          >
                            {hint.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mbs-3 flex flex-1 flex-col">
                    <div className="text-caption-small tracking-eyebrow text-cream-muted/50 uppercase">
                      Typical September pattern
                    </div>
                    {day.weather && (
                      <p className="mbs-2 text-sm leading-relaxed text-cream-muted">
                        {day.weather}
                      </p>
                    )}
                    {day.weatherStatus === "stale" && (
                      <p className="mbs-3 text-xs leading-relaxed text-amber">
                        Last forecast is stale
                        {day.weatherFetchedAt
                          ? `, fetched ${formatRefreshTime(day.weatherFetchedAt)}`
                          : ""}
                        . Recheck before relying on it.
                      </p>
                    )}
                    {day.weatherNote && (
                      <p className="mbs-2 text-xs leading-relaxed text-cream-muted/75">
                        {day.weatherNote}
                      </p>
                    )}
                    {day.weatherUnlocks && (
                      <div className="mbs-auto pbs-4">
                        <span className="inline-flex rounded-full border border-amber/25 bg-amber/10 px-2 py-0.5 text-caption-small font-medium tracking-label-medium text-amber uppercase">
                          {day.weatherUnlocks}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </div>

      <p className="mbs-4 text-xs leading-relaxed text-cream-muted/55">
        Forecast data by{" "}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer"
          className="text-amber/80 underline decoration-amber/30 underline-offset-4 hover:text-amber"
        >
          Open-Meteo
        </a>{" "}
        using national weather services and Copernicus datasets. Daily values describe the listed
        coordinate; mountain entries use an explicit summit or hut elevation but remain model
        guidance rather than an on-site observation.
      </p>
    </section>
  );
}

type GearHint = { label: string; tone: HintTone };

type WeatherMetricProps = {
  label: string;
  value: string;
  detail?: string;
};
