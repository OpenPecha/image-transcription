import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { scriptTypeKeys } from './script-type-keys'
import type { ScriptStyle } from '@/types'

const getScriptTypes = async (): Promise<ScriptStyle[]> => {
  return apiClient.get('/script-type/')
}

export const useGetScriptTypes = () => {
  return useQuery({
    queryKey: scriptTypeKeys.all,
    queryFn: getScriptTypes,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    retry: 2,
  })
}
