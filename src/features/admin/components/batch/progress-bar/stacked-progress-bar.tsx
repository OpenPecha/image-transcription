import { useEffect, useState } from 'react'
import type { BatchReport } from '@/types'
import { cn } from '@/lib/utils'
import { ProgressSegment } from './progress-segment'
import { DEFAULT_PROGRESS_BAR_CONFIG } from './progress-bar.types'
import {
  buildWorkflowSegments,
  buildTrashedSegment,
  shouldShowLabel,
} from './progress-bar.utils'

interface StackedProgressBarProps {
  report: BatchReport
  className?: string
}

export function StackedProgressBar({ report, className }: StackedProgressBarProps) {
  const [isAnimated, setIsAnimated] = useState(false)

  // Trigger animation after mount
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsAnimated(true)
    })
    return () => cancelAnimationFrame(timer)
  }, [])

  const workflowSegments = buildWorkflowSegments(report)
  const trashedSegment = buildTrashedSegment(report)

  // Handle empty state (all tasks trashed or no tasks)
  const hasWorkflowTasks = workflowSegments.length > 0
  const hasTrashedTasks = trashedSegment !== null

  if (!hasWorkflowTasks && !hasTrashedTasks) {
    return (
      <div className="flex items-center justify-center h-8 bg-slate-100 rounded-lg text-sm text-muted-foreground">
        No tasks in this batch
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
        {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {workflowSegments.map((segment) => (
          <div key={segment.status} className="flex items-center gap-1.5">
            <div className={cn('w-2.5 h-2.5 rounded-sm', segment.barColor)} />
            <span>{segment.label}</span>
          </div>
        ))}
        {hasTrashedTasks && (
          <div className="flex items-center gap-1.5">
            <div className={cn('w-2.5 h-2.5 rounded-sm progress-segment-hatched', trashedSegment.barColor)} />
            <span>{trashedSegment.label}</span>
          </div>
        )}
      </div>
      <div
        className={cn(
          'flex h-8 w-full overflow-hidden rounded-lg',
          DEFAULT_PROGRESS_BAR_CONFIG.barHeight
        )}
        role="group"
        aria-label="Batch progress"
      >
        {/* Workflow segments container */}
        {hasWorkflowTasks && (
          <div className="flex flex-1 gap-0.5">
            {workflowSegments.map((segment) => (
              <ProgressSegment
                key={segment.status}
                segment={segment}
                showLabel={shouldShowLabel(
                  segment.percentage,
                  DEFAULT_PROGRESS_BAR_CONFIG.labelThreshold
                )}
                isAnimated={isAnimated}
              />
            ))}
          </div>
        )}

        {/* Separator and Trashed segment */}
        {hasTrashedTasks && (
          <>
            <div className="w-1 bg-transparent" aria-hidden="true" />
            <div className="flex" style={{ width: `${trashedSegment.percentage}%`, minWidth: '32px' }}>
              <ProgressSegment
                segment={trashedSegment}
                showLabel={shouldShowLabel(
                  trashedSegment.percentage,
                  DEFAULT_PROGRESS_BAR_CONFIG.labelThreshold
                )}
                isAnimated={isAnimated}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

