import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { batchKeys } from './batch-keys'
import { APPLICATION_NAME } from '@/lib/constant'

interface RestoreTaskParams {
  taskId: string
  batchId: string
}

const restoreTask = async ({ taskId }: RestoreTaskParams): Promise<void> => {
  return apiClient.post(`/tasks/${APPLICATION_NAME}/${taskId}/restore`)
}

export const useRestoreTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: restoreTask,
    onSuccess: (_, { batchId }) => {
      // Invalidate batch report to refresh stats
      queryClient.invalidateQueries({ 
        queryKey: batchKeys.report(batchId) 
      })
      // Invalidate all task lists for this batch (all states: pending, trashed, all, etc.)
      queryClient.invalidateQueries({ 
        queryKey: ['batches', 'tasks', batchId]
      })
    },
  })
}

