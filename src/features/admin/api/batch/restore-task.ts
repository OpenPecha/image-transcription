import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { batchKeys } from './batch-keys'

interface RestoreTaskParams {
  taskId: string
  batchId: string
}

const restoreTask = async ({ taskId }: RestoreTaskParams): Promise<void> => {
  return apiClient.post(`/tasks/${taskId}/restore`)
}

export const useRestoreTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: restoreTask,
    onSuccess: (_, { batchId }) => {
      // Invalidate batch tasks queries to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: batchKeys.tasks(batchId, 'trashed') 
      })
      // Invalidate batch report to refresh stats
      queryClient.invalidateQueries({ 
        queryKey: batchKeys.report(batchId) 
      })
    },
  })
}

