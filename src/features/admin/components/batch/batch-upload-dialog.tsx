import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUIStore } from '@/store/use-ui-store'
import { useUploadBatch } from '../../api/batch'
import { BatchUploadForm } from './batch-upload-form'
import type { BatchUploadFormValues } from '@/schema/batch-schema'
import type { BatchUploadTask } from '@/types'

interface BatchUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BatchUploadDialog({ open, onOpenChange }: BatchUploadDialogProps) {
  const { t } = useTranslation('admin')
  const [uploadProgress, setUploadProgress] = useState(0)
  const { addToast } = useUIStore()

  const uploadBatch = useUploadBatch({
    onProgress: setUploadProgress,
  })

  const handleSubmit = async (
    formData: BatchUploadFormValues,
    tasks: BatchUploadTask[]
  ) => {
    try {
      setUploadProgress(0)
      await uploadBatch.mutateAsync({
        batch_name: formData.batch_name,
        group_id: formData.group_id,
        tasks,
      })

      addToast({
        title: t('batches.upload.success'),
        description: t('batches.upload.successDescription', { count: tasks.length }),
        variant: 'success',
      })

      onOpenChange(false)
      setUploadProgress(0)
    } catch (error) {
      console.error('Failed to upload batch:', error)
      addToast({
        title: t('batches.upload.failed'),
        description: t('batches.upload.failedDescription'),
        variant: 'destructive',
      })
      setUploadProgress(0)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('batches.upload.title')}</DialogTitle>
          <DialogDescription>
            {t('batches.upload.description')}
          </DialogDescription>
        </DialogHeader>

        <BatchUploadForm
          onSubmit={handleSubmit}
          isSubmitting={uploadBatch.isPending}
          uploadProgress={uploadProgress}
        />
      </DialogContent>
    </Dialog>
  )
}

