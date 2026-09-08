'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const TripProgressContext = createContext({
  today: '',
  showPast: false,
  setShowPast: (_value: boolean) => {},
})

export function TripProgressProvider({ children }: { children: ReactNode }) {
  const [today, setToday] = useState('')
  const [showPast, setShowPast] = useState(false)
  useEffect(() => {
    const refresh = () =>
      setToday(
        new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Europe/Vienna',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(new Date()),
      )
    refresh()
    const interval = window.setInterval(refresh, 60_000)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])
  return (
    <TripProgressContext.Provider value={{ today, showPast, setShowPast }}>{children}</TripProgressContext.Provider>
  )
}

export const useTripProgress = () => useContext(TripProgressContext)

export function TripProgressControl() {
  const { today, showPast, setShowPast } = useTripProgress()
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-forest-green/30 bg-dark-card p-4 text-sm">
      <div>
        <p className="font-semibold text-cream">{showPast ? 'Full trip' : 'Today & ahead'}</p>
        <p className="mt-1 text-cream-muted">Past days are tucked away automatically. Today stays visible.</p>
      </div>
      <button
        type="button"
        disabled={!today}
        aria-pressed={showPast}
        onClick={() => setShowPast(!showPast)}
        className="min-h-[44px] rounded-lg border border-amber/40 px-4 text-amber"
      >
        {showPast ? 'Hide past days' : 'Show past days'}
      </button>
    </div>
  )
}

/** Keep dated content recoverable through the shared full-trip control. */
export function ThroughDate({ date, children }: { date: string; children: ReactNode }) {
  const { today, showPast } = useTripProgress()
  return !today || showPast || date >= today ? <>{children}</> : null
}
