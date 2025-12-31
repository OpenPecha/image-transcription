import { BATCH_STATS_CONFIG, WORKFLOW_STATS, type BatchStatKey, type BatchReport } from '@/types'
import type { ProgressSegmentData } from './progress-bar.types'

/**
 * Calculate percentage with precision
 */
export function calculatePercentage(count: number, total: number): number {
  if (total === 0) return 0
  return Math.round((count / total) * 100)
}

/**
 * Determine if label should be shown based on percentage threshold
 */
export function shouldShowLabel(percentage: number, threshold: number): boolean {
  return percentage >= threshold
}

/**
 * Get segment configuration for a status
 */
export function getSegmentConfig(status: BatchStatKey) {
  return BATCH_STATS_CONFIG[status]
}

/**
 * Build segment data from batch report for workflow statuses
 */
export function buildWorkflowSegments(report: BatchReport): ProgressSegmentData[] {
  const total = report.total_tasks - report.trashed // Exclude trashed from total for workflow

  return WORKFLOW_STATS
    .map((status) => {
      const config = BATCH_STATS_CONFIG[status]
      const count = report[status]
      const percentage = calculatePercentage(count, total)

      return {
        status,
        count,
        percentage,
        barColor: config.barColor,
        textColor: config.textColor,
        label: config.label,
      }
    })
    .filter((segment) => segment.percentage > 0) // Filter out 0% segments
}

/**
 * Build trashed segment data
 */
export function buildTrashedSegment(report: BatchReport): ProgressSegmentData | null {
  if (report.trashed === 0) return null

  const config = BATCH_STATS_CONFIG.trashed
  const percentage = calculatePercentage(report.trashed, report.total_tasks)

  return {
    status: 'trashed',
    count: report.trashed,
    percentage,
    barColor: config.barColor,
    textColor: config.textColor,
    label: config.label,
    isHatched: true,
  }
}

/**
 * Calculate finalized percentage
 */
export function getFinalizedPercentage(report: BatchReport): number {
  const activeTotal = report.total_tasks - report.trashed
  return calculatePercentage(report.finalised, activeTotal)
}

