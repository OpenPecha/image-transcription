import { useTranslation } from 'react-i18next'
import { GroupList } from '@/features/admin/components'

export function AdminGroupsPage() {
  const { t } = useTranslation('admin')

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('groups.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('groups.description')}
        </p>
      </div>

      <GroupList />
    </div>
  )
}

