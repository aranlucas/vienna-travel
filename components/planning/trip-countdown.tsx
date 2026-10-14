"use client";

import { useEffect, useMemo, useState } from "react";

interface TripCountdownProps {
  targetIso: string;
  label: string;
}

interface RemainingTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isElapsed: boolean;
}

function getRemainingTime(targetDate: Date, nowMs: number): RemainingTime {
  const diffMs = targetDate.getTime() - nowMs;

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isElapsed: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isElapsed: false };
}

export function TripCountdown({ targetIso, label }: TripCountdownProps) {
  const targetDate = useMemo(() => new Date(targetIso), [targetIso]);
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setNowMs(Date.now()), 0);

    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, []);

  const remaining = useMemo(
    () => (nowMs === null ? null : getRemainingTime(targetDate, nowMs)),
    [targetDate, nowMs],
  );

  return (
    <div className="rounded-lg border border-amber/25 bg-amber/5 px-4 py-3 text-sm">
      <div className="text-caption-small font-medium tracking-eyebrow-wide text-amber/80 uppercase">
        Countdown
      </div>
      <div className="mbs-2 font-semibold text-cream">{label}</div>
      {remaining?.isElapsed ? (
        <p className="mbs-1 text-emerald-400">Trip started — have an amazing time ✈️</p>
      ) : (
        <div className="mbs-2 grid grid-cols-4 gap-2 text-center">
          {[
            { value: remaining?.days ?? "—", unit: "Days" },
            { value: remaining?.hours ?? "—", unit: "Hours" },
            { value: remaining?.minutes ?? "—", unit: "Minutes" },
            { value: remaining?.seconds ?? "—", unit: "Seconds" },
          ].map((item) => (
            <div
              key={item.unit}
              className="rounded-md border border-forest-green/20 bg-dark-card p-2"
            >
              <div className="text-lg font-semibold text-cream tabular-nums">{item.value}</div>
              <div className="text-caption-small tracking-label-wide text-cream-muted/70 uppercase">
                {item.unit}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
