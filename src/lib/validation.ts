import type { Die, GridCell, DetectedWord } from '@/types/game'
import { checkConnectivity } from './grid'

export interface ValidationResult {
  allDicePlaced: boolean
  allWordsValid: boolean
  allConnected: boolean
  isWin: boolean
  invalidWords: string[]
}

export function validateGameState(
  dice: Die[],
  grid: GridCell[][],
  detectedWords: DetectedWord[]
): ValidationResult {
  const placedDice = dice.filter((d) => d.position !== null)
  const allDicePlaced = placedDice.length === dice.length

  const invalidWords = detectedWords
    .filter((w) => !w.isValid)
    .map((w) => w.word)
  const allWordsValid = invalidWords.length === 0 && detectedWords.length > 0

  const allConnected = checkConnectivity(grid, dice)

  const isWin = allDicePlaced && allWordsValid && allConnected

  return {
    allDicePlaced,
    allWordsValid,
    allConnected,
    isWin,
    invalidWords,
  }
}

export function formatTime(seconds: number): string {
  if (seconds < 0) {
    // Overtime: show as +M:SS
    const overtime = Math.abs(seconds)
    const mins = Math.floor(overtime / 60)
    const secs = overtime % 60
    return `+${mins}:${secs.toString().padStart(2, '0')}`
  }
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatTotalTime(timeRemaining: number, initialTime: number): string {
  // Total time taken = initial time + overtime (if any)
  const timeTaken = initialTime - timeRemaining
  const mins = Math.floor(timeTaken / 60)
  const secs = timeTaken % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
