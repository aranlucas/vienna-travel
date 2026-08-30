import { type Difficulty } from '@/lib/tripData'

type BadgeVariant = 'difficulty' | 'distance' | 'elevation' | 'info' | 'warning'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  difficulty?: Difficulty
  className?: string
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Easy: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  Medium: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
  'Medium-Hard': 'bg-orange-900/40 text-orange-300 border-orange-700/50',
  Hard: 'bg-red-900/40 text-red-300 border-red-700/50',
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  difficulty: '',
  distance: 'bg-slate-800/60 text-cream-muted border-slate-600/40',
  elevation: 'bg-forest-green/30 text-emerald-300 border-forest-green/50',
  info: 'bg-slate-blue/20 text-blue-200 border-slate-blue/30',
  warning: 'bg-red-900/30 text-red-300 border-red-800/40',
}

export function Badge({ children, variant = 'info', difficulty, className = '' }: BadgeProps) {
  const style = difficulty ? DIFFICULTY_STYLES[difficulty] : VARIANT_STYLES[variant]

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-medium border tracking-wide ${style} ${className}`}
    >
      {children}
    </span>
  )
}
