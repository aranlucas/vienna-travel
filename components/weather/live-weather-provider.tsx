"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { DayPlan } from "@/lib/tripData";
import { WEATHER_REFRESH_MS } from "@/lib/weather-refresh";
import { fetchWeatherSnapshot } from "@/lib/weather-client";
import { applyWeatherState, mergeWeatherSnapshot, type WeatherState } from "@/lib/weather-snapshot";

const FOCUS_REFRESH_AGE_MS = WEATHER_REFRESH_MS;

import { LiveWeatherContext } from "./live-weather-context";

export function LiveWeatherPage({ children, staticDays }: LiveWeatherPageProps) {
  const [weatherState, setWeatherState] = useState<WeatherState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const inFlightRef = useRef<Promise<void> | null>(null);
  const requestController = useRef<AbortController | null>(null);
  const stateRef = useRef<WeatherState | null>(null);
  const staticDaysRef = useRef(staticDays);
  useEffect(() => {
    staticDaysRef.current = staticDays;
  }, [staticDays]);

  const refresh = useCallback(async () => {
    if (inFlightRef.current) {
      return inFlightRef.current;
    }

    const controller = new AbortController();
    requestController.current = controller;

    const request = (async () => {
      setIsRefreshing(true);

      try {
        const payload = await fetchWeatherSnapshot(controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        const next = mergeWeatherSnapshot(staticDaysRef.current, stateRef.current, payload);
        stateRef.current = next;
        setWeatherState(next);
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        const next = mergeWeatherSnapshot(staticDaysRef.current, stateRef.current, null);
        stateRef.current = next;
        setWeatherState(next);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    })();

    inFlightRef.current = request;

    try {
      await request;
    } finally {
      if (inFlightRef.current === request) {
        inFlightRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    const refreshSafely = () => {
      refresh().catch(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
    };

    refreshSafely();

    const interval = window.setInterval(refreshSafely, WEATHER_REFRESH_MS);

    const refreshIfStale = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      const lastSuccess = stateRef.current?.refreshedAt;

      if (Date.now() - (lastSuccess ? Date.parse(lastSuccess) : 0) >= FOCUS_REFRESH_AGE_MS) {
        refreshSafely();
      }
    };

    const refreshWhenOnline = refreshSafely;

    document.addEventListener("visibilitychange", refreshIfStale);
    window.addEventListener("online", refreshWhenOnline);

    return () => {
      requestController.current?.abort();
      inFlightRef.current = null;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshIfStale);
      window.removeEventListener("online", refreshWhenOnline);
    };
  }, [refresh]);

  const days = useMemo(
    () => applyWeatherState(staticDays, weatherState),
    [staticDays, weatherState],
  );

  const error = weatherState?.error ?? null;
  const refreshedAt = weatherState?.refreshedAt ?? null;

  const value = useMemo(
    () => ({ days, error, isLoading, isRefreshing, refreshedAt, refresh }),
    [days, error, isLoading, isRefreshing, refreshedAt, refresh],
  );

  return (
    <LiveWeatherContext.Provider value={value}>
      <main className="min-h-screen">{children}</main>
    </LiveWeatherContext.Provider>
  );
}

type LiveWeatherPageProps = {
  children: ReactNode;
  staticDays: DayPlan[];
};
