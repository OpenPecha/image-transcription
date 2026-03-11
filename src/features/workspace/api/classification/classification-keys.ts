export const classificationKeys = {
  all: ['classification'] as const,
  assignedTask: (userId: string) =>
    ['classification', 'assigned-task', userId] as const,
}
