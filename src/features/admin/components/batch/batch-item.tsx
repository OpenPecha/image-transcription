import { useState } from 'react'
import { ChevronDown, Calendar, Users } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useGetBatchReport } from '../../api/batch'
import { BatchStats } from './batch-stats'
import type { Batch } from '@/types'

interface BatchItemProps {
  batch: Batch
}

export function BatchItem({ batch }: BatchItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Fetch report only when expanded
  const { data: report, isLoading: isLoadingReport } = useGetBatchReport(
    batch.id,
    isExpanded
  )

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  const formattedDate = new Date(batch.created).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Card className="overflow-hidden transition-all duration-200">
      <CardHeader className="p-0">
        <button
          onClick={toggleExpand}
          className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{batch.name}</h3>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {batch.group_name}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {report?.total_tasks && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {report.total_tasks} tasks
              </span>
            )}
            <ChevronDown
              className={cn(
                'h-5 w-5 text-muted-foreground transition-transform duration-200',
                isExpanded && 'rotate-180'
              )}
            />
          </div>
        </button>
      </CardHeader>

      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <CardContent className="pt-0 pb-4 px-4 border-t">
            <div className="pt-4">
              <BatchStats batchId={batch.id} report={report} isLoading={isLoadingReport} />
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

// Skeleton for loading state
export function BatchItemSkeleton() {
  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-48" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <Skeleton className="h-5 w-5" />
        </div>
      </CardHeader>
    </Card>
  )
}

