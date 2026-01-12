import { batchTasksArraySchema } from '@/schema/batch-schema'
import type { BatchUploadTask } from '@/types'

export interface ValidationSuccess {
  success: true
  tasks: BatchUploadTask[]
}

export interface ValidationError {
  success: false
  errors: string[]
}

export type ValidationResult = ValidationSuccess | ValidationError

export async function validateBatchFile(file: File): Promise<ValidationResult> {
  // Check file type
  if (!file.name.endsWith('.json')) {
    return {
      success: false,
      errors: ['File must be a JSON file (.json)'],
    }
  }

  // Read file content
  let content: string
  try {
    content = await file.text()
  } catch {
    return {
      success: false,
      errors: ['Failed to read file'],
    }
  }

  // Parse JSON
  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    return {
      success: false,
      errors: ['Invalid JSON format. Please check your file syntax.'],
    }
  }

  // Validate against schema
  const result = batchTasksArraySchema.safeParse(parsed)
  console.log(result)

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      const path = issue.path.join('.')
      return path ? `${path}: ${issue.message}` : issue.message
    })
    return {
      success: false,
      errors: errors.slice(0, 5), // Limit to first 5 errors
    }
  }

  return {
    success: true,
    tasks: result.data,
  }
}

