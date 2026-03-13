import { useTranslation } from 'react-i18next'
import { ArrowLeft, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScriptLabelCard } from './script-label-card'
import type { ScriptType, ScriptStyleGroup as ScriptStyleGroupType } from '@/types'

type BadgeVariant = 'a' | 'b' | 'ab'

interface ScriptStyleGroupProps {
  group: ScriptStyleGroupType
  selectedStyle: ScriptType | null
  disabled?: boolean
  isTransitioning?: boolean
  getBadge?: (style: ScriptType) => BadgeVariant | undefined
  onSelectStyle: (style: ScriptType) => void
  onBack: () => void
  onSubmit: () => void
}

export function ScriptStyleGroup({
  group,
  selectedStyle,
  disabled,
  isTransitioning,
  getBadge,
  onSelectStyle,
  onBack,
  onSubmit,
}: ScriptStyleGroupProps) {
  const { t } = useTranslation('workspace')
  const allOptions: ScriptType[] = [group.core, ...group.subStyles]

  return (
    <div className="animate-in slide-in-from-top-2 fade-in duration-200 rounded-lg border border-border bg-muted/30 p-3">
      <div className="mb-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {group.core}
        </button>

        {selectedStyle && (
          <button
            type="button"
            disabled={disabled || isTransitioning}
            onClick={onSubmit}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold',
              'bg-primary text-primary-foreground shadow-sm',
              'transition-all duration-150',
              'hover:bg-primary/90 hover:shadow-md',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            <Check className="h-4 w-4" />
            {t('classification.submit', { name: selectedStyle })}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {allOptions.map((style) => (
          <ScriptLabelCard
            key={style}
            label={style}
            isGeneral={style === group.core}
            selected={selectedStyle === style}
            badge={getBadge?.(style)}
            disabled={disabled}
            onSelect={onSelectStyle}
          />
        ))}
      </div>
    </div>
  )
}
