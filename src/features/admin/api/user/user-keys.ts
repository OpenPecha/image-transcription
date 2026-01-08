import type { UserFilters, UserContributionFilters } from '@/types'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  contributions: (userId: string, filters: UserContributionFilters) =>
    [...userKeys.detail(userId), 'contributions', filters] as const,
}