import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReviewerBadge } from './reviewer-badge'
import type { ScriptType } from '@/types'

type BadgeVariant = 'a' | 'b' | 'ab'

interface ScriptLabelCardProps {
  id: ScriptType
  displayName: string
  badge?: BadgeVariant
  disabled?: boolean
  selected?: boolean
  expanded?: boolean
  hasSubStyles?: boolean
  isGeneral?: boolean
  onSelect: (id: ScriptType) => void
}

export function ScriptLabelCard({
  id,
  displayName,
  badge,
  disabled,
  selected,
  expanded,
  hasSubStyles,
  isGeneral,
  onSelect,
}: ScriptLabelCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(id)}
      className={cn(
        'relative flex items-center justify-center gap-1.5 rounded-lg border-2',
        'px-4 py-3 text-sm font-semibold',
        'transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'active:translate-y-0 active:shadow-sm',
        selected
          ? 'border-primary bg-primary text-primary-foreground shadow-md'
          : isGeneral
            ? 'border-dashed border-border bg-card text-muted-foreground hover:border-primary hover:bg-secondary hover:text-primary'
            : 'border-border bg-card text-foreground hover:border-primary hover:bg-secondary hover:text-primary hover:-translate-y-0.5 hover:shadow-md',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {badge && <ReviewerBadge variant={badge} />}
      <span className="truncate">{displayName}</span>
      {hasSubStyles && (
        expanded
          ? <ChevronUp className="h-3.5 w-3.5 shrink-0 opacity-60" />
          : <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
      )}
    </button>
  )
}
