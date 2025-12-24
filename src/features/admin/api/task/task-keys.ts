export const taskKeys = {
  all: ['tasks'] as const,
  list: (params?: { status?: string; groupId?: string; search?: string }) => 
    ['tasks', 'list', params] as const,
  detail: (id: string) => ['tasks', id] as const,
};

