import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import type { Position } from '@/types/game'

interface GridCellProps {
  position: Position
  children?: React.ReactNode
  onClick?: () => void
  isHighlighted?: boolean
  isInvalidWord?: boolean
}

export function GridCell({
  position,
  children,
  onClick,
  isHighlighted = false,
  isInvalidWord = false,
}: GridCellProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${position.row}-${position.col}`,
    data: { position },
  })

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        // Responsive size - matches die size
        'w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12',
        'border border-slate-300 dark:border-slate-600',
        'flex items-center justify-center',
        'transition-colors duration-150',
        !children && 'bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600',
        isOver && !children && 'bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-500',
        isHighlighted && 'bg-blue-50 dark:bg-blue-900/50',
        isInvalidWord && 'bg-red-100 dark:bg-red-900/50'
      )}
    >
      {children}
    </div>
  )
}
