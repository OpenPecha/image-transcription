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

  // Track the taskId we last saved for to prevent saving stale text on task change
  const lastSavedTaskIdRef = useRef<string | null>(null)

  // Generate localStorage key for current task
  const getStorageKey = useCallback((id: string) => {
    return `${DRAFT_KEY_PREFIX}${id}`
  }, [])

  // Load draft from localStorage
  const loadDraft = useCallback(
    (id: string): string | null => {
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
    },
    [getStorageKey]
  )

  // Save draft to localStorage
  const saveDraft = useCallback(
    (id: string, content: string) => {
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
    },
    [getStorageKey]
  )

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

  // Single unified effect for auto-save
  useEffect(() => {
    // Guard: no task to save for
    if (!taskId) {
      lastSavedTaskIdRef.current = null
      return
    }

    // Guard: task just changed — skip this cycle to avoid saving stale debounced text
    if (lastSavedTaskIdRef.current !== taskId) {
      lastSavedTaskIdRef.current = taskId
      return
    }
    // Safe to save: same task, debounced text has settled
    saveDraft(taskId, debouncedText)
  }, [taskId, debouncedText, saveDraft, clearDraft])

  return {
    savedDraft,
    clearDraft,
  }
}
