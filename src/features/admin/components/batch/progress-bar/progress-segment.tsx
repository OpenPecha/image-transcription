import { cn } from '@/lib/utils'
import type { ProgressSegmentData } from './progress-bar.types'

interface ProgressSegmentProps {
  segment: ProgressSegmentData
  showLabel: boolean
  isAnimated: boolean
}

export function ProgressSegment({ segment, showLabel, isAnimated }: ProgressSegmentProps) {
  const { percentage, barColor, textColor, label, count, isHatched } = segment

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden transition-all duration-500 ease-out',
        barColor,
        isHatched && 'progress-segment-hatched'
      )}
      style={{
        width: isAnimated ? `${percentage}%` : '0%',
        minWidth: percentage > 0 ? '24px' : '0',
      }}
      title={`${label}: ${count} task${count !== 1 ? 's' : ''}`}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${percentage}%`}
    >
      <span
        className={cn(
          'text-xs font-semibold whitespace-nowrap px-1',
          textColor,
          !showLabel && 'sr-only'
        )}
      >
        {percentage}%
      </span>
    </div>
  )
}

