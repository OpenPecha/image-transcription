import { useTranslation } from 'react-i18next'
import { CheckCircle, Eye, ShieldCheck, XCircle, LucideIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { UserRole } from '@/types'

interface BaseStat {
  icon: LucideIcon
  value: number
  label: string
  color: string
  bg: string
}

interface StatWithPercentage extends BaseStat {
  percentage: number
}

type Stat = BaseStat | StatWithPercentage

interface UserReportSummaryProps {
  totalCount: number
  approvedCount: number
  reviewedCount: number
  rejectionCount: number
  role: UserRole
  isLoading: boolean
}

export function UserReportSummary({
  totalCount,
  approvedCount,
  reviewedCount,
  rejectionCount,
  role,
  isLoading,
}: UserReportSummaryProps) {
  const { t } = useTranslation('admin')

  if (isLoading) {
    return <UserReportSummarySkeleton role={role} />
  }

  const isAnnotator = role === UserRole.Annotator

  const approvedPercentage = totalCount > 0
    ? Math.round((approvedCount / totalCount) * 100)
    : 0

  const annotatorStats: Stat[] = [
    {
      icon: CheckCircle,
      value: totalCount,
      label: t('users.report.summary.totalCount'),
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      icon: ShieldCheck,
      value: approvedCount,
      percentage: approvedPercentage,
      label: t('users.report.summary.approvedCount'),
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      icon: Eye,
      value: reviewedCount,
      label: t('users.report.summary.reviewedCount'),
      color: 'text-violet-600',
      bg: 'bg-violet-50 dark:bg-violet-950/30',
    },
  ]

  const reviewerStats: Stat[] = [
    {
      icon: CheckCircle,
      value: totalCount,
      label: t('users.report.summary.totalCount'),
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      icon: XCircle,
      value: rejectionCount,
      label: t('users.report.summary.rejectionCount'),
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-950/30',
    },
  ]

  const stats: Stat[] = isAnnotator ? annotatorStats : reviewerStats

  return (
    <div className={`grid gap-3 ${isAnnotator ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex flex-col items-center justify-center rounded-lg p-4 ${stat.bg}`}
        >
          <stat.icon className={`h-5 w-5 ${stat.color} mb-1`} />
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold">{stat.value}</span>
            {'percentage' in stat && (
              <span className={`text-sm font-medium ${stat.color}`}>
                ({(stat as StatWithPercentage).percentage}%)
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground text-center">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

function UserReportSummarySkeleton({ role }: { role: UserRole }) {
  const count = role === UserRole.Annotator ? 3 : 2

  return (
    <div className={`grid gap-3 ${count === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-4">
          <Skeleton className="h-5 w-5 mb-1" />
          <Skeleton className="h-6 w-12 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  )
}
