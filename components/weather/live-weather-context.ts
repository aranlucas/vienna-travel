"use client";

import { createContext, useContext, useMemo } from "react";
import type { DayPlan } from "@/lib/tripData";

type LiveWeatherContextValue = {
  days: DayPlan[];
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refreshedAt: string | null;
  refresh: () => Promise<void>;
};

export const LiveWeatherContext = createContext<LiveWeatherContextValue | null>(null);

export function useLiveWeather(): LiveWeatherContextValue {
  const context = useContext(LiveWeatherContext);

  if (!context) {
    throw new Error("useLiveWeather must be used inside LiveWeatherPage.");
  }

  return context;
}

export function useLiveWeatherDays(staticDays: DayPlan[]): DayPlan[] {
  const { days } = useLiveWeather();

  return useMemo(() => {
    const liveByDate = new Map(days.map((day) => [day.isoDate, day]));

    return staticDays.map((day) => liveByDate.get(day.isoDate) ?? day);
  }, [days, staticDays]);
}
