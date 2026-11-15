import { Badge } from '@/components/ui/badge'
import { formatTime } from '@/lib/validation'
import { cn } from '@/lib/utils'

interface TimerProps {
  timeRemaining: number
  isRunning: boolean
}

export function Timer({ timeRemaining, isRunning }: TimerProps) {
  const isOvertime = timeRemaining < 0
  const isLow = timeRemaining <= 60 && timeRemaining > 0
  const isCritical = timeRemaining <= 30 && timeRemaining > 0

  return (
    <Badge
      variant={isOvertime ? 'secondary' : isCritical ? 'destructive' : isLow ? 'secondary' : 'default'}
      className={cn(
        'text-lg sm:text-2xl px-2 sm:px-4 py-1 sm:py-2 font-mono',
        isCritical && isRunning && 'animate-pulse',
        isOvertime && 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      )}
    >
      {formatTime(timeRemaining)}
    </Badge>
  )
}
