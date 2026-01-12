import type { BatchStatKey } from '@/types'

export interface ProgressSegmentData {
  status: BatchStatKey
  count: number
  percentage: number
  barColor: string
  textColor: string
  label: string
  isHatched?: boolean
}

export interface ProgressBarConfig {
  /** Minimum percentage to show label inside segment */
  labelThreshold: number
  /** Height of the progress bar */
  barHeight: string
  /** Animation duration in ms */
  animationDuration: number
}

export const DEFAULT_PROGRESS_BAR_CONFIG: ProgressBarConfig = {
  labelThreshold: 2,
  barHeight: 'h-8',
  animationDuration: 500,
}

