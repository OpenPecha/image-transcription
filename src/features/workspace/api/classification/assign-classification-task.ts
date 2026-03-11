import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { APPLICATION_NAME } from '@/lib/constant'
import { classificationKeys } from './classification-keys'
import type { ClassificationTask } from '@/types'

const getClassificationTask = async (
  userId: string,
): Promise<ClassificationTask | null> => {
  try {
    return await apiClient.get(
      `/tasks/${APPLICATION_NAME}/assign/${userId}`,
    )
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as { response?: { status: number } }
      if (axiosError.response?.status === 404) return null
    }
    throw new Error('Failed to fetch classification task')
  }
}

export const useGetClassificationTask = (userId?: string) => {
  return useQuery({
    queryKey: classificationKeys.assignedTask(userId ?? ''),
    queryFn: () => getClassificationTask(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60,
    retry: 1,
  })
}
