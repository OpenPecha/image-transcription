import { cn } from '@/lib/utils'

type BadgeVariant = 'a' | 'b' | 'ab'

interface ReviewerBadgeProps {
  variant: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  a: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
  b: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
  ab: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
}

const variantLabels: Record<BadgeVariant, string> = {
  a: 'A',
  b: 'B',
  ab: 'A & B',
}

export function ReviewerBadge({ variant, className }: ReviewerBadgeProps) {
  return (
    <span
      className={cn(
        'absolute -top-2.5 right-2 z-10 rounded-full border px-2 py-0.5',
        'text-[0.6rem] font-bold uppercase leading-none tracking-wide',
        variantStyles[variant],
        className,
      )}
    >
      {variantLabels[variant]}
    </span>
  )
}
