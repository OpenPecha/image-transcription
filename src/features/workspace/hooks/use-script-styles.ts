import { useMemo, useCallback } from 'react'
import { useGetScriptTypes } from '../api/script-type'
import { useUIStore } from '@/store/use-ui-store'
import {
  getParentStyles,
  getChildStyles,
  getStyleById,
  isChildOf,
  getDisplayName,
} from '@/types'
import type { ScriptType, ScriptStyle } from '@/types'

export function useScriptStyles() {
  const { data: styles = [], isLoading, isError } = useGetScriptTypes()
  const language = useUIStore((s) => s.language)

  const parentStyles = useMemo(() => getParentStyles(styles), [styles])

  const getChildren = useCallback(
    (parentId: ScriptType) => getChildStyles(styles, parentId),
    [styles],
  )

  const getById = useCallback(
    (id: ScriptType) => getStyleById(styles, id),
    [styles],
  )

  const getName = useCallback(
    (id: string) => getDisplayName(styles, id, language),
    [styles, language],
  )

  const isChild = useCallback(
    (parentId: ScriptType, childId: ScriptType) => isChildOf(styles, parentId, childId),
    [styles],
  )

  const stylesMap = useMemo(() => {
    const map = new Map<string, ScriptStyle>()
    for (const s of styles) {
      map.set(s.id, s)
    }
    return map
  }, [styles])

  return {
    styles,
    parentStyles,
    stylesMap,
    getChildren,
    getById,
    getName,
    isChild,
    isLoading,
    isError,
  }
}
