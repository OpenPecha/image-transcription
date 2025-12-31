import { useState } from 'react'
import { Package, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useGetBatches } from '../../api/batch'
import { BatchItem, BatchItemSkeleton } from './batch-item'
import { BatchUploadDialog } from './batch-upload-dialog'

export function BatchList() {
  const { data: batches = [], isLoading } = useGetBatches()
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Batches
            </CardTitle>
            <CardDescription className="mt-1.5">
              Manage batch uploads and view task progress
            </CardDescription>
          </div>
          <Button onClick={() => setUploadDialogOpen(true)} size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload Batch
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <BatchItemSkeleton key={i} />
              ))}
            </div>
          ) : batches.length === 0 ? (
            <EmptyState onUploadClick={() => setUploadDialogOpen(true)} />
          ) : (
            <div className="space-y-3">
              {batches.map((batch) => (
                <BatchItem key={batch.id} batch={batch} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <BatchUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </>
  )
}

function EmptyState({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Package className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No batches yet</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        Upload your first batch of image transcription tasks to get started.
      </p>
      <Button onClick={onUploadClick} className="mt-4" size="sm">
        <Upload className="mr-2 h-4 w-4" />
        Upload First Batch
      </Button>
    </div>
  )
}

