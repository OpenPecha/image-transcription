export const taskKeys = {
  all: ['tasks'] as const,
  list: (filters?: { status?: string; groupId?: string }) => 
    ['tasks', 'list', filters] as const,
  detail: (id: string) => ['tasks', id] as const,
};

