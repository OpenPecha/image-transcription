import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart3, Calendar, Check, FileText, Minus, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetUserContributions } from '../../api/user'
import { UserReportSummary } from './user-report-summary'
import { UserRole, type User, type UserContribution } from '@/types'

interface UserReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
}

function getDefaultDateRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)

  return {
    start_date: start.toISOString().split('T')[0],
    end_date: end.toISOString().split('T')[0],
  }
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function UserReportDialog({ open, onOpenChange, user }: UserReportDialogProps) {
  const { t } = useTranslation('admin')
  const defaultRange = useMemo(() => getDefaultDateRange(), [])

  const [startDate, setStartDate] = useState(defaultRange.start_date)
  const [endDate, setEndDate] = useState(defaultRange.end_date)
  const [appliedFilters, setAppliedFilters] = useState(defaultRange)

  const { data, isLoading } = useGetUserContributions(
    user.id ?? '',
    appliedFilters,
    open
  )

  const contributions = data?.items ?? []
  const userRole = user.role ?? UserRole.Annotator
  const isAnnotator = userRole === UserRole.Annotator

  const handleApplyFilter = () => {
    setAppliedFilters({
      start_date: startDate,
      end_date: endDate,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyFilter()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {t('users.report.title')} - {user.username}
          </DialogTitle>
          <DialogDescription>
            {t('users.report.description')}
          </DialogDescription>
        </DialogHeader>

        {/* Date Range Filters */}
        <div className="flex items-end gap-3 pb-4 border-b">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="start-date" className="text-xs">
              {t('users.report.startDate')}
            </Label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9 h-9 bg-muted/80"
              />
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="end-date" className="text-xs">
              {t('users.report.endDate')}
            </Label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9 h-9 bg-muted/80"
              />
            </div>
          </div>
          <Button onClick={handleApplyFilter} size="sm" className="h-9">
            {t('users.report.apply')}
          </Button>
        </div>

        {/* Summary Cards */}
        <UserReportSummary
          totalCount={data?.total_count ?? 0}
          approvedCount={data?.approved_count ?? 0}
          reviewedCount={data?.reviewed_count ?? 0}
          rejectionCount={data?.rejection_count ?? 0}
          role={userRole}
          isLoading={isLoading}
        />

        {/* Contributions Table */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-2">
          <h4 className="text-sm font-medium">{t('users.report.contributions')}</h4>
          <div className="border rounded-lg overflow-auto flex-1">
              {isLoading ? (
                <ContributionsTableSkeleton isAnnotator={isAnnotator} />
              ) : contributions.length === 0 ? (
                <EmptyContributions />
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">
                        {t('users.report.table.imageName')}
                      </th>
                      <th className="text-left px-3 py-2 font-medium">
                        {t('users.report.table.batch')}
                      </th>
                      <th className="text-left px-3 py-2 font-medium">
                        {t('users.report.table.role')}
                      </th>
                      <th className="text-left px-3 py-2 font-medium">
                        {t('users.report.table.scriptType')}
                      </th>
                      {isAnnotator ? (
                        <>
                          <th className="text-center px-3 py-2 font-medium">
                            {t('users.report.table.approved')}
                          </th>
                          <th className="text-center px-3 py-2 font-medium">
                            {t('users.report.table.reviewed')}
                          </th>
                        </>
                      ) : (
                        <th className="text-center px-3 py-2 font-medium">
                          {t('users.report.table.rejectionCount')}
                        </th>
                      )}
                      <th className="text-right px-3 py-2 font-medium">
                        {t('users.report.table.date')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="h-full">
                    {contributions.map((item) => (
                      <ContributionRow
                        key={item.task_id}
                        contribution={item}
                        isAnnotator={isAnnotator}
                      />
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ContributionRowProps {
  contribution: UserContribution
  isAnnotator: boolean
}

function NullableBooleanCell({ value }: { value: boolean | null }) {
  if (value === null) {
    return <Minus className="h-4 w-4 text-muted-foreground mx-auto" />
  }
  return value ? (
    <Check className="h-4 w-4 text-emerald-600 mx-auto" />
  ) : (
    <X className="h-4 w-4 text-red-500 mx-auto" />
  )
}

function ContributionRow({ contribution, isAnnotator }: ContributionRowProps) {
  return (
    <tr className="border-t hover:bg-muted/30 transition-colors">
      <td className="px-3 py-2 truncate max-w-[180px]" title={contribution.name}>
        {contribution.name}
      </td>
      <td className="px-3 py-2">
        <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
          {contribution.batch_name}
        </span>
      </td>
      <td className="px-3 py-2 capitalize">{contribution.role}</td>
      <td className="px-3 py-2">
        {contribution.script_type ? (
          <span className="inline-flex items-center rounded-md bg-violet-50 dark:bg-violet-950/50 px-2 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-300">
            {contribution.script_type}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      {isAnnotator ? (
        <>
          <td className="px-3 py-2 text-center">
            <NullableBooleanCell value={contribution.approved} />
          </td>
          <td className="px-3 py-2 text-center">
            <NullableBooleanCell value={contribution.reviewed} />
          </td>
        </>
      ) : (
        <td className="px-3 py-2 text-center">
          <span className={contribution.rejection_count > 0 ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
            {contribution.rejection_count}
          </span>
        </td>
      )}
      <td className="px-3 py-2 text-right text-muted-foreground text-xs">
        {formatDateTime(contribution.updated_time)}
      </td>
    </tr>
  )
}

function EmptyContributions() {
  const { t } = useTranslation('admin')

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <FileText className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-base font-medium">{t('users.report.noContributions')}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {t('users.report.noContributionsHint')}
      </p>
    </div>
  )
}

function ContributionsTableSkeleton({ isAnnotator }: { isAnnotator: boolean }) {
  const colCount = isAnnotator ? 7 : 6

  return (
    <div className="space-y-0">
      <div className="flex items-center gap-4 px-3 py-2 bg-muted/50">
        {[...Array(colCount)].map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i === 0 ? 'w-32' : i === colCount - 1 ? 'w-24 ml-auto' : 'w-16'}`} />
        ))}
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-3 py-2 border-t">
          {[...Array(colCount)].map((_, j) => (
            <Skeleton key={j} className={`h-4 ${j === 0 ? 'w-40' : j === colCount - 1 ? 'w-20 ml-auto' : 'w-14'}`} />
          ))}
        </div>
      ))}
    </div>
  )
}
