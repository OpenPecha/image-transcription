import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { batchKeys } from './batch-keys'
import { APPLICATION_NAME } from '@/lib/constant'

interface VerifyTaskParams {
  taskId: string
  batchId: string
  userId: string
}

const verifyTask = async ({ taskId, userId }: VerifyTaskParams): Promise<void> => {
  return apiClient.post(`/tasks/${APPLICATION_NAME}/submit/${taskId}`, {
    user_id: userId,
    action: 'VERIFY',
  })
}

export const useVerifyTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: verifyTask,
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
