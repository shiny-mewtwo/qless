import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw, Dices } from 'lucide-react'
import type { GameStatus } from '@/types/game'

interface GameControlsProps {
  status: GameStatus
  onNewGame: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
}

export function GameControls({
  status,
  onNewGame,
  onPause,
  onResume,
  onReset,
}: GameControlsProps) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      <Button onClick={onNewGame} variant="default" size="default" className="h-9 px-3 sm:h-11 sm:px-8">
        <Dices className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-sm sm:text-base">New Game</span>
      </Button>

      {status === 'playing' && (
        <Button onClick={onPause} variant="secondary" size="default" className="h-9 px-3 sm:h-11 sm:px-8">
          <Pause className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Pause</span>
        </Button>
      )}

      {status === 'paused' && (
        <Button onClick={onResume} variant="secondary" size="default" className="h-9 px-3 sm:h-11 sm:px-8">
          <Play className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Resume</span>
        </Button>
      )}

      {(status === 'playing' || status === 'paused') && (
        <Button onClick={onReset} variant="outline" size="default" className="h-9 px-3 sm:h-11 sm:px-8">
          <RotateCcw className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Reset</span>
        </Button>
      )}
    </div>
  )
}
