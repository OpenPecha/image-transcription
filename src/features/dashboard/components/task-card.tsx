import { useTranslation } from 'react-i18next'
import { ArrowRight, Layers, Image as ImageIcon } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { STATE_CONFIG } from '../constants'
import type { ClassificationTask } from '@/types'

interface TaskCardProps {
  task: ClassificationTask
  onContinue: () => void
}

export function TaskCard({ task, onContinue }: TaskCardProps) {
  const { t } = useTranslation('dashboard')
  const stateConfig = STATE_CONFIG[task.state]

  return (
    <Card className="max-w-2xl overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {task.task_url ? (
          <img
            src={task.task_url}
            alt={task.task_name}
            className="h-full w-full object-contain bg-black/5"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground/40" />
          </div>
        )}

        <div className="absolute top-3 right-3">
          {stateConfig && (
            <Badge variant={stateConfig.variant}>{stateConfig.label}</Badge>
          )}
        </div>
      </div>

      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate" title={task.task_name}>
              {task.task_name}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 shrink-0" />
                {task.batch_id}
              </span>
            </div>
          </div>
        </div>

        {task.state === 'reviewing' && (
          <div className="mt-4 flex gap-3 text-xs">
            {task.classification_a && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                <span className="font-bold">A:</span>
                {task.classification_a}
              </span>
            )}
            {task.classification_b && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                <span className="font-bold">B:</span>
                {task.classification_b}
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button onClick={onContinue} className="w-full sm:w-auto" size="lg">
          {t('taskCard.continue')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
