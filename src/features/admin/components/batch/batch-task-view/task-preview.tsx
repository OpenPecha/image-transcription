import { useTranslation } from 'react-i18next'
import { RotateCcw, Undo2, User, CheckCircle2, XCircle } from 'lucide-react'
import { ImageCanvas } from '@/features/workspace/components/image-canvas'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { BATCH_STATS_CONFIG, type BatchTask } from '@/types'
import { useScriptStyles } from '@/features/workspace/hooks/use-script-styles'

interface TaskPreviewProps {
  task: BatchTask | null
  onRestore: () => void
  isRestoring: boolean
  onReject: () => void
  isRejecting: boolean
  isLoading: boolean
}

export function TaskPreview({
  task,
  onRestore,
  isRestoring,
  onReject,
  isRejecting,
  isLoading,
}: TaskPreviewProps) {
  const { t } = useTranslation('admin')

  if (isLoading) {
    return <TaskPreviewSkeleton />
  }

  if (!task) {
    return (
      <div className="flex flex-col h-full bg-muted/20">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">{t('batches.noTaskSelected')}</p>
            <p className="text-sm mt-1">{t('batches.selectTaskToPreview')}</p>
          </div>
        </div>
      </div>
    )
  }

  const canRestore = task.state === 'trashed'
  const canReject = task.state === 'accepted'
  const stateConfig = BATCH_STATS_CONFIG[task.state]

  return (
    <div className="flex flex-col h-full">
      {/* Top info bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm font-medium truncate">{task.task_name}</span>
          <Badge
            variant="secondary"
            className={cn('shrink-0 text-[10px] font-medium', stateConfig.color)}
          >
            {stateConfig.label}
          </Badge>
          <span className="text-xs text-muted-foreground capitalize">
            {task.orientation}
          </span>
        </div>
      </div>

      {/* Image — takes all remaining vertical space */}
      <div className="flex-1 min-h-0">
        <ImageCanvas imageUrl={task.task_url} />
      </div>

      {/* Classification metadata panel */}
      <ClassificationMetadata task={task} />

      {/* Restore footer for trashed tasks */}
      {canRestore && (
        <div className="border-t border-border bg-card px-4 py-3 flex justify-center shrink-0">
          <Button
            variant="outline"
            onClick={onRestore}
            disabled={!canRestore || isRestoring}
            className={cn(
              'min-w-[140px]',
              canRestore && 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300',
            )}
          >
            <RotateCcw className={cn('h-4 w-4 mr-2', isRestoring && 'animate-spin')} />
            {isRestoring ? t('batches.restoring') : t('batches.restore')}
          </Button>
        </div>
      )}

      {/* Reject footer for accepted tasks */}
      {canReject && (
        <div className="border-t border-border bg-card px-4 py-3 flex justify-center shrink-0">
          <Button
            variant="outline"
            onClick={onReject}
            disabled={isRejecting}
            className="min-w-[140px] hover:bg-red-50 hover:text-red-700 hover:border-red-300"
          >
            <Undo2 className={cn('h-4 w-4 mr-2', isRejecting && 'animate-spin')} />
            {isRejecting ? t('batches.rejecting') : t('batches.reject')}
          </Button>
        </div>
      )}
    </div>
  )
}

function ClassificationMetadata({ task }: { task: BatchTask }) {
  const { t } = useTranslation('admin')
  const { getName } = useScriptStyles()

  const hasAnnotatorA = task.annotator_a_username != null
  const hasAnnotatorB = task.annotator_b_username != null
  const hasReviewer = task.reviewer_username != null
  const hasTrashedBy = task.trashed_by != null

  const nothingToShow = !hasAnnotatorA && !hasAnnotatorB && !hasReviewer && !hasTrashedBy
  if (nothingToShow) return null

  return (
    <div className="border-t border-border bg-muted/30 px-4 py-3 shrink-0">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        {hasAnnotatorA && (
          <MetadataField
            label={t('batches.annotatorA')}
            username={task.annotator_a_username!}
            value={task.classification_a ? getName(task.classification_a) : null}
          />
        )}

        {hasAnnotatorB && (
          <MetadataField
            label={t('batches.annotatorB')}
            username={task.annotator_b_username!}
            value={task.classification_b ? getName(task.classification_b) : null}
          />
        )}

        {hasReviewer && (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-muted-foreground">{t('batches.reviewer')}:</span>
            <span className="font-medium">{task.reviewer_username}</span>
            {task.final_script && (
              <Badge variant="outline" className="ml-1 text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                {getName(task.final_script)}
              </Badge>
            )}
          </div>
        )}

        {hasTrashedBy && (
          <div className="flex items-center gap-1.5">
            <XCircle className="h-3.5 w-3.5 text-rose-500" />
            <span className="text-muted-foreground">{t('batches.trashedBy')}:</span>
            <span className="font-medium text-rose-600">{task.trashed_by}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function MetadataField({
  label,
  username,
  value,
}: {
  label: string
  username: string
  value: string | null
}) {
  return (
    <div className="flex items-center gap-1.5">
      <User className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{username}</span>
      {value && (
        <Badge variant="outline" className="ml-1 text-[10px]">
          {value}
        </Badge>
      )}
    </div>
  )
}

function TaskPreviewSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-card">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="flex-1 min-h-0 p-2">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="border-t border-border bg-muted/30 px-4 py-3">
        <div className="flex gap-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
    </div>
  )
}
