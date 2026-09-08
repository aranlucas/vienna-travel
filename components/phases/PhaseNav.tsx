'use client'

import { startTransition, useState } from 'react'
import { TRIP_DATA } from '@/lib/tripData'
import { useTripProgress } from '@/components/planning/TripProgress'

interface PhaseNavProps {
  panels: React.ReactNode[]
}

export function PhaseNav({ panels }: PhaseNavProps) {
  const phases = TRIP_DATA.phases
  const { today, showPast } = useTripProgress()
  const visiblePhases = phases
    .map((phase, index) => ({ phase, index }))
    .filter(({ phase }) => showPast || phase.days.some((day) => day.isoDate >= today))
  const currentIndex = phases.findIndex((phase) => phase.days.some((day) => day.isoDate === today))
  const [selection, setSelection] = useState<{ index: number; date: string } | null>(null)
  const selectedIndex = selection?.date === today ? selection.index : null
  const activeIndex = visiblePhases.some(({ index }) => index === selectedIndex)
    ? selectedIndex!
    : currentIndex >= 0
      ? currentIndex
      : (visiblePhases[0]?.index ?? -1)
  const activePanel = panels[activeIndex] ?? null

  return (
    <div>
      {currentIndex >= 0 && activeIndex !== currentIndex && (
        <button
          type="button"
          onClick={() => setSelection(null)}
          className="mb-3 min-h-[44px] rounded-lg border border-amber/40 px-4 text-sm text-amber"
        >
          Back to today · {phases[currentIndex].title}
        </button>
      )}
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Trip phases"
        className="flex overflow-x-auto gap-1 pb-1 mb-8 border-b border-forest-green/30 scrollbar-hide"
      >
        {visiblePhases.map(({ phase, index: i }) => {
          const isActive = i === activeIndex
          return (
            <button
              key={phase.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                if (i === activeIndex) return
                startTransition(() => setSelection({ index: i, date: today }))
              }}
              className={`flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-t text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 -mb-px ${
                isActive
                  ? 'text-amber border-amber bg-amber/5'
                  : 'text-cream-muted border-transparent hover:text-cream hover:border-forest-green/50'
              }`}
            >
              <span>{phase.emoji}</span>
              <span className="hidden sm:inline">{phase.title}</span>
              <span className="sm:hidden">{phase.title.split(' ')[0]}</span>
              <span className={`text-sm hidden md:inline ${isActive ? 'text-amber/70' : 'text-cream-muted/50'}`}>
                {phase.dates}
              </span>
            </button>
          )
        })}
      </div>

      <div key={phases[activeIndex]?.id ?? activeIndex}>{activePanel}</div>
      {!visiblePhases.length && (
        <p className="text-cream-muted">The trip is complete. Use “Show past days” to browse the itinerary.</p>
      )}
    </div>
  )
}
