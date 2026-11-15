export interface Position {
  row: number
  col: number
}

export interface Die {
  id: string
  letter: string
  position: Position | null // null = in tray
}

export interface GridCell {
  row: number
  col: number
  dieId: string | null
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'won'

export interface DetectedWord {
  word: string
  cells: Position[]
  isValid: boolean
  direction: 'horizontal' | 'vertical'
}

export interface GameState {
  dice: Die[]
  grid: GridCell[][]
  status: GameStatus
  timeRemaining: number
  selectedDieId: string | null
  detectedWords: DetectedWord[]
}

export type GameAction =
  | { type: 'ROLL_DICE' }
  | { type: 'PLACE_DIE'; dieId: string; position: Position }
  | { type: 'REMOVE_DIE'; dieId: string }
  | { type: 'SWAP_DICE'; dieId: string; targetDieId: string }
  | { type: 'SWAP_TRAY_DICE'; dieId: string; targetDieId: string }
  | { type: 'SELECT_DIE'; dieId: string | null }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }
  | { type: 'RESET_BOARD' }
  | { type: 'UPDATE_WORDS'; words: DetectedWord[] }
  | { type: 'WIN' }

export const GRID_SIZE = 10
export const DICE_COUNT = 12
export const MIN_WORD_LENGTH = 3
export const INITIAL_TIME = 300 // 5 minutes in seconds
