import { useMemo } from 'react'
import type { Task } from '@/types'
import { TaskStatus } from '@/types'

interface BatchStatusBarProps {
  tasks: Task[]
}

interface StatusSegment {
  status: string
  count: number
  percentage: number
  color: string
  label: string
}

const STATUS_COLORS: Record<string, { bg: string; label: string }> = {
  pending: { bg: 'bg-slate-400', label: 'Pending' },
  in_progress: { bg: 'bg-blue-500', label: 'In Progress' },
  in_final_review: { bg: 'bg-violet-500', label: 'In Final Review' },
  completed: { bg: 'bg-emerald-500', label: 'Completed' },
}

export function BatchStatusBar({ tasks }: BatchStatusBarProps) {
  const segments = useMemo(() => {
    const total = tasks.length
    if (total === 0) return []

    // Group statuses into 4 categories
    const statusCounts = {
      pending: 0,
      in_progress: 0,
      in_final_review: 0,
      completed: 0,
    }

    tasks.forEach((task) => {
      switch (task.status) {
        case TaskStatus.Pending:
          statusCounts.pending++
          break
        case TaskStatus.InProgress:
        case TaskStatus.AwaitingReview:
        case TaskStatus.InReview:
          statusCounts.in_progress++
          break
        case TaskStatus.AwaitingFinalReview:
        case TaskStatus.FinalReview:
          statusCounts.in_final_review++
          break
        case TaskStatus.Completed:
          statusCounts.completed++
          break
        case TaskStatus.Rejected:
          // Count rejected as in_progress since it needs rework
          statusCounts.in_progress++
          break
      }
    })

    const result: StatusSegment[] = []

    Object.entries(statusCounts).forEach(([status, count]) => {
      if (count > 0) {
        const percentage = Math.round((count / total) * 100)
        result.push({
          status,
          count,
          percentage,
          color: STATUS_COLORS[status].bg,
          label: STATUS_COLORS[status].label,
        })
      }
    })

    return result
  }, [tasks])

  if (tasks.length === 0) {
    return (
      <div className="h-6 rounded-md bg-muted flex items-center justify-center">
        <span className="text-xs text-muted-foreground">No tasks</span>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      {/* Progress bar */}
      <div className="flex h-6 w-full overflow-hidden rounded-md bg-muted">
        {segments.map((segment) => (
          <div
            key={segment.status}
            className={`${segment.color} flex items-center justify-center transition-all duration-300`}
            style={{ width: `${segment.percentage}%` }}
            title={`${segment.label}: ${segment.count} (${segment.percentage}%)`}
          >
            {segment.percentage >= 12 && (
              <span className="text-xs font-medium text-white">
                {segment.percentage}%
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((segment) => (
          <div key={segment.status} className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-sm ${segment.color}`} />
            <span className="text-xs text-muted-foreground">
              {segment.label}: {segment.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

