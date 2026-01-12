import z from 'zod'

// Schema for individual task in upload JSON
export const batchUploadTaskSchema = z.object({
  name: z
    .string()
    .min(1, 'Task name cannot be empty'),
  url: z
    .string()
    .url('Invalid URL format'),
  transcript: z.string().nullable().optional(),
  orientation: z.enum(['landscape', 'portrait']).optional(),
})

// Schema for tasks array
export const batchTasksArraySchema = z
  .array(batchUploadTaskSchema)
  .min(1, 'At least one task is required')

// Schema for upload form
export const batchUploadFormSchema = z.object({
  batch_name: z
    .string()
    .min(2, 'Batch name must be at least 2 characters')
    .max(100, 'Batch name must be less than 100 characters'),
  group_id: z
    .string()
    .min(1, 'Please select a group'),
})

export type BatchUploadFormValues = z.infer<typeof batchUploadFormSchema>
export type BatchUploadTaskValues = z.infer<typeof batchUploadTaskSchema>

