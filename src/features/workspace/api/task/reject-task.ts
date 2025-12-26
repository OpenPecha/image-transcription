import { useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceKeys } from './workspace-keys'
import { apiClient } from '@/lib/axios'
import { APPLICATION_NAME } from '@/lib/constant'

interface RejectTaskParams {
  task_id: string
  user_id: string
  transcript: string
  reject: boolean
}

interface RejectTaskResponse {
  success: boolean
  message?: string
}

const rejectTask = async (params: RejectTaskParams): Promise<RejectTaskResponse> => {
  return apiClient.post(`/tasks/${APPLICATION_NAME}/submit/${params.task_id}`, {
    user_id: params.user_id,
    transcript: params.transcript,
    submit: false,
  })
}

export const useRejectTask = (user_id?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectTask,
    onSuccess: () => {
      if (user_id) {
        queryClient.invalidateQueries({ queryKey: workspaceKeys.assignedTask(user_id!) })
      }
    },
  })
}
