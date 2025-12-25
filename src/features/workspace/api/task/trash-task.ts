import { useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceKeys } from './workspace-keys'

const BASE_URL = 'https://openpecha-annotation-tool-dev.web.app/api'

interface TrashTaskRequest {
  task_id: string
  username: string
  submit: boolean
}

interface TrashTaskResponse {
  success: boolean
  message?: string
}

const trashTask = async (params: TrashTaskRequest): Promise<TrashTaskResponse> => {
  const response = await fetch(`${BASE_URL}/tasks/submit/${params.task_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify({username: params.username, submit: false}),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Trash failed' }))
    throw new Error(error.message || 'Trash failed')
  }

  return response.json()
}

export const useTrashTask = (username?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: trashTask,
    onSuccess: () => {
      if (username) {
        queryClient.invalidateQueries({ queryKey: workspaceKeys.assignedTask(username) })
      }
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all })
    },
  })
}

