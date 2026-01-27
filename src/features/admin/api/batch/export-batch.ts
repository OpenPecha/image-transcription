import { apiClient } from '@/lib/axios'
import { APPLICATION_NAME } from '@/lib/constant'
import type { BatchExportResponse } from '@/types'

/**
 * Fetches detailed batch export data for CSV generation
 *
 * @param batchId - The batch ID to export
 * @returns Promise with batch export data including detailed task metrics
 */
export const exportBatch = async (batchId: string): Promise<BatchExportResponse> => {
  return apiClient.get(`/batch/${APPLICATION_NAME}/${batchId}/export`)
}
