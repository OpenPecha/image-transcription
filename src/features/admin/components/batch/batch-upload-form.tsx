import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, FileJson, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { batchUploadFormSchema, type BatchUploadFormValues } from '@/schema/batch-schema'
import { useGetGroups } from '../../api/group'
import { validateBatchFile, type ValidationResult } from './batch-file-validator'
import type { BatchUploadTask } from '@/types'

interface BatchUploadFormProps {
  onSubmit: (data: BatchUploadFormValues, tasks: BatchUploadTask[]) => void
  isSubmitting: boolean
  uploadProgress: number
}

export function BatchUploadForm({
  onSubmit,
  isSubmitting,
  uploadProgress,
}: BatchUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  const { data: groups = [], isLoading: isLoadingGroups } = useGetGroups()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BatchUploadFormValues>({
    resolver: zodResolver(batchUploadFormSchema),
    defaultValues: {
      batch_name: '',
      group_id: '',
    },
  })

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setIsValidating(true)
    setValidationResult(null)

    const result = await validateBatchFile(file)
    setValidationResult(result)
    setIsValidating(false)
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setValidationResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFormSubmit = (data: BatchUploadFormValues) => {
    if (validationResult?.success) {
      onSubmit(data, validationResult.tasks)
    }
  }

  const isValid = validationResult?.success === true
  const hasErrors = validationResult?.success === false

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Batch Name */}
      <div className="space-y-2">
        <Label htmlFor="batch_name">Batch Name</Label>
        <Input
          id="batch_name"
          placeholder="Enter batch name"
          {...register('batch_name')}
          disabled={isSubmitting}
        />
        {errors.batch_name && (
          <p className="text-sm text-destructive">{errors.batch_name.message}</p>
        )}
      </div>

      {/* Group Selection */}
      <div className="space-y-2">
        <Label htmlFor="group_id">Group</Label>
        <Select
          disabled={isSubmitting || isLoadingGroups}
          onValueChange={(value) => setValue('group_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoadingGroups ? 'Loading groups...' : 'Select a group'} />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.group_id && (
          <p className="text-sm text-destructive">{errors.group_id.message}</p>
        )}
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>Tasks File (JSON)</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isSubmitting}
        />

        {!selectedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              'hover:border-primary hover:bg-primary/5',
              isSubmitting && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">Click to upload JSON file</p>
            <p className="text-xs text-muted-foreground mt-1">
              File should contain an array of tasks with name, url, and optional transcript
            </p>
          </div>
        ) : (
          <div
            className={cn(
              'border rounded-lg p-4',
              isValid && 'border-emerald-500 bg-emerald-50',
              hasErrors && 'border-destructive bg-destructive/5',
              isValidating && 'border-muted'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    isValid && 'bg-emerald-100',
                    hasErrors && 'bg-destructive/10',
                    isValidating && 'bg-muted'
                  )}
                >
                  <FileJson
                    className={cn(
                      'h-5 w-5',
                      isValid && 'text-emerald-600',
                      hasErrors && 'text-destructive',
                      isValidating && 'text-muted-foreground'
                    )}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleClearFile}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Validation Status */}
            <div className="mt-3">
              {isValidating && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Validating file...
                </div>
              )}
              {isValid && validationResult && (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  {validationResult.tasks.length} tasks ready to upload
                </div>
              )}
              {hasErrors && validationResult && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Validation errors:
                  </div>
                  <ul className="text-xs text-destructive space-y-0.5 ml-6 list-disc">
                    {validationResult.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {isSubmitting && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload Batch
        </Button>
      </div>
    </form>
  )
}

