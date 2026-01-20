import Papa from 'papaparse'

import type { BatchTask, BatchTaskState } from '@/types'

/**
 * CSV row structure for batch task export
 */
interface BatchTaskCsvRow {
  filenumber: string
  image: string
  transcription: string
  Annotator: string
  Reviewer: string
  'Final Reviewer': string
  'Trashed By': string
}

/**
 * Maps task state to the corresponding username column
 */
const STATE_TO_COLUMN_MAP: Record<BatchTaskState, keyof BatchTaskCsvRow | null> = {
  pending: 'Annotator',
  annotated: 'Annotator',
  reviewed: 'Reviewer',
  finalised: 'Final Reviewer',
  trashed: 'Trashed By',
}

/**
 * Transforms a BatchTask to a CSV row format
 */
function transformTaskToCsvRow(task: BatchTask): BatchTaskCsvRow {
  const row: BatchTaskCsvRow = {
    filenumber: task.task_name,
    image: task.task_url,
    transcription: task.task_transcript ?? '',
    Annotator: '',
    Reviewer: '',
    'Final Reviewer': '',
    'Trashed By': '',
  }

  // Assign username to appropriate column based on state
  const column = STATE_TO_COLUMN_MAP[task.state]
  if (column && task.username) {
    row[column] = task.username
  }

  return row
}

/**
 * Sanitizes filename by removing invalid characters
 */
function sanitizeFilename(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, '-').trim() || 'batch-export'
}

/**
 * Triggers a browser download for the given content
 */
function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Exports batch tasks to CSV and triggers download
 *
 * @param tasks - Array of batch tasks to export
 * @param batchName - Name of the batch (used for filename)
 */
export function exportBatchTasksToCsv(tasks: BatchTask[], batchName: string): void {
  if (tasks.length === 0) {
    return
  }

  const csvRows = tasks.map(transformTaskToCsvRow)

  const csvContent = Papa.unparse(csvRows, {
    quotes: true, // Wrap all fields in quotes to preserve line breaks and special characters
    newline: '\n',
  })

  const filename = `${sanitizeFilename(batchName)}.csv`
  downloadFile(csvContent, filename)
}
