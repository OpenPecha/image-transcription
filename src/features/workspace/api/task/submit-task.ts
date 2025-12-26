import { useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceKeys } from './workspace-keys'
import { apiClient } from '@/lib/axios'
import { APPLICATION_NAME } from '@/lib/constant'
interface SubmitTaskParams {
  task_id: string
  user_id: string
  transcript: string
  submit: boolean
}

interface SubmitTaskResponse {
  success: boolean
  message?: string
}

const submitTask = async (params: SubmitTaskParams): Promise<SubmitTaskResponse> => {
  return apiClient.post(`/tasks/${APPLICATION_NAME}/submit/${params.task_id}`, {
    user_id: params.user_id,
    transcript: params.transcript,
    submit: params.submit,
  })
}

export const useSubmitTask = (user_id?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitTask,
    onSuccess: () => {
      if (user_id) {
        queryClient.invalidateQueries({ queryKey: workspaceKeys.assignedTask(user_id!) })
      }
    },
  })
}
