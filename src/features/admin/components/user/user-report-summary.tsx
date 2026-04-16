import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Type, Layers, XCircle, AlignLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { isLineAlignmentContribution } from '@/types'
import type { UserContribution } from '@/types'
import type { LucideIcon } from 'lucide-react'

interface UserReportSummaryProps {
  contributions: UserContribution[]
  isLoading: boolean
}

interface StatCard {
  icon: LucideIcon
  value: string | number
  label: string
  color: string
  bg: string
}

export function UserReportSummary({ contributions, isLoading }: UserReportSummaryProps) {
  const { t } = useTranslation('admin')

  const stats = useMemo(() => {
    if (contributions.length === 0) return []

    const tasksCompleted = contributions.length
    const batchesWorked = new Set(contributions.map((item) => item.batch_name)).size
    const rejectionCount = contributions.reduce((sum, item) => sum + item.rejection_count, 0)

    const hasTranscription = contributions.some((c) => !isLineAlignmentContribution(c))
    const hasLineAlignment = contributions.some((c) => isLineAlignmentContribution(c))

    const result: StatCard[] = [
      {
        icon: CheckCircle,
        value: tasksCompleted,
        label: t('users.report.summary.tasksCompleted'),
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      },
    ]

    if (hasTranscription) {
      const totalChars = contributions
        .filter((c) => !isLineAlignmentContribution(c))
        .reduce((sum, item) => sum + item.char_diff, 0)

      result.push({
        icon: Type,
        value: totalChars.toLocaleString(),
        label: t('users.report.summary.totalChars'),
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
      })
    }

    if (hasLineAlignment) {
      const totalLines = contributions
        .filter(isLineAlignmentContribution)
        .reduce((sum, item) => sum + (item.line_count ?? 0), 0)

      result.push({
        icon: AlignLeft,
        value: totalLines.toLocaleString(),
        label: t('users.report.summary.totalLines'),
        color: 'text-violet-600',
        bg: 'bg-violet-50 dark:bg-violet-950/30',
      })
    }

    result.push(
      {
        icon: Layers,
        value: batchesWorked,
        label: t('users.report.summary.batchesWorked'),
        color: 'text-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-950/30',
      },
      {
        icon: XCircle,
        value: rejectionCount,
        label: t('users.report.summary.rejectionCount'),
        color: 'text-red-600',
        bg: 'bg-red-50 dark:bg-red-950/30',
      },
    )

    return result
  }, [contributions, t])

  if (isLoading) {
    return <UserReportSummarySkeleton />
  }

  return (
    <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex flex-col items-center justify-center rounded-lg p-4 ${stat.bg}`}
        >
          <stat.icon className={`h-5 w-5 ${stat.color} mb-1`} />
          <span className="text-xl font-bold">{stat.value}</span>
          <span className="text-xs text-muted-foreground text-center">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

function UserReportSummarySkeleton() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-4">
          <Skeleton className="h-5 w-5 mb-1" />
          <Skeleton className="h-6 w-12 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  )
}

