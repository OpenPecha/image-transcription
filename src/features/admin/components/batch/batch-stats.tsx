import { Skeleton } from '@/components/ui/skeleton'
import type { BatchReport } from '@/types'
import { StackedProgressBar } from './progress-bar'
import { BatchStatsFooter } from './batch-stats-footer'
import { getFinalizedPercentage } from './progress-bar'

interface BatchStatsProps {
  batchId: string
  report: BatchReport | undefined
  isLoading: boolean
}

export function BatchStats({ batchId, report, isLoading }: BatchStatsProps) {
  if (isLoading) {
    return <BatchStatsSkeleton />
  }

  if (!report) {
    return (
      <div className="text-sm text-muted-foreground py-2">
        Failed to load batch statistics
      </div>
    )
  }

  // Handle empty batch
  if (report.total_tasks === 0) {
    return (
      <div className="flex items-center justify-center h-16 bg-slate-50 rounded-lg text-sm text-muted-foreground border border-dashed">
        No tasks in this batch
      </div>
    )
  }

  const finalizedPercentage = getFinalizedPercentage(report)

  return (
    <div className="space-y-3">
      <StackedProgressBar report={report} />
      
      <BatchStatsFooter
        batchId={batchId}
        trashedCount={report.trashed}
        finalizedPercentage={finalizedPercentage}
      />
    </div>
  )
}

function BatchStatsSkeleton() {
  return (
    <div className="space-y-3">
      {/* Progress bar skeleton */}
      <Skeleton className="h-8 w-full rounded-lg" />
      
      {/* Legend skeleton */}
      <div className="flex gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-16" />
        ))}
      </div>
      
      {/* Footer skeleton */}
      <div className="flex justify-between pt-2">
        <div className="flex gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
  )
}
