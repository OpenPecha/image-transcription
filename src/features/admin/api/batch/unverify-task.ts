import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { batchKeys } from './batch-keys'
import { APPLICATION_NAME } from '@/lib/constant'

interface UnverifyTaskParams {
  taskId: string
  batchId: string
  userId: string
}

const unverifyTask = async ({ taskId, userId }: UnverifyTaskParams): Promise<void> => {
  return apiClient.post(`/tasks/${APPLICATION_NAME}/submit/${taskId}`, {
    user_id: userId,
    action: 'UNVERIFY',
  })
}

export const useUnverifyTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unverifyTask,
    onSuccess: (_, { batchId }) => {
      queryClient.invalidateQueries({
        queryKey: batchKeys.report(batchId),
      })
      queryClient.invalidateQueries({
        queryKey: ['batches', 'tasks', batchId],
      })
    },
  })
}
