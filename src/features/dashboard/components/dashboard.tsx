import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGetClassificationTask } from '@/features/workspace/api'
import { useAuth } from '@/features/auth'
import {
  EmptyTaskState,
  TaskCard,
  TaskCardSkeleton,
  WelcomeHeader,
} from '@/features/dashboard'
import { UserRole } from '@/types'

export function Dashboard() {
  const { t } = useTranslation('dashboard')
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === UserRole.Admin;
  const { data: task, isLoading } = useGetClassificationTask(
    isAdmin ? undefined : currentUser?.id
  )

  if (!currentUser) return null

  const handleContinue = () => {
    navigate('/workspace')
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <WelcomeHeader user={currentUser} />
      
      {!isAdmin && (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('currentTask')}</h2>

        {isLoading ? (
          <TaskCardSkeleton />
        ) : !task ? (
          <EmptyTaskState />
        ) : (
          <TaskCard task={task} onContinue={handleContinue} />
        )}
      </div>
      )}
    </div>
  )
}
