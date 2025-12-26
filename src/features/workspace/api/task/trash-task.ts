import { useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceKeys } from './workspace-keys'
import { apiClient } from '@/lib/axios'
import { APPLICATION_NAME } from '@/lib/constant'

interface TrashTaskRequest {
  task_id: string
  user_id: string
  submit: boolean
}

interface TrashTaskResponse {
  success: boolean
  message?: string
}

const trashTask = async (params: TrashTaskRequest): Promise<TrashTaskResponse> => {
  return apiClient.post(`/tasks/${APPLICATION_NAME}/submit/${params.task_id}`, {
    user_id: params.user_id,
    submit: false,
  })
}

export const useTrashTask = (user_id?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: trashTask,
    onSuccess: () => {
      if (user_id) {
        queryClient.invalidateQueries({ queryKey: workspaceKeys.assignedTask(user_id!) })
      }
    },
  })
}
