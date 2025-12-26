import { useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceKeys } from './workspace-keys'
import { apiClient } from '@/lib/axios'
import { APPLICATION_NAME } from '@/lib/constant'

interface ApproveTaskParams {
  task_id: string
  user_id: string
  transcript: string
  approve: boolean
}

interface ApproveTaskResponse {
  success: boolean
  message?: string
}

const approveTask = async (params: ApproveTaskParams): Promise<ApproveTaskResponse> => {
  return apiClient.post(`/tasks/${APPLICATION_NAME}/submit/${params.task_id}`, {
    user_id: params.user_id,
    transcript: params.transcript,
    submit: params.approve,
  })
}

export const useApproveTask = (user_id?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveTask,
    onSuccess: () => {
      if (user_id) {
        queryClient.invalidateQueries({ queryKey: workspaceKeys.assignedTask(user_id!) })
      }
    },
  })
}
