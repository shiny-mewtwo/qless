import { Die } from './Die'
import type { Die as DieType } from '@/types/game'
import { cn } from '@/lib/utils'

interface DiceTrayProps {
  dice: DieType[]
  selectedDieId: string | null
  draggingDieId: string | null
  onDieClick: (dieId: string) => void
}

export function DiceTray({ dice, selectedDieId, draggingDieId, onDieClick }: DiceTrayProps) {
  const unplacedDice = dice.filter((d) => d.position === null)

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-800 rounded-lg shadow-lg',
        'p-2 sm:p-3 md:p-4',
        'flex flex-wrap gap-2 sm:gap-3 justify-center items-center',
        'min-h-[60px] sm:min-h-[80px]'
      )}
    >
      {unplacedDice.length === 0 ? (
        <p className="text-slate-400 dark:text-slate-500 text-xs sm:text-sm">All dice placed!</p>
      ) : (
        unplacedDice.map((die) => (
          <Die
            key={die.id}
            id={die.id}
            letter={die.letter}
            isSelected={die.id === selectedDieId}
            isDragging={die.id === draggingDieId}
            onClick={() => onDieClick(die.id)}
          />
        ))
      )}
    </div>
  )
}
