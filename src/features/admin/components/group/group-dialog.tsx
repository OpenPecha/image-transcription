import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GroupForm, type GroupFormData } from './group-form'
import { useCreateGroup, useUpdateGroup } from '../../api/group'
import type { Group } from '@/types'

interface GroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group?: Group | null // If provided, we're editing; otherwise creating
}

export function GroupDialog({ open, onOpenChange, group }: GroupDialogProps) {
  const { t } = useTranslation('admin')
  const createGroup = useCreateGroup()
  const updateGroup = useUpdateGroup()

  const isEditing = !!group
  const isSubmitting = createGroup.isPending || updateGroup.isPending

  const handleSubmit = async (data: GroupFormData) => {
    try {
      if (isEditing && group) {
        await updateGroup.mutateAsync({
          id: group.id,
          data: {
            new_name: data.name,
            new_description: data.description || '',
          },
        })
      } else {
        await createGroup.mutateAsync({
          name: data.name,
          description: data.description || '',
        })
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save group:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('groups.editGroup') : t('groups.createGroup')}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? t('groups.updateGroupDetails')
              : t('groups.addGroupDetails')}
          </DialogDescription>
        </DialogHeader>

        <GroupForm
          defaultValues={
            group
              ? { name: group.name, description: group.description }
              : undefined
          }
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={isEditing ? t('groups.updateGroup') : t('groups.createGroup')}
        />
      </DialogContent>
    </Dialog>
  )
}

