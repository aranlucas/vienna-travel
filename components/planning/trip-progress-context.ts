"use client";

import { createContext, useContext } from "react";

export const TripProgressContext = createContext({
  today: "",
  showPast: false,
  setShowPast: (_value: boolean) => {},
});

export const useTripProgress = () => useContext(TripProgressContext);
