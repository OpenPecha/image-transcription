import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { type UserListResponse, type UserFilters } from '@/types'
import { userKeys } from './user-keys'

const getUsers = async (filters: UserFilters): Promise<UserListResponse> => {
  const params = new URLSearchParams()
  
  if (filters.search) params.append('search', filters.search)
  if (filters.role) params.append('role', filters.role)
  if (filters.group_id) params.append('group_id', filters.group_id)
  if (filters.offset !== undefined) params.append('offset', String(filters.offset))
  if (filters.limit) params.append('limit', String(filters.limit))

  const queryString = params.toString()
  return apiClient.get(`/user/${queryString ? `?${queryString}` : ''}`)
}

export const useGetUsers = (filters: UserFilters = {}) => {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => getUsers(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    retry: 1,
  })
}

const DEFAULT_PAGE_SIZE = 50

export const useGetAllUsers = (filters: Omit<UserFilters, 'offset' | 'limit'> = {}) => {
  return useInfiniteQuery({
    queryKey: userKeys.allList(filters),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getUsers({
        ...filters,
        offset: pageParam,
        limit: DEFAULT_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((acc, page) => acc + page.items.length, 0)
      const total = lastPage.total ?? 0
      if (loaded >= total) return undefined
      return loaded
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}