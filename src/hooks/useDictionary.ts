import { useState, useEffect, useCallback } from 'react'
import { loadDictionary, isValidWord, isDictionaryLoaded } from '@/lib/dictionary'

export function useDictionary() {
  const [isLoading, setIsLoading] = useState(!isDictionaryLoaded())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDictionaryLoaded()) {
      setIsLoading(false)
      return
    }

    loadDictionary()
      .then(() => {
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [])

  const validateWord = useCallback((word: string): boolean => {
    return isValidWord(word)
  }, [])

  return { isLoading, error, validateWord }
}
