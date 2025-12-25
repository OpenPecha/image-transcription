import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { TaskUploadItem, BulkCreateTasksResponse } from '@/types';
import { taskKeys } from './task-keys';

interface CreateTasksBulkParams {
  tasks: TaskUploadItem[];
  group: string;
  batch_name: string;
}

const createTasksBulk = async (params: CreateTasksBulkParams): Promise<BulkCreateTasksResponse> => {
  return apiClient.post('/tasks/', params);
};

export const useCreateTasksBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTasksBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
};

