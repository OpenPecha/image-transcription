export const workspaceKeys = {
  assignedTask: (userId: string) => ['workspace', 'assigned-task', userId] as const,
};

