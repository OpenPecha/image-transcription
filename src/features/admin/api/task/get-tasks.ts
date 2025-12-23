import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { Task } from '@/types';
import { taskKeys } from './task-keys';

interface GetTasksParams {
  status?: string;
  groupId?: string;
  search?: string;
}

const getTasks = async (params?: GetTasksParams): Promise<Task[]> => {
  const searchParams = new URLSearchParams();
  
  if (params?.status) searchParams.set('status', params.status);
  if (params?.groupId) searchParams.set('groupId', params.groupId);
  if (params?.search) searchParams.set('search', params.search);

  const queryString = searchParams.toString();
  const url = queryString ? `/tasks?${queryString}` : '/tasks';
  
  return apiClient.get(url);
};

export const useGetTasks = (params?: GetTasksParams) => {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => getTasks(params),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};

