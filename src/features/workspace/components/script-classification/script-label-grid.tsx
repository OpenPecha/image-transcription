import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2, BookOpen, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScriptLabelCard } from './script-label-card'
import { ScriptStyleGroup } from './script-style-group'
import { ReviewerCoreBadge } from './reviewer-core-badge'
import { SCRIPT_STYLE_GROUPS, isSubStyleOf } from '@/types'
import type { ScriptType, ClassificationTask, ScriptStyleGroup as ScriptStyleGroupType } from '@/types'

type BadgeVariant = 'a' | 'b' | 'ab'

interface ScriptLabelGridProps {
  task: ClassificationTask
  disabled?: boolean
  onSelect: (label: ScriptType) => void
  onTrash?: () => void
  onOpenGuide?: () => void
}

function getSubStyleBadge(
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

function getCoreBadge(
  core: ScriptType,
  classificationA: ScriptType | null,
  classificationB: ScriptType | null,
): BadgeVariant | undefined {
  const matchA = classificationA !== null && isSubStyleOf(core, classificationA)
  const matchB = classificationB !== null && isSubStyleOf(core, classificationB)
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

  const [expandedCore, setExpandedCore] = useState<ScriptType | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<ScriptType | null>(null)

  const expandedGroup: ScriptStyleGroupType | undefined = expandedCore
    ? SCRIPT_STYLE_GROUPS.find((g) => g.core === expandedCore)
    : undefined

  const handleCoreClick = useCallback(
    (core: ScriptType) => {
      const group = SCRIPT_STYLE_GROUPS.find((g) => g.core === core)
      if (!group) return

      if (group.subStyles.length === 0) {
        if (selectedStyle === core) {
          setSelectedStyle(null)
        } else {
          setExpandedCore(null)
          setSelectedStyle(core)
        }
        return
      }

      if (expandedCore === core) {
        setExpandedCore(null)
        setSelectedStyle(null)
      } else {
        setExpandedCore(core)
        setSelectedStyle(null)
      }
    },
    [expandedCore, selectedStyle],
  )

  const handleSubStyleSelect = useCallback((style: ScriptType) => {
    setSelectedStyle((prev) => (prev === style ? null : style))
  }, [])

  const handleBack = useCallback(() => {
    setExpandedCore(null)
    setSelectedStyle(null)
  }, [])

  const handleSubmit = useCallback(() => {
    if (!selectedStyle) return
    onSelect(selectedStyle)
    setExpandedCore(null)
    setSelectedStyle(null)
  }, [selectedStyle, onSelect])

  const getSubBadge = useCallback(
    (style: ScriptType) =>
      getSubStyleBadge(style, task.classification_a, task.classification_b),
    [task.classification_a, task.classification_b],
  )

  const isLeafSelected = selectedStyle && !expandedCore

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
        <div className="flex items-center gap-2">
          {isLeafSelected && (
            <button
              type="button"
              disabled={disabled}
              onClick={handleSubmit}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold',
                'bg-primary text-primary-foreground shadow-sm',
                'transition-all duration-150',
                'hover:bg-primary/90 hover:shadow-md',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <Check className="h-3.5 w-3.5" />
              {t('classification.submit', { name: selectedStyle })}
            </button>
          )}
          {onTrash && (
            <button
              type="button"
              disabled={disabled}
              onClick={onTrash}
              className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/8 px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t('actions.trash')}
            </button>
          )}
        </div>
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

      <div className="flex flex-wrap gap-2.5">
        {SCRIPT_STYLE_GROUPS.map((group) => {
          const isExpanded = expandedCore === group.core
          const hasSubStyles = group.subStyles.length > 0
          const isLeafNode = !hasSubStyles
          const coreBadge = isReviewer
            ? getCoreBadge(group.core, task.classification_a, task.classification_b)
            : undefined

          return (
            <div key={group.core} className="relative">
              {coreBadge && (
                <ReviewerCoreBadge
                  variant={coreBadge}
                  hintA={
                    task.classification_a && isSubStyleOf(group.core, task.classification_a)
                      ? task.classification_a
                      : undefined
                  }
                  hintB={
                    task.classification_b && isSubStyleOf(group.core, task.classification_b)
                      ? task.classification_b
                      : undefined
                  }
                />
              )}
              <ScriptLabelCard
                label={group.core}
                hasSubStyles={hasSubStyles}
                expanded={isExpanded}
                selected={isLeafNode && selectedStyle === group.core}
                disabled={disabled}
                onSelect={handleCoreClick}
              />
            </div>
          )
        })}
      </div>

      {expandedGroup && expandedGroup.subStyles.length > 0 && (
        <div className="mt-3">
          <ScriptStyleGroup
            group={expandedGroup}
            selectedStyle={selectedStyle}
            disabled={disabled}
            isTransitioning={disabled}
            getBadge={isReviewer ? getSubBadge : undefined}
            onSelectStyle={handleSubStyleSelect}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  )
}
