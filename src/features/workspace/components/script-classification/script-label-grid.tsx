import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2, BookOpen, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScriptLabelCard } from './script-label-card'
import { ScriptStyleGroup } from './script-style-group'
import { ReviewerCoreBadge } from './reviewer-core-badge'
import { useScriptStyles } from '../../hooks/use-script-styles'
import type { ScriptType, ScriptStyle, ClassificationTask } from '@/types'

type BadgeVariant = 'a' | 'b' | 'ab'

interface ScriptLabelGridProps {
  task: ClassificationTask
  disabled?: boolean
  onSelect: (label: ScriptType) => void
  onTrash?: () => void
  onOpenGuide?: () => void
}

function getSubStyleBadge(
  id: ScriptType,
  classificationA: ScriptType | null,
  classificationB: ScriptType | null,
): BadgeVariant | undefined {
  const matchA = classificationA === id
  const matchB = classificationB === id
  if (matchA && matchB) return 'ab'
  if (matchA) return 'a'
  if (matchB) return 'b'
  return undefined
}

function getCoreBadge(
  parentId: ScriptType,
  classificationA: ScriptType | null,
  classificationB: ScriptType | null,
  isChild: (parentId: ScriptType, childId: ScriptType) => boolean,
): BadgeVariant | undefined {
  const matchA = classificationA !== null && isChild(parentId, classificationA)
  const matchB = classificationB !== null && isChild(parentId, classificationB)
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
  const { parentStyles, getChildren, getName, isChild } = useScriptStyles()
  const isReviewer = task.state === 'reviewing'

  const [expandedParent, setExpandedParent] = useState<ScriptType | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<ScriptType | null>(null)

  const expandedChildren: ScriptStyle[] = expandedParent
    ? getChildren(expandedParent)
    : []

  const expandedParentStyle: ScriptStyle | undefined = expandedParent
    ? parentStyles.find((s) => s.id === expandedParent)
    : undefined

  const handleCoreClick = useCallback(
    (id: ScriptType) => {
      const children = getChildren(id)

      if (children.length === 0) {
        if (selectedStyle === id) {
          setSelectedStyle(null)
        } else {
          setExpandedParent(null)
          setSelectedStyle(id)
        }
        return
      }

      if (expandedParent === id) {
        setExpandedParent(null)
        setSelectedStyle(null)
      } else {
        setExpandedParent(id)
        setSelectedStyle(null)
      }
    },
    [expandedParent, selectedStyle, getChildren],
  )

  const handleSubStyleSelect = useCallback((id: ScriptType) => {
    setSelectedStyle((prev) => (prev === id ? null : id))
  }, [])

  const handleBack = useCallback(() => {
    setExpandedParent(null)
    setSelectedStyle(null)
  }, [])

  const handleSubmit = useCallback(() => {
    if (!selectedStyle) return
    onSelect(selectedStyle)
    setExpandedParent(null)
    setSelectedStyle(null)
  }, [selectedStyle, onSelect])

  const getSubBadge = useCallback(
    (id: ScriptType) =>
      getSubStyleBadge(id, task.classification_a, task.classification_b),
    [task.classification_a, task.classification_b],
  )

  const isLeafSelected = selectedStyle && !expandedParent

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
              {t('classification.submit', { name: getName(selectedStyle) })}
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
        {parentStyles.map((style) => {
          const children = getChildren(style.id)
          const isExpanded = expandedParent === style.id
          const hasChildren = children.length > 0
          const isLeafNode = !hasChildren
          const coreBadge = isReviewer
            ? getCoreBadge(style.id, task.classification_a, task.classification_b, isChild)
            : undefined

          return (
            <div key={style.id} className="relative">
              {coreBadge && (
                <ReviewerCoreBadge
                  variant={coreBadge}
                  hintA={
                    task.classification_a && isChild(style.id, task.classification_a)
                      ? getName(task.classification_a)
                      : undefined
                  }
                  hintB={
                    task.classification_b && isChild(style.id, task.classification_b)
                      ? getName(task.classification_b)
                      : undefined
                  }
                />
              )}
              <ScriptLabelCard
                id={style.id}
                displayName={getName(style.id)}
                hasSubStyles={hasChildren}
                expanded={isExpanded}
                selected={isLeafNode && selectedStyle === style.id}
                disabled={disabled}
                onSelect={handleCoreClick}
              />
            </div>
          )
        })}
      </div>

      {expandedParentStyle && expandedChildren.length > 0 && (
        <div className="mt-3">
          <ScriptStyleGroup
            parentStyle={expandedParentStyle}
            children={expandedChildren}
            selectedStyle={selectedStyle}
            disabled={disabled}
            isTransitioning={disabled}
            getName={getName}
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
