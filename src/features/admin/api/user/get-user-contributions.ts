import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { type UserContribution, type UserContributionFilters } from '@/types'
import { userKeys } from './user-keys'

const getUserContributions = async (
  userId: string,
  filters: UserContributionFilters
): Promise<UserContribution[]> => {
  const params = new URLSearchParams()
  params.append('start_date', filters.start_date)
  params.append('end_date', filters.end_date)

  return apiClient.get(`/user/${userId}/contributions?${params.toString()}`)
}

export const useGetUserContributions = (
  userId: string,
  filters: UserContributionFilters,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: userKeys.contributions(userId, filters),
    queryFn: () => getUserContributions(userId, filters),
    staleTime: 1000 * 60 * 2,
    retry: 1,
    enabled: enabled && !!userId && !!filters.start_date && !!filters.end_date,
  })
}

