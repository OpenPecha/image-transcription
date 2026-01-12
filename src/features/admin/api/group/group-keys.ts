export const groupKeys = {
  all: ['groups'] as const,
  detail: (id: string) => ['groups', id] as const,
  users: (id: string) => ['groups', id, 'users'] as const,
};