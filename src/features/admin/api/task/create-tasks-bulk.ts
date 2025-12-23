import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { TaskUploadPayload, BulkCreateTasksResponse } from '@/types';
import { taskKeys } from './task-keys';

interface CreateTasksBulkParams {
  payload: TaskUploadPayload;
  groupId: string;
  batchName: string;
}

const createTasksBulk = async (params: CreateTasksBulkParams): Promise<BulkCreateTasksResponse> => {
  return apiClient.post('/tasks/bulk', params);
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

