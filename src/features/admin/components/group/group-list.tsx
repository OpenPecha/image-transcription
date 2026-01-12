import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FolderPlus, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useGetGroups } from '../../api/group'
import { GroupItem, GroupItemSkeleton } from './group-item'
import { GroupDialog } from './group-dialog'

export function GroupList() {
  const { t } = useTranslation('admin')
  const { data: groups = [], isLoading } = useGetGroups()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              {t('groups.cardTitle')}
            </CardTitle>
            <CardDescription className="mt-1.5">
              {t('groups.cardDescription')}
            </CardDescription>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} size="sm">
            <FolderPlus className="mr-2 h-4 w-4" />
            {t('groups.addGroup')}
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <GroupItemSkeleton key={i} />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <EmptyState onCreateClick={() => setCreateDialogOpen(true)} />
          ) : (
            <div className="space-y-3">
              {groups.map((group) => (
                <GroupItem key={group.id} group={group} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Group Dialog */}
      <GroupDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        group={null}
      />
    </>
  )
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  const { t } = useTranslation('admin')

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Layers className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{t('groups.noGroups')}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        {t('groups.noGroupsDescription')}
      </p>
      <Button onClick={onCreateClick} className="mt-4" size="sm">
        <FolderPlus className="mr-2 h-4 w-4" />
        {t('groups.createFirstGroup')}
      </Button>
    </div>
  )
}

