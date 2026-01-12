import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { type Batch } from '@/types'
import { batchKeys } from './batch-keys'

const getBatches = async (): Promise<Batch[]> => {
  return apiClient.get('/batch/')
}

export const useGetBatches = () => {
  return useQuery({
    queryKey: batchKeys.lists(),
    queryFn: getBatches,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}

