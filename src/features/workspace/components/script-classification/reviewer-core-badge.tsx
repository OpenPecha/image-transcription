import { cn } from '@/lib/utils'
import type { ScriptType } from '@/types'

type BadgeVariant = 'a' | 'b' | 'ab'

interface ReviewerCoreBadgeProps {
  variant: BadgeVariant
  hintA?: ScriptType
  hintB?: ScriptType
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  a: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
  b: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
  ab: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
}

function buildHintText(variant: BadgeVariant, hintA?: ScriptType, hintB?: ScriptType): string {
  if (variant === 'ab') {
    if (hintA && hintB && hintA !== hintB) return `A: ${hintA} · B: ${hintB}`
    if (hintA) return `A & B: ${hintA}`
  }
  if (variant === 'a' && hintA) return `A: ${hintA}`
  if (variant === 'b' && hintB) return `B: ${hintB}`
  return ''
}

const variantLabels: Record<BadgeVariant, string> = {
  a: 'A',
  b: 'B',
  ab: 'A · B',
}

export function ReviewerCoreBadge({ variant, hintA, hintB, className }: ReviewerCoreBadgeProps) {
  const hintText = buildHintText(variant, hintA, hintB)

  return (
    <span
      title={hintText || undefined}
      className={cn(
        'absolute -top-2.5 right-2 z-10 flex items-center gap-1 rounded-full border px-2 py-0.5',
        'text-[0.6rem] font-bold uppercase leading-none tracking-wide',
        variantStyles[variant],
        className,
      )}
    >
      {variantLabels[variant]}
    </span>
  )
}
