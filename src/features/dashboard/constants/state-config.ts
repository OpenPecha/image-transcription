import type { ClassificationTaskState } from '@/types'

interface StateDisplay {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
}

export const STATE_CONFIG: Record<ClassificationTaskState, StateDisplay> = {
  annotating: { label: 'Annotating', variant: 'default' },
  annotating_b: { label: 'Annotating (B)', variant: 'default' },
  reviewing: { label: 'In Review', variant: 'outline' },
}
