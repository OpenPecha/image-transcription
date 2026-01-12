import { useTranslation } from 'react-i18next'
import { type User } from '@/types'
import { getRoleTranslationKey } from '@/lib/utils'

interface WelcomeHeaderProps {
  user: User
}

export function WelcomeHeader({ user }: WelcomeHeaderProps) {
  const { t } = useTranslation('dashboard')
  const { t: tCommon } = useTranslation('common')

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        {t('welcome', { name: user.username })}
      </h1>
      {user.role && (
        <p className="text-muted-foreground mt-1">
          {tCommon(`roleDescriptions.${getRoleTranslationKey(user.role)}`)}
        </p>
      )}
    </div>
  )
}

