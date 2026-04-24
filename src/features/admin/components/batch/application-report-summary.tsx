import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetApplicationReport } from '../../api/batch'

interface SummaryCardProps {
  label: string
  value: number
  percentage: number
}

function SummaryCard({ label, value, percentage }: SummaryCardProps) {
  return (
    <Card className="rounded-lg border bg-card/60 px-4 py-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{percentage}%</p>
      </div>
    </Card>
  )
}

function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="rounded-lg border px-4 py-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-2 h-7 w-24" />
        </Card>
      ))}
    </div>
  )
}

export function ApplicationReportSummary() {
  const { t } = useTranslation('admin')
  const { data: report, isLoading } = useGetApplicationReport()

  if (isLoading) return <SummaryCardsSkeleton />
  if (!report) return null

  const total = report.total_tasks
  const percentOfTotal = (count: number) => {
    if (total === 0) return 0
    return Math.round((count / total) * 100)
  }

  const cards = [
    { label: t('batches.total'), value: report.total_tasks, percentage: 100 },
    { label: t('batches.states.pending'), value: report.pending, percentage: percentOfTotal(report.pending) },
    {
      label: t('batches.states.half_annotated'),
      value: report.half_annotated,
      percentage: percentOfTotal(report.half_annotated),
    },
    {
      label: t('batches.states.annotated'),
      value: report.annotated,
      percentage: percentOfTotal(report.annotated),
    },
    { label: t('batches.states.accepted'), value: report.accepted, percentage: percentOfTotal(report.accepted) },
    { label: t('batches.states.trashed'), value: report.trashed, percentage: percentOfTotal(report.trashed) },
  ]

  return (
    <div className="space-y-2 pb-4">
      <p className="text-sm text-muted-foreground">{t('batches.allBatchesSummary')}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {cards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
            percentage={card.percentage}
          />
        ))}
      </div>
    </div>
  )
}
