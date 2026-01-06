import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'

export function EmptyTaskState() {
  const { t } = useTranslation('dashboard')

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <FileText className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{t('noTasks.title')}</h3>
      <p className="text-muted-foreground max-w-sm">
        {t('noTasks.description')}
      </p>
    </div>
  )
}

