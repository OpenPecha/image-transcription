import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { APPLICATION_NAME } from '@/lib/constant'
import { classificationKeys } from './classification-keys'
import type { ScriptType, ReviewerChoice } from '@/types'

interface AnnotatorSubmitParams {
  task_id: string
  user_id: string
  submit: true
  script_type: ScriptType
}

interface AnnotatorTrashParams {
  task_id: string
  user_id: string
  submit: false
}

interface ReviewerChoiceParams {
  task_id: string
  user_id: string
  submit: true
  choice: ReviewerChoice
  script_type?: ScriptType
}

export type ClassificationSubmitParams =
  | AnnotatorSubmitParams
  | AnnotatorTrashParams
  | ReviewerChoiceParams

interface SubmitResponse {
  success: boolean
  message?: string
}

const submitClassification = async (
  params: ClassificationSubmitParams,
): Promise<SubmitResponse> => {
  const { task_id, ...body } = params
  return apiClient.post(
    `/tasks/${APPLICATION_NAME}/submit/${task_id}`,
    body,
  )
}

export const useSubmitClassification = (userId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitClassification,
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: classificationKeys.assignedTask(userId),
        })
      }
    },
  })
}
