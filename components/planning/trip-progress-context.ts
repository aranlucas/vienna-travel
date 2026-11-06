"use client";

import type { tripClock } from "@/lib/trip-clock";
import { createContext, useContext } from "react";

export const TripProgressContext = createContext<TripProgressState>({
  today: "",
  clock: null,
  showPast: false,
  setShowPast: (_value: boolean) => {},
});

export const useTripProgress = () => useContext(TripProgressContext);

type TripProgressState = {
  today: string;
  clock: ReturnType<typeof tripClock> | null;
  showPast: boolean;
  setShowPast: (value: boolean) => void;
};
