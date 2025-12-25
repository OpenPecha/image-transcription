export const groupKeys = {
  all: ['groups'] as const,
  detail: (name: string) => ['groups', name] as const,
  users: (name: string) => ['groups', name, 'users'] as const,
};