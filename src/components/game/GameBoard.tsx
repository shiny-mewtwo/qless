import { GridCell } from './GridCell'
import { Die } from './Die'
import type { GridCell as GridCellType, Die as DieType, Position, DetectedWord } from '@/types/game'
import { GRID_SIZE } from '@/types/game'

interface GameBoardProps {
  grid: GridCellType[][]
  dice: DieType[]
  detectedWords: DetectedWord[]
  selectedDieId: string | null
  draggingDieId: string | null
  onCellClick: (position: Position) => void
  onDieClick: (dieId: string) => void
}

export function GameBoard({
  grid,
  dice,
  detectedWords,
  selectedDieId,
  draggingDieId,
  onCellClick,
  onDieClick,
}: GameBoardProps) {
  const dieMap = new Map(dice.map((d) => [d.id, d]))

  // Build a set of cells that are part of invalid words
  const invalidCells = new Set<string>()
  detectedWords
    .filter((w) => !w.isValid)
    .forEach((word) => {
      word.cells.forEach((cell) => {
        invalidCells.add(`${cell.row}-${cell.col}`)
      })
    })

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden pb-2 -mx-2 px-2 flex justify-center">
      <div className="inline-block bg-white dark:bg-slate-800 rounded-lg shadow-lg p-1 sm:p-2 min-w-min">
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {grid.flat().map((cell) => {
            const die = cell.dieId ? dieMap.get(cell.dieId) : null
            const cellKey = `${cell.row}-${cell.col}`
            const isInvalidWord = invalidCells.has(cellKey)
            const isDieBeingDragged = die?.id === draggingDieId

            return (
              <GridCell
                key={cellKey}
                position={{ row: cell.row, col: cell.col }}
                onClick={() => onCellClick({ row: cell.row, col: cell.col })}
                isInvalidWord={isInvalidWord}
              >
                {die && !isDieBeingDragged && (
                  <Die
                    id={die.id}
                    letter={die.letter}
                    isSelected={die.id === selectedDieId}
                    isInvalid={isInvalidWord}
                    onClick={() => onDieClick(die.id)}
                  />
                )}
              </GridCell>
            )
          })}
        </div>
      </div>
    </div>
  )
}
