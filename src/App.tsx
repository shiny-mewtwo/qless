import { useState, useCallback, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { Moon, Sun } from 'lucide-react'
import { GameBoard } from '@/components/game/GameBoard'
import { DiceTray } from '@/components/game/DiceTray'
import { Die } from '@/components/game/Die'
import { Timer } from '@/components/game/Timer'
import { GameControls } from '@/components/game/GameControls'
import { WinModal } from '@/components/game/WinModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGameState } from '@/hooks/useGameState'
import { useDictionary } from '@/hooks/useDictionary'
import { useDarkMode } from '@/hooks/useDarkMode'
import type { Position } from '@/types/game'

function App() {
  const { isLoading: isDictLoading, validateWord } = useDictionary()
  const { isDark, toggle: toggleDarkMode } = useDarkMode()
  const {
    state,
    validation,
    rollNewGame,
    placeDie,
    removeDie,
    swapDice,
    swapTrayDice,
    selectDie,
    pause,
    resume,
    resetBoard,
  } = useGameState(validateWord)

  const [activeDieId, setActiveDieId] = useState<string | null>(null)
  const [showWinModal, setShowWinModal] = useState(false)

  // Configure sensors for both mouse and touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // Longer delay to differentiate from tap
        tolerance: 8, // Allow some movement during delay
      },
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDieId(event.active.id as string)
    // Clear selection when starting drag
    selectDie(null)
  }, [selectDie])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDieId(null)

      const { active, over } = event
      if (!over) return

      const dieId = active.id as string
      const overId = over.id as string

      // Check if dropping on another die
      if (overId.startsWith('die-drop-')) {
        const targetDieId = overId.replace('die-drop-', '')
        if (targetDieId === dieId) return // Dropped on itself

        const draggedDie = state.dice.find((d) => d.id === dieId)
        const targetDie = state.dice.find((d) => d.id === targetDieId)
        if (!draggedDie || !targetDie) return

        // Both in tray - swap positions in array
        if (draggedDie.position === null && targetDie.position === null) {
          swapTrayDice(dieId, targetDieId)
        } else {
          // At least one on board - use regular swap
          swapDice(dieId, targetDieId)
        }
        return
      }

      // Check if dropping on a cell
      if (overId.startsWith('cell-')) {
        const [, rowStr, colStr] = overId.split('-')
        const position: Position = {
          row: parseInt(rowStr, 10),
          col: parseInt(colStr, 10),
        }

        // Check if cell is occupied
        const targetDieId = state.grid[position.row][position.col].dieId
        if (targetDieId && targetDieId !== dieId) {
          // Cell is occupied - swap the dice
          swapDice(dieId, targetDieId)
        } else {
          // Cell is empty - place normally
          placeDie(dieId, position)
        }
      }
    },
    [placeDie, swapDice, swapTrayDice, state.grid, state.dice]
  )

  const handleCellClick = useCallback(
    (position: Position) => {
      // If a die is selected, place it
      if (state.selectedDieId) {
        const die = state.dice.find((d) => d.id === state.selectedDieId)
        if (die) {
          // Check if cell is empty
          if (state.grid[position.row][position.col].dieId === null) {
            placeDie(state.selectedDieId, position)
          }
        }
      }
    },
    [state.selectedDieId, state.dice, state.grid, placeDie]
  )

  const handleDieClick = useCallback(
    (dieId: string) => {
      const die = state.dice.find((d) => d.id === dieId)
      if (!die) return

      // If die is on board, remove it
      if (die.position !== null) {
        removeDie(dieId)
      } else {
        // Toggle selection
        selectDie(state.selectedDieId === dieId ? null : dieId)
      }
    },
    [state.dice, state.selectedDieId, removeDie, selectDie]
  )

  const handleNewGame = useCallback(() => {
    setShowWinModal(false)
    rollNewGame()
  }, [rollNewGame])

  // Show win modal when game status changes to won
  useEffect(() => {
    if (state.status === 'won') {
      setShowWinModal(true)
    }
  }, [state.status])

  const activeDie = activeDieId
    ? state.dice.find((d) => d.id === activeDieId)
    : null

  const selectedDie = state.selectedDieId
    ? state.dice.find((d) => d.id === state.selectedDieId)
    : null

  if (isDictLoading) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8">
          <CardContent className="flex flex-col items-center gap-4 p-0">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-slate-900 dark:border-slate-100" />
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Loading dictionary...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-2 sm:p-4 md:p-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
          {/* Header with Dark Mode Toggle */}
          <Card>
            <CardHeader className="text-center pb-2 px-3 sm:px-6 pt-3 sm:pt-6 relative">
              {/* Dark Mode Toggle - absolute positioned */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleDarkMode}
                className="absolute right-2 top-2 sm:right-4 sm:top-4 rounded-full h-8 w-8 sm:h-10 sm:w-10"
              >
                {isDark ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>

              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Qless
              </CardTitle>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Place all dice to form valid, connected words
              </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3 sm:gap-4 px-3 sm:px-6 pb-3 sm:pb-6">
              {state.status !== 'idle' && (
                <div className="flex items-center gap-2 sm:gap-4">
                  <Timer
                    timeRemaining={state.timeRemaining}
                    isRunning={state.status === 'playing'}
                  />
                  <Badge variant="outline" className="text-sm sm:text-lg px-2 sm:px-3 py-1">
                    {state.detectedWords.filter((w) => w.isValid).length} words
                  </Badge>
                </div>
              )}
              <GameControls
                status={state.status}
                onNewGame={handleNewGame}
                onPause={pause}
                onResume={resume}
                onReset={resetBoard}
              />
            </CardContent>
          </Card>

          {state.status !== 'idle' && (
            <>
              {/* Dice Tray */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm sm:text-lg font-semibold text-slate-700 dark:text-slate-300">
                    Your Dice
                  </h2>
                  {/* Mobile hint */}
                  {selectedDie && (
                    <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 animate-pulse">
                      Tap a cell to place "{selectedDie.letter}"
                    </span>
                  )}
                </div>
                <DiceTray
                  dice={state.dice}
                  selectedDieId={state.selectedDieId}
                  draggingDieId={activeDieId}
                  onDieClick={handleDieClick}
                />
                {/* Mobile instruction */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center sm:hidden">
                  Tap a die to select, then tap a cell to place it
                </p>
              </div>

              {/* Game Board */}
              <div>
                <h2 className="text-sm sm:text-lg font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Game Board
                </h2>
                <GameBoard
                  grid={state.grid}
                  dice={state.dice}
                  detectedWords={state.detectedWords}
                  selectedDieId={state.selectedDieId}
                  draggingDieId={activeDieId}
                  onCellClick={handleCellClick}
                  onDieClick={handleDieClick}
                />
                {/* Mobile hint for removing dice */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center sm:hidden">
                  Tap a placed die to remove it
                </p>
              </div>

              {/* Detected Words */}
              {state.detectedWords.length > 0 && (
                <Card>
                  <CardContent className="p-3 sm:pt-4 sm:p-6">
                    <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      Detected Words
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {state.detectedWords.map((word, idx) => (
                        <Badge
                          key={`${word.word}-${idx}`}
                          variant={word.isValid ? 'default' : 'destructive'}
                          className="text-xs sm:text-sm"
                        >
                          {word.word}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Validation Status */}
              {state.dice.some((d) => d.position !== null) && (
                <Card>
                  <CardContent className="p-3 sm:pt-4 sm:p-6">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <Badge
                        variant={
                          validation.allDicePlaced ? 'default' : 'secondary'
                        }
                      >
                        {validation.allDicePlaced
                          ? 'All placed'
                          : `${state.dice.filter((d) => d.position).length}/${state.dice.length}`}
                      </Badge>
                      <Badge
                        variant={
                          validation.allConnected ? 'default' : 'secondary'
                        }
                      >
                        {validation.allConnected
                          ? 'Connected'
                          : 'Not connected'}
                      </Badge>
                      <Badge
                        variant={
                          validation.allWordsValid ? 'default' : 'destructive'
                        }
                      >
                        {validation.allWordsValid
                          ? 'Valid'
                          : `${validation.invalidWords.length} invalid`}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Instructions */}
          {state.status === 'idle' && (
            <Card>
              <CardContent className="p-4 sm:pt-6 sm:p-6">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">How to Play</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                  <li>Tap "New Game" to roll 12 letter dice</li>
                  <li>Tap a die to select it, then tap a cell to place it</li>
                  <li>Or drag dice directly to the board</li>
                  <li>Form valid words (3+ letters) that connect like a crossword</li>
                  <li>All dice must be used and connected</li>
                  <li>Beat the clock to win!</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeDie && (
          <Die id={activeDie.id} letter={activeDie.letter} isDragging={false} />
        )}
      </DragOverlay>

      {/* Win Modal */}
      <WinModal
        isOpen={showWinModal}
        timeRemaining={state.timeRemaining}
        wordCount={state.detectedWords.filter((w) => w.isValid).length}
        timeRanOut={state.timeRemaining <= 0}
        onNewGame={handleNewGame}
        onClose={() => setShowWinModal(false)}
      />
    </DndContext>
  )
}

export default App
