export const workspaceKeys = {
  all: ['workspace'] as const,
  assignedTask: (username: string) => ['workspace', 'assigned-task', username] as const,
  taskBatch: (userId: string, groupId?: string) => ['workspace', 'task-batch', userId, groupId] as const,
};

