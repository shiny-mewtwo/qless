import { useState, useEffect, useCallback, useRef } from 'react'

export function useTimer(initialTime: number) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback((newTime?: number) => {
    setIsRunning(false)
    setTimeRemaining(newTime ?? initialTime)
  }, [initialTime])

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeRemaining])

  return {
    timeRemaining,
    isRunning,
    isExpired: timeRemaining === 0,
    start,
    pause,
    reset,
  }
}
