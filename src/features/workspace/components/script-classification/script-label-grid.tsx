import { useTranslation } from 'react-i18next'
import { Trash2, BookOpen } from 'lucide-react'
import { ScriptLabelCard } from './script-label-card'
import { SCRIPT_TYPES } from '@/types'
import type { ScriptType, ClassificationTask } from '@/types'

type BadgeVariant = 'a' | 'b' | 'ab'

interface ScriptLabelGridProps {
  task: ClassificationTask
  disabled?: boolean
  onSelect: (label: ScriptType) => void
  onTrash?: () => void
  onOpenGuide?: () => void
}

function getBadge(
  label: ScriptType,
  classificationA: ScriptType | null,
  classificationB: ScriptType | null,
): BadgeVariant | undefined {
  const matchA = classificationA === label
  const matchB = classificationB === label
  if (matchA && matchB) return 'ab'
  if (matchA) return 'a'
  if (matchB) return 'b'
  return undefined
}

export function ScriptLabelGrid({
  task,
  disabled,
  onSelect,
  onTrash,
  onOpenGuide,
}: ScriptLabelGridProps) {
  const { t } = useTranslation('workspace')
  const isReviewer = task.state === 'reviewing'

  return (
    <div className="border-t border-border bg-card px-6 py-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {isReviewer
              ? t('classification.selectFinal')
              : t('classification.selectScript')}
          </h3>
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title={t('guide.triggerLabel')}
            >
              <BookOpen className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {onTrash && (
          <button
            type="button"
            disabled={disabled}
            onClick={onTrash}
            className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/8 px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/15 disabled:pointer-events-none disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('actions.trash')}
          </button>
        )}
      </div>

      {isReviewer && (
        <div className="mb-3 flex gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block rounded-full border border-blue-300 bg-blue-100 px-1.5 py-0.5 text-[0.6rem] font-bold text-blue-700 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              A
            </span>
            = {t('classification.annotatorA')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block rounded-full border border-amber-300 bg-amber-100 px-1.5 py-0.5 text-[0.6rem] font-bold text-amber-700 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              B
            </span>
            = {t('classification.annotatorB')}
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        {SCRIPT_TYPES.map((scriptType) => (
          <ScriptLabelCard
            key={scriptType}
            label={scriptType}
            badge={
              isReviewer
                ? getBadge(
                    scriptType,
                    task.classification_a,
                    task.classification_b,
                  )
                : undefined
            }
            disabled={disabled}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
