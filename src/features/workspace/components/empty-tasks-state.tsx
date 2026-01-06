import { useTranslation } from 'react-i18next'
import { RefreshCw, FileX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyTasksStateProps {
  onRefresh?: () => void
  isLoading?: boolean
  message?: string
}

export function EmptyTasksState({
  onRefresh,
  isLoading,
  message,
}: EmptyTasksStateProps) {
  const { t } = useTranslation('workspace')

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-4">
        <FileX className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {t('empty.noMoreTasks')}
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {message || t('empty.message')}
      </p>
      {onRefresh && (
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? t('loading.checking') : t('empty.checkForTasks')}
        </Button>
      )}
    </div>
  )
}

