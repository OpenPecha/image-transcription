import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { batchKeys } from './batch-keys'
import { APPLICATION_NAME } from '@/lib/constant'

interface RejectTaskParams {
  taskId: string
  batchId: string
  userId: string
}

const rejectTask = async ({ taskId, userId }: RejectTaskParams): Promise<void> => {
  return apiClient.post(`/tasks/${APPLICATION_NAME}/submit/${taskId}`, {
    user_id: userId,
    submit: false,
  })
}

export const useRejectTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectTask,
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
