import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, ArrowRight, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BatchStatsFooterProps {
  batchId: string
  trashedCount: number
  finalizedPercentage: number
}

export function BatchStatsFooter({
  batchId,
  trashedCount,
  finalizedPercentage,
}: BatchStatsFooterProps) {
  const { t } = useTranslation('admin')

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-sm">
      {/* Left side: Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">{t('batches.status')}:</span>
          <span
            className={cn(
              'font-semibold',
              finalizedPercentage === 100
                ? 'text-emerald-600'
                : finalizedPercentage > 50
                  ? 'text-cyan-600'
                  : 'text-slate-600'
            )}
          >
            {t('batches.finalized', { percentage: finalizedPercentage })}
          </span>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        {/* Trashed count - links to trashed filter */}
        {trashedCount > 0 && (
          <Link
            to={`/admin/batch/${batchId}?state=trashed`}
            className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 transition-colors"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="font-medium">{t('batches.trashed', { count: trashedCount })}</span>
          </Link>
        )}

        {/* View Tasks - links to all tasks */}
        <Link
          to={`/admin/batch/${batchId}`}
          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          {t('batches.viewTasks')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
