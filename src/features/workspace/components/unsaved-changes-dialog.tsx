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
import { AlertTriangle } from 'lucide-react'

interface UnsavedChangesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDiscard: () => void
  onCancel: () => void
  isSaving?: boolean
}

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onDiscard,
  onCancel,
  isSaving,
}: UnsavedChangesDialogProps) {
  const { t } = useTranslation('workspace')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <DialogTitle>{t('dialogs.unsaved.title')}</DialogTitle>
              <DialogDescription className="mt-1">
                {t('dialogs.unsaved.description')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            {t('dialogs.unsaved.stay')}
          </Button>
          <Button
            variant="destructive"
            onClick={onDiscard}
            disabled={isSaving}
          >
            {t('dialogs.unsaved.discard')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

