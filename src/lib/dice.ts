import type { Die } from '@/types/game'
import { DICE_COUNT } from '@/types/game'

// Official Qless dice faces - each die has 6 predetermined letters
const QLESS_DICE: string[][] = [
  ['M', 'M', 'L', 'L', 'B', 'Y'],    // Die 1: MMLLBY
  ['V', 'F', 'G', 'K', 'P', 'P'],    // Die 2: VFGKPP
  ['H', 'H', 'N', 'N', 'R', 'R'],    // Die 3: HHNNRR
  ['D', 'F', 'R', 'L', 'L', 'W'],    // Die 4: DFRLLW
  ['R', 'R', 'D', 'L', 'G', 'G'],    // Die 5: RRDLGG
  ['X', 'K', 'B', 'S', 'Z', 'N'],    // Die 6: XKBSZN
  ['W', 'H', 'H', 'T', 'T', 'P'],    // Die 7: WHHTTP
  ['C', 'C', 'B', 'T', 'J', 'D'],    // Die 8: CCBTJD
  ['C', 'C', 'M', 'T', 'T', 'S'],    // Die 9: CCMTTS
  ['O', 'I', 'I', 'N', 'N', 'Y'],    // Die 10: OIINNY
  ['A', 'E', 'I', 'O', 'U', 'U'],    // Die 11: AEIOUU
  ['A', 'A', 'E', 'E', 'O', 'O'],    // Die 12: AAEEOO
]

function getRandomFace(dieFaces: string[]): string {
  return dieFaces[Math.floor(Math.random() * dieFaces.length)]
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function rollDice(): Die[] {
  // Shuffle the order of dice
  const shuffledDiceOrder = shuffleArray([...Array(DICE_COUNT).keys()])

  return shuffledDiceOrder.map((dieIndex, index) => ({
    id: `die-${index}`,
    letter: getRandomFace(QLESS_DICE[dieIndex]),
    position: null,
  }))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}
