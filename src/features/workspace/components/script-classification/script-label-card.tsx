import { cn } from '@/lib/utils'
import { ReviewerBadge } from './reviewer-badge'
import type { ScriptType } from '@/types'

type BadgeVariant = 'a' | 'b' | 'ab'

interface ScriptLabelCardProps {
  label: ScriptType
  badge?: BadgeVariant
  disabled?: boolean
  onSelect: (label: ScriptType) => void
}

export function ScriptLabelCard({
  label,
  badge,
  disabled,
  onSelect,
}: ScriptLabelCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(label)}
      className={cn(
        'relative flex items-center justify-center rounded-lg border-2 border-border',
        'bg-card px-4 py-3.5 text-sm font-semibold text-foreground',
        'transition-all duration-150',
        'hover:border-primary hover:bg-secondary hover:text-primary',
        'hover:-translate-y-0.5 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'active:translate-y-0 active:shadow-sm',
        disabled && 'pointer-events-none opacity-50',
      )}
    >
      {badge && <ReviewerBadge variant={badge} />}
      {label}
    </button>
  )
}
