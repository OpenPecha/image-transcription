import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { type User } from '@/types';
import { groupKeys } from './group-keys';

const getGroupUsers = async (id: string): Promise<User[]> => {
  return apiClient.get(`/group/${id}/users`);
};

export const useGetGroupUsers = (id: string, enabled = true) => {
  return useQuery({
    queryKey: groupKeys.users(id),
    queryFn: () => getGroupUsers(id),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
};

