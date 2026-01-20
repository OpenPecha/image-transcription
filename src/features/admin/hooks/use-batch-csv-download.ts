import { useState, useCallback } from 'react'

import { apiClient } from '@/lib/axios'
import type { BatchTask } from '@/types'

import { exportBatchTasksToCsv } from '../utils/batch-csv-export'

interface UseBatchCsvDownloadOptions {
  batchId: string
  batchName: string
  onError?: (error: Error) => void
}

interface UseBatchCsvDownloadReturn {
  download: () => Promise<void>
  isDownloading: boolean
}

/**
 * Hook to download all batch tasks as CSV
 *
 * Fetches all tasks (regardless of current filter) and exports them to CSV
 */
export function useBatchCsvDownload({
  batchId,
  batchName,
  onError,
}: UseBatchCsvDownloadOptions): UseBatchCsvDownloadReturn {
  const [isDownloading, setIsDownloading] = useState(false)

  const download = useCallback(async () => {
    if (!batchId || isDownloading) return

    setIsDownloading(true)

    try {
      // Fetch all tasks without state filter
      const tasks = await apiClient.get<never, BatchTask[]>(`/batch/${batchId}/tasks`)

      if (tasks.length === 0) {
        onError?.(new Error('No tasks to export'))
        return
      }

      exportBatchTasksToCsv(tasks, batchName)
    } catch (error) {
      const errorMessage = error instanceof Error ? error : new Error('Failed to download batch tasks')
      onError?.(errorMessage)
    } finally {
      setIsDownloading(false)
    }
  }, [batchId, batchName, isDownloading, onError])

  return { download, isDownloading }
}
