import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { APPLICATION_NAME } from '@/lib/constant'
import { type ApplicationBatchReport } from '@/types'
import { batchKeys } from './batch-keys'

const getApplicationReport = async (): Promise<ApplicationBatchReport> => {
  return apiClient.get(`/batch/application/${APPLICATION_NAME}/reports`)
}

export const useGetApplicationReport = () => {
  return useQuery({
    queryKey: batchKeys.applicationReport(APPLICATION_NAME),
    queryFn: getApplicationReport,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  })
}
