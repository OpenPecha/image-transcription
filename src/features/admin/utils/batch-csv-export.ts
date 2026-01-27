import Papa from 'papaparse'

import type { BatchExportTask } from '@/types'

/**
 * CSV column headers mapping to BatchExportTask fields
 * Order determines column order in exported CSV
 */
const CSV_COLUMNS = [
  { key: 'file_number', header: 'File Number' },
  { key: 'image_url', header: 'Image URL' },
  { key: 'initial_transcription', header: 'Initial Transcription' },
  { key: 'status', header: 'Status' },
  { key: 'annotator_username', header: 'Annotator' },
  { key: 'annotation_transcript', header: 'Annotation Transcript' },
  { key: 'annotator_char_count', header: 'Annotator Char Count' },
  { key: 'annotation_rejection_count', header: 'Annotation Rejection Count' },
  { key: 'reviewer_username', header: 'Reviewer' },
  { key: 'review_transcript', header: 'Review Transcript' },
  { key: 'reviewer_added_char', header: 'Reviewer Added Char' },
  { key: 'reviewer_deleted_char', header: 'Reviewer Deleted Char' },
  { key: 'review_rejection_count', header: 'Review Rejection Count' },
  { key: 'final_reviewer_username', header: 'Final Reviewer' },
  { key: 'final_transcript', header: 'Final Transcript' },
  { key: 'final_reviewer_added_char', header: 'Final Reviewer Added Char' },
  { key: 'final_reviewer_deleted_char', header: 'Final Reviewer Deleted Char' },
  { key: 'trashed_by', header: 'Trashed By' },
] as const satisfies ReadonlyArray<{ key: keyof BatchExportTask; header: string }>

/**
 * Transforms a BatchExportTask to a CSV row with all fields
 * Null values are converted to empty strings
 */
function transformTaskToCsvRow(task: BatchExportTask): Record<string, string | number> {
  const row: Record<string, string | number> = {}

  for (const { key, header } of CSV_COLUMNS) {
    const value = task[key]
    row[header] = value ?? ''
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
 * @param tasks - Array of batch export tasks to export
 * @param batchName - Name of the batch (used for filename)
 */
export function exportBatchTasksToCsv(tasks: BatchExportTask[], batchName: string): void {
  if (tasks.length === 0) {
    return
  }

  const csvRows = tasks.map(transformTaskToCsvRow)
  const headers = CSV_COLUMNS.map(({ header }) => header)

  const csvContent = Papa.unparse(csvRows, {
    columns: headers,
    quotes: true,
    newline: '\n',
  })

  const filename = `${sanitizeFilename(batchName)}.csv`
  downloadFile(csvContent, filename)
}
