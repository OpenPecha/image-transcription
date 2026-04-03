import { useTranslation } from 'react-i18next'
import { CheckCircle, ThumbsUp, XCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface UserReportSummaryProps {
  totalCount: number
  agreedCount: number
  rejectionCount: number
  isLoading: boolean
}

export function UserReportSummary({
  totalCount,
  agreedCount,
  rejectionCount,
  isLoading,
}: UserReportSummaryProps) {
  const { t } = useTranslation('admin')

  if (isLoading) {
    return <UserReportSummarySkeleton />
  }

  const stats = [
    {
      icon: CheckCircle,
      value: totalCount,
      label: t('users.report.summary.totalCount'),
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      icon: ThumbsUp,
      value: agreedCount,
      label: t('users.report.summary.agreedCount'),
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      icon: XCircle,
      value: rejectionCount,
      label: t('users.report.summary.rejectionCount'),
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-950/30',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
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
    <div className="grid grid-cols-3 gap-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-4">
          <Skeleton className="h-5 w-5 mb-1" />
          <Skeleton className="h-6 w-12 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  )
}

