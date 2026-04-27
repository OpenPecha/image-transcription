import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useGetAllUsers } from '../../api/user'
import { useGetGroups } from '../../api/group'
import { useDebouncedValue } from '@/hooks'
import { UserFilters } from './user-filters'
import { UserItem, UserItemSkeleton } from './user-item'
import { UserDialog } from './user-dialog'
import { UserRole } from '@/types'

const ALL_FILTER = 'all'

export function UserList() {
  const { t } = useTranslation('admin')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState(ALL_FILTER)
  const [groupFilter, setGroupFilter] = useState(ALL_FILTER)

  const debouncedSearch = useDebouncedValue(search, 300)
  const { data: groups = [] } = useGetGroups()

  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetAllUsers({
    search: debouncedSearch || undefined,
    role: roleFilter !== ALL_FILTER ? (roleFilter as UserRole) : undefined,
    group_id: groupFilter !== ALL_FILTER ? groupFilter : undefined,
  })

  const pages = data?.pages ?? []
  const users = pages.flatMap((page) => page.items)
  const total = pages[0]?.total ?? 0

  if (hasNextPage && !isFetchingNextPage) {
    void fetchNextPage()
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value)
  }

  const handleGroupFilterChange = (value: string) => {
    setGroupFilter(value)
  }

  return (
    <>
      <Card className="flex flex-col h-[calc(100vh-3rem)] overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('users.title')} ({total})
            </CardTitle>
            <CardDescription className="mt-1.5">
              {t('users.description')}
            </CardDescription>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            {t('users.addUser')}
          </Button>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden">
          {/* Filters */}
          <UserFilters
            search={search}
            onSearchChange={handleSearchChange}
            roleFilter={roleFilter}
            onRoleFilterChange={handleRoleFilterChange}
            groupFilter={groupFilter}
            onGroupFilterChange={handleGroupFilterChange}
            groups={groups}
          />

          {/* User List - Scrollable */}
          <div className="flex-1 overflow-y-auto rounded-lg border border-border">
            {isLoading ? (
              <div>
                {[...Array(5)].map((_, i) => (
                  <UserItemSkeleton key={i} />
                ))}
              </div>
            ) : users.length === 0 ? (
              <EmptyState
                hasFilters={!!debouncedSearch || roleFilter !== ALL_FILTER || groupFilter !== ALL_FILTER}
                onClearFilters={() => {
                  setSearch('')
                  setRoleFilter(ALL_FILTER)
                  setGroupFilter(ALL_FILTER)
                }}
                onCreateClick={() => setCreateDialogOpen(true)}
              />
            ) : (
              <div className={isFetching ? 'opacity-60' : ''}>
                {users.map((user) => (
                  <UserItem key={user.username} user={user} groups={groups} />
                ))}
              </div>
            )}
          </div>

        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <UserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        user={null}
      />
    </>
  )
}

interface EmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
  onCreateClick: () => void
}

function EmptyState({ hasFilters, onClearFilters, onCreateClick }: EmptyStateProps) {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Users className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{t('users.noUsers')}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        {hasFilters ? t('users.noUsersFiltered') : t('users.noUsersEmpty')}
      </p>
      {hasFilters ? (
        <Button onClick={onClearFilters} variant="outline" className="mt-4" size="sm">
          {tCommon('actions.clearFilters')}
        </Button>
      ) : (
        <Button onClick={onCreateClick} className="mt-4" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          {t('users.addFirstUser')}
        </Button>
      )}
    </div>
  )
}

