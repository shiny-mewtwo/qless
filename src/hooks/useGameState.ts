import { useReducer, useCallback, useEffect } from 'react'
import type { GameState, GameAction, Position, Die } from '@/types/game'
import { INITIAL_TIME } from '@/types/game'
import { rollDice } from '@/lib/dice'
import { createEmptyGrid, placeDieOnGrid, removeDieFromGrid, findAllWords } from '@/lib/grid'
import { validateGameState } from '@/lib/validation'

const initialState: GameState = {
  dice: [],
  grid: createEmptyGrid(),
  status: 'idle',
  timeRemaining: INITIAL_TIME,
  selectedDieId: null,
  detectedWords: [],
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ROLL_DICE': {
      return {
        ...state,
        dice: rollDice(),
        grid: createEmptyGrid(),
        status: 'playing',
        timeRemaining: INITIAL_TIME,
        selectedDieId: null,
        detectedWords: [],
      }
    }

    case 'PLACE_DIE': {
      const { dieId, position } = action
      const die = state.dice.find((d) => d.id === dieId)
      if (!die) return state

      // Check if cell is occupied
      if (state.grid[position.row][position.col].dieId !== null) {
        return state
      }

      // Remove die from old position if it was placed
      let newGrid = state.grid
      if (die.position) {
        newGrid = removeDieFromGrid(newGrid, die.position)
      }

      // Place die at new position
      newGrid = placeDieOnGrid(newGrid, dieId, position)

      const newDice = state.dice.map((d) =>
        d.id === dieId ? { ...d, position } : d
      )

      return {
        ...state,
        dice: newDice,
        grid: newGrid,
        selectedDieId: null,
      }
    }

    case 'REMOVE_DIE': {
      const { dieId } = action
      const die = state.dice.find((d) => d.id === dieId)
      if (!die || !die.position) return state

      const newGrid = removeDieFromGrid(state.grid, die.position)
      const newDice = state.dice.map((d) =>
        d.id === dieId ? { ...d, position: null } : d
      )

      return {
        ...state,
        dice: newDice,
        grid: newGrid,
      }
    }

    case 'SWAP_DICE': {
      const { dieId, targetDieId } = action
      const draggedDie = state.dice.find((d) => d.id === dieId)
      const targetDie = state.dice.find((d) => d.id === targetDieId)
      if (!draggedDie || !targetDie) return state

      // If target is in tray (no position), handle board-to-tray swap
      if (!targetDie.position) {
        // Dragged die must be on board for this case
        if (!draggedDie.position) return state

        let newGrid = state.grid
        const draggedPosition = draggedDie.position

        // Remove dragged die from board
        newGrid = removeDieFromGrid(newGrid, draggedPosition)
        // Place target die at dragged die's old position
        newGrid = placeDieOnGrid(newGrid, targetDieId, draggedPosition)

        const newDice = state.dice.map((d) => {
          if (d.id === dieId) {
            return { ...d, position: null } // Dragged die goes to tray
          }
          if (d.id === targetDieId) {
            return { ...d, position: draggedPosition } // Target goes to board
          }
          return d
        })

        return {
          ...state,
          dice: newDice,
          grid: newGrid,
          selectedDieId: null,
        }
      }

      // Target is on board
      let newGrid = state.grid

      // If dragged die was on board, remove it from old position
      if (draggedDie.position) {
        newGrid = removeDieFromGrid(newGrid, draggedDie.position)
      }

      // Remove target die from its position
      newGrid = removeDieFromGrid(newGrid, targetDie.position)

      // Place dragged die at target's position
      newGrid = placeDieOnGrid(newGrid, dieId, targetDie.position)

      // If dragged die came from board, place target die at dragged die's old position
      if (draggedDie.position) {
        newGrid = placeDieOnGrid(newGrid, targetDieId, draggedDie.position)
      }

      const newDice = state.dice.map((d) => {
        if (d.id === dieId) {
          return { ...d, position: targetDie.position }
        }
        if (d.id === targetDieId) {
          // If dragged was from tray, target goes to tray; otherwise swap positions
          return { ...d, position: draggedDie.position }
        }
        return d
      })

      return {
        ...state,
        dice: newDice,
        grid: newGrid,
        selectedDieId: null,
      }
    }

    case 'SWAP_TRAY_DICE': {
      const { dieId, targetDieId } = action
      const dieIndex = state.dice.findIndex((d) => d.id === dieId)
      const targetIndex = state.dice.findIndex((d) => d.id === targetDieId)
      if (dieIndex === -1 || targetIndex === -1) return state

      // Both must be in tray
      if (state.dice[dieIndex].position !== null || state.dice[targetIndex].position !== null) {
        return state
      }

      // Swap positions in the array
      const newDice = [...state.dice]
      const temp = newDice[dieIndex]
      newDice[dieIndex] = newDice[targetIndex]
      newDice[targetIndex] = temp

      return {
        ...state,
        dice: newDice,
        selectedDieId: null,
      }
    }

    case 'SELECT_DIE': {
      return {
        ...state,
        selectedDieId: action.dieId,
      }
    }

    case 'TICK': {
      if (state.status !== 'playing') return state
      // Continue counting into negative (overtime) - no longer pause at 0
      return {
        ...state,
        timeRemaining: state.timeRemaining - 1,
      }
    }

    case 'PAUSE': {
      return {
        ...state,
        status: 'paused',
      }
    }

    case 'RESUME': {
      return {
        ...state,
        status: 'playing',
      }
    }

    case 'RESET': {
      return initialState
    }

    case 'RESET_BOARD': {
      // Clear board but keep the same dice
      return {
        ...state,
        dice: state.dice.map((d) => ({ ...d, position: null })),
        grid: createEmptyGrid(),
        selectedDieId: null,
        detectedWords: [],
        status: 'playing',
      }
    }

    case 'UPDATE_WORDS': {
      return {
        ...state,
        detectedWords: action.words,
      }
    }

    case 'WIN': {
      return {
        ...state,
        status: 'won',
      }
    }

    default:
      return state
  }
}

