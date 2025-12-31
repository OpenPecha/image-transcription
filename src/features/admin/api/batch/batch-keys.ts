export const batchKeys = {
  all: ['batches'] as const,
  lists: () => [...batchKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...batchKeys.lists(), filters] as const,
  details: () => [...batchKeys.all, 'detail'] as const,
  detail: (id: string) => [...batchKeys.details(), id] as const,
  reports: () => [...batchKeys.all, 'report'] as const,
  report: (id: string) => [...batchKeys.reports(), id] as const,
  tasks: (batchId: string, state?: string) => 
    [...batchKeys.all, 'tasks', batchId, state] as const,
}

