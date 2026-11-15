import type { GridCell, Die, Position, DetectedWord } from '@/types/game'
import { GRID_SIZE, MIN_WORD_LENGTH } from '@/types/game'

export function createEmptyGrid(): GridCell[][] {
  return Array.from({ length: GRID_SIZE }, (_, row) =>
    Array.from({ length: GRID_SIZE }, (_, col) => ({
      row,
      col,
      dieId: null,
    }))
  )
}

export function placeDieOnGrid(
  grid: GridCell[][],
  dieId: string,
  position: Position
): GridCell[][] {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })))
  newGrid[position.row][position.col].dieId = dieId
  return newGrid
}

export function removeDieFromGrid(
  grid: GridCell[][],
  position: Position
): GridCell[][] {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })))
  newGrid[position.row][position.col].dieId = null
  return newGrid
}

export function getDieAtPosition(
  grid: GridCell[][],
  position: Position
): string | null {
  return grid[position.row]?.[position.col]?.dieId ?? null
}

export function findAllWords(
  grid: GridCell[][],
  dice: Die[],
  validateWord: (word: string) => boolean
): DetectedWord[] {
  const words: DetectedWord[] = []
  const dieMap = new Map(dice.map((d) => [d.id, d]))

  // Find horizontal words
  for (let row = 0; row < GRID_SIZE; row++) {
    let currentWord = ''
    let currentCells: Position[] = []

    for (let col = 0; col <= GRID_SIZE; col++) {
      const cell = grid[row]?.[col]
      const die = cell?.dieId ? dieMap.get(cell.dieId) : null

      if (die) {
        currentWord += die.letter
        currentCells.push({ row, col })
      } else {
        if (currentWord.length >= MIN_WORD_LENGTH) {
          words.push({
            word: currentWord,
            cells: [...currentCells],
            isValid: validateWord(currentWord.toLowerCase()),
            direction: 'horizontal',
          })
        } else if (currentWord.length === 2) {
          // 2-letter sequences are always invalid
          words.push({
            word: currentWord,
            cells: [...currentCells],
            isValid: false,
            direction: 'horizontal',
          })
        }
        currentWord = ''
        currentCells = []
      }
    }
  }

  // Find vertical words
  for (let col = 0; col < GRID_SIZE; col++) {
    let currentWord = ''
    let currentCells: Position[] = []

    for (let row = 0; row <= GRID_SIZE; row++) {
      const cell = grid[row]?.[col]
      const die = cell?.dieId ? dieMap.get(cell.dieId) : null

      if (die) {
        currentWord += die.letter
        currentCells.push({ row, col })
      } else {
        if (currentWord.length >= MIN_WORD_LENGTH) {
          words.push({
            word: currentWord,
            cells: [...currentCells],
            isValid: validateWord(currentWord.toLowerCase()),
            direction: 'vertical',
          })
        } else if (currentWord.length === 2) {
          // 2-letter sequences are always invalid
          words.push({
            word: currentWord,
            cells: [...currentCells],
            isValid: false,
            direction: 'vertical',
          })
        }
        currentWord = ''
        currentCells = []
      }
    }
  }

  return words
}

export function checkConnectivity(grid: GridCell[][], dice: Die[]): boolean {
  const placedDice = dice.filter((d) => d.position !== null)
  if (placedDice.length === 0) return true
  if (placedDice.length === 1) return true

  // BFS from first placed die
  const startPos = placedDice[0].position!
  const visited = new Set<string>()
  const queue: Position[] = [startPos]
  const key = (p: Position) => `${p.row},${p.col}`

  visited.add(key(startPos))

  while (queue.length > 0) {
    const current = queue.shift()!
    const neighbors = [
      { row: current.row - 1, col: current.col },
      { row: current.row + 1, col: current.col },
      { row: current.row, col: current.col - 1 },
      { row: current.row, col: current.col + 1 },
    ]

    for (const neighbor of neighbors) {
      const neighborKey = key(neighbor)
      if (
        neighbor.row >= 0 &&
        neighbor.row < GRID_SIZE &&
        neighbor.col >= 0 &&
        neighbor.col < GRID_SIZE &&
        !visited.has(neighborKey) &&
        grid[neighbor.row][neighbor.col].dieId !== null
      ) {
        visited.add(neighborKey)
        queue.push(neighbor)
      }
    }
  }

  return visited.size === placedDice.length
}
