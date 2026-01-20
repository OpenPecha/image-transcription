import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { type BatchUploadRequest } from '@/types'
import { batchKeys } from './batch-keys'
import { APPLICATION_NAME } from '@/lib/constant'
const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

interface UploadBatchOptions {
  onProgress?: (progress: number) => void
}

const uploadBatch = async (
  data: BatchUploadRequest,
  options?: UploadBatchOptions
): Promise<void> => {
  await axios.post(`${baseURL}tasks/${APPLICATION_NAME}/`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && options?.onProgress) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        options.onProgress(progress)
      }
    },
  })
}

export const useUploadBatch = (options?: UploadBatchOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BatchUploadRequest) => uploadBatch(data, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.all })
    },
  })
}

