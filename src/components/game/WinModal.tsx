import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatTotalTime } from '@/lib/validation'
import { INITIAL_TIME } from '@/types/game'

interface WinModalProps {
  isOpen: boolean
  timeRemaining: number
  wordCount: number
  timeRanOut: boolean
  onNewGame: () => void
  onClose: () => void
}

export function WinModal({
  isOpen,
  timeRemaining,
  wordCount,
  timeRanOut,
  onNewGame,
  onClose,
}: WinModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-2rem)] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-center">
            {timeRanOut ? 'Puzzle Complete!' : 'Congratulations!'}
          </DialogTitle>
          <DialogDescription className="text-center text-base sm:text-lg">
            {timeRanOut
              ? 'You solved it, but time had run out!'
              : 'You solved the puzzle!'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 sm:gap-4 py-3 sm:py-4">
          <div className="text-5xl sm:text-6xl">
            {timeRanOut ? '⏰' : '🎉'}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center w-full">
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Total Time</p>
              <p className="text-xl sm:text-2xl font-bold font-mono">
                {formatTotalTime(timeRemaining, INITIAL_TIME)}
              </p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Words</p>
              <p className="text-xl sm:text-2xl font-bold">{wordCount}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button onClick={onNewGame} size="lg" className="w-full sm:w-auto">
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
