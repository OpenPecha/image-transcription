import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { taskKeys } from './task-keys';

interface DeleteTaskResponse {
  success: boolean;
  message?: string;
}

const deleteTask = async (id: string): Promise<DeleteTaskResponse> => {
  return apiClient.delete(`/tasks/${id}`);
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
};

