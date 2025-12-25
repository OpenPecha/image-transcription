import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { type User } from '@/types';
import { groupKeys } from './group-keys';

const getGroupUsers = async (name: string): Promise<User[]> => {
  return apiClient.get(`/group/${name}/users`);
};

export const useGetGroupUsers = (name: string, enabled = true) => {
  return useQuery({
    queryKey: groupKeys.users(name),
    queryFn: () => getGroupUsers(name),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
};

