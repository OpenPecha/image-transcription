import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScriptStyles } from '@/features/workspace/hooks'
import type { AcceptedScriptTypeCount } from '@/types'

interface ScriptTypeBreakdownProps {
  counts: AcceptedScriptTypeCount[]
  totalAccepted: number
}

export function ScriptTypeBreakdown({ counts, totalAccepted }: ScriptTypeBreakdownProps) {
  const { t } = useTranslation('admin')
  const [isExpanded, setIsExpanded] = useState(false)
  const { getName } = useScriptStyles()

  const maxCount = counts[0]?.count ?? 0
  const visibleCounts = isExpanded ? counts : counts.slice(0, 5)

  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>{t('batches.scriptTypeBreakdown', { count: totalAccepted })}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      <div className="mt-2 space-y-1.5">
        {visibleCounts.map(({ script_type, count }) => {
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0

          return (
            <div key={script_type} className="flex items-center gap-2 text-xs">
              <span className="w-28 shrink-0 truncate text-muted-foreground" title={getName(script_type)}>
                {getName(script_type)}
              </span>
              <div className="flex-1 h-4 bg-muted rounded-sm overflow-hidden">
                <div
                  className="h-full bg-emerald-500/70 rounded-sm transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right tabular-nums font-medium text-foreground">
                {count}
              </span>
            </div>
          )
        })}
      </div>

      {!isExpanded && counts.length > 5 && (
        <button
          onClick={() => setIsExpanded(true)}
          className="mt-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          {t('batches.showAllScriptTypes', { count: counts.length })}
        </button>
      )}
    </div>
  )
}
