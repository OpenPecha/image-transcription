import { BatchList } from '@/features/admin/components'

export function AdminBatchesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Batch Management</h1>
        <p className="text-muted-foreground mt-1">
          Upload batches and monitor task progress
        </p>
      </div>

      <BatchList />
    </div>
  )
}

