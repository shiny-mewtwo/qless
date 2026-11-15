import { useCallback } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'

interface DieProps {
  id: string
  letter: string
  isSelected?: boolean
  isInvalid?: boolean
  onClick?: () => void
  isDragging?: boolean
}

export function Die({
  id,
  letter,
  isSelected = false,
  isInvalid = false,
  onClick,
  isDragging = false,
}: DieProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
  } = useDraggable({
    id,
  })

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `die-drop-${id}`,
  })

  // Merge refs for both draggable and droppable
  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      setDraggableRef(node)
      setDroppableRef(node)
    },
    [setDraggableRef, setDroppableRef]
  )

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        // Responsive size - smaller on mobile
        'w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12',
        'flex items-center justify-center',
        'rounded-lg border-2',
        // Responsive text size
        'text-lg sm:text-xl md:text-2xl font-bold',
        'cursor-grab active:cursor-grabbing',
        'shadow-md hover:shadow-lg transition-all duration-150',
        'select-none touch-none',
        // Normal state
        !isInvalid && 'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-400 text-amber-900',
        // Invalid word state - red tinted
        isInvalid && 'bg-gradient-to-br from-red-100 to-red-200 border-red-400 text-red-900',
        // Selected state
        isSelected && 'ring-4 ring-blue-500 ring-offset-2',
        // Dragging state - hide the original
        isDragging && 'opacity-0',
        // Drop target highlight
        isOver && !isDragging && 'ring-4 ring-green-500 ring-offset-2'
      )}
    >
      {letter}
    </div>
  )
}
