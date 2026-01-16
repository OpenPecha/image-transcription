import { useEffect, useCallback, useRef } from 'react'

import { useDebouncedValue } from '@/hooks'

const DRAFT_KEY_PREFIX = 'draft_task_'

interface DraftData {
  text: string
  timestamp: number
}

interface UseLocalDraftOptions {
  taskId: string | null
  text: string
  delay?: number
}

interface UseLocalDraftReturn {
  savedDraft: string | null
  clearDraft: () => void
}

/**
 * Hook to auto-save editor drafts to localStorage
 * - Debounces saves to avoid excessive writes
 * - Automatically loads drafts when task changes
 * - Provides clearDraft for cleanup on submit/approve/trash
 */
export function useLocalDraft({
  taskId,
  text,
  delay = 500,
}: UseLocalDraftOptions): UseLocalDraftReturn {
  const debouncedText = useDebouncedValue(text, delay)
  const initialLoadRef = useRef(true)

  // Generate localStorage key for current task
  const getStorageKey = useCallback((id: string) => {
    return `${DRAFT_KEY_PREFIX}${id}`
  }, [])

  // Load draft from localStorage
  const loadDraft = useCallback((id: string): string | null => {
    try {
      const key = getStorageKey(id)
      const stored = localStorage.getItem(key)
      if (stored) {
        const data: DraftData = JSON.parse(stored)
        return data.text
      }
    } catch (error) {
      console.error('Failed to load draft from localStorage:', error)
    }
    return null
  }, [getStorageKey])

  // Save draft to localStorage
  const saveDraft = useCallback((id: string, content: string) => {
    try {
      const key = getStorageKey(id)
      const data: DraftData = {
        text: content,
        timestamp: Date.now(),
      }
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save draft to localStorage:', error)
    }
  }, [getStorageKey])

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    if (!taskId) return
    try {
      const key = getStorageKey(taskId)
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to clear draft from localStorage:', error)
    }
  }, [taskId, getStorageKey])

  // Get saved draft for current task (only on initial load)
  const savedDraft = taskId ? loadDraft(taskId) : null

  // Auto-save debounced text to localStorage
  useEffect(() => {
    // Skip initial save to avoid overwriting restored draft
    if (initialLoadRef.current) {
      initialLoadRef.current = false
      return
    }

    if (!taskId || debouncedText === '') return

    saveDraft(taskId, debouncedText)
  }, [taskId, debouncedText, saveDraft])

  // Reset initial load flag when task changes
  useEffect(() => {
    initialLoadRef.current = true
  }, [taskId])

  return {
    savedDraft,
    clearDraft,
  }
}
