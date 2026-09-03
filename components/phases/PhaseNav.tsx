'use client'

import { startTransition, useState } from 'react'
import { TRIP_DATA } from '@/lib/tripData'

interface PhaseNavProps {
  panels: React.ReactNode[]
}

export function PhaseNav({ panels }: PhaseNavProps) {
  const phases = TRIP_DATA.phases
  const [activeIndex, setActiveIndex] = useState(0)
  const activePanel = panels[activeIndex] ?? null

  return (
    <div>
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Trip phases"
        className="flex overflow-x-auto gap-1 pb-1 mb-8 border-b border-forest-green/30 scrollbar-hide"
      >
        {phases.map((phase, i) => {
          const isActive = i === activeIndex
          return (
            <button
              key={phase.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                if (i === activeIndex) return
                startTransition(() => setActiveIndex(i))
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
    </div>
  )
}
