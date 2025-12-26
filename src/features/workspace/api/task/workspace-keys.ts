export const workspaceKeys = {
  all: ['workspace'] as const,
  assignedTask: (userId: string) => ['workspace', 'assigned-task', userId] as const,
  taskBatch: (userId: string, groupId?: string) => ['workspace', 'task-batch', userId, groupId] as const,
};

