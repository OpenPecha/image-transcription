import { useState } from 'react'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDeleteTask } from '../../api/task'
import { useUIStore } from '@/store/use-ui-store'
import type { BatchData } from './batch-row'

interface DeleteBatchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  batch: BatchData | null
}

export function DeleteBatchDialog({ open, onOpenChange, batch }: DeleteBatchDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteTask = useDeleteTask()
  const { addToast } = useUIStore()

  const handleDelete = async () => {
    if (!batch) return

    setIsDeleting(true)

    try {
      // Delete all tasks in the batch
      const deletePromises = batch.tasks.map((task) =>
        deleteTask.mutateAsync(task.id)
      )
      await Promise.all(deletePromises)

      addToast({
        title: 'Batch deleted',
        description: `Successfully deleted ${batch.tasks.length} task(s) from "${batch.batchName}"`,
        variant: 'success',
      })

      onOpenChange(false)
    } catch (error) {
      addToast({
        title: 'Delete failed',
        description: 'Failed to delete some tasks. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (!batch) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Batch
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this batch?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  This will permanently delete:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-0.5">
                  <li>Batch: <span className="font-medium text-foreground">{batch.batchName}</span></li>
                  <li>{batch.tasks.length} task(s) in this batch</li>
                  <li>All associated history and data</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Batch
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

