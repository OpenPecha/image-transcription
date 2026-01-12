import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface TrashConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
  taskName?: string
}

export function TrashConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  isLoading,
  taskName = 'this task',
}: TrashConfirmationDialogProps) {
  const { t } = useTranslation('workspace')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>{t('dialogs.trash.title')}</DialogTitle>
              <DialogDescription className="mt-1">
                {t('dialogs.trash.description', { taskName })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t('dialogs.unsaved.stay')}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? t('loading.processing') : t('actions.trash')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

