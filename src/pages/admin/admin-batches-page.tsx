import { useTranslation } from 'react-i18next'
import { BatchList } from '@/features/admin/components'

export function AdminBatchesPage() {
  const { t } = useTranslation('admin')

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('batches.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('batches.description')}
        </p>
      </div>

      <BatchList />
    </div>
  )
}