export function useGameState(validateWord: (word: string) => boolean) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const rollNewGame = useCallback(() => {
    dispatch({ type: 'ROLL_DICE' })
  }, [])

  const placeDie = useCallback((dieId: string, position: Position) => {
    dispatch({ type: 'PLACE_DIE', dieId, position })
  }, [])

  const removeDie = useCallback((dieId: string) => {
    dispatch({ type: 'REMOVE_DIE', dieId })
  }, [])

  const swapDice = useCallback((dieId: string, targetDieId: string) => {
    dispatch({ type: 'SWAP_DICE', dieId, targetDieId })
  }, [])

  const swapTrayDice = useCallback((dieId: string, targetDieId: string) => {
    dispatch({ type: 'SWAP_TRAY_DICE', dieId, targetDieId })
  }, [])

  const selectDie = useCallback((dieId: string | null) => {
    dispatch({ type: 'SELECT_DIE', dieId })
  }, [])

  const tick = useCallback(() => {
    dispatch({ type: 'TICK' })
  }, [])

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' })
  }, [])

  const resume = useCallback(() => {
    dispatch({ type: 'RESUME' })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const resetBoard = useCallback(() => {
    dispatch({ type: 'RESET_BOARD' })
  }, [])

  // Update detected words whenever grid changes
  useEffect(() => {
    const words = findAllWords(state.grid, state.dice, validateWord)
    dispatch({ type: 'UPDATE_WORDS', words })

    // Check for win (allow win even after time runs out when paused)
    const validation = validateGameState(state.dice, state.grid, words)
    if (validation.isWin && (state.status === 'playing' || state.status === 'paused')) {
      dispatch({ type: 'WIN' })
    }
  }, [state.grid, state.dice, validateWord, state.status])

  // Timer
  useEffect(() => {
    if (state.status !== 'playing') return

    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [state.status, tick])

  const getUnplacedDice = useCallback((): Die[] => {
    return state.dice.filter((d) => d.position === null)
  }, [state.dice])

  const getPlacedDice = useCallback((): Die[] => {
    return state.dice.filter((d) => d.position !== null)
  }, [state.dice])

  const validation = validateGameState(state.dice, state.grid, state.detectedWords)

  return {
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
    reset,
    resetBoard,
    getUnplacedDice,
    getPlacedDice,
  }
}
