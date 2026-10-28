import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Direction } from '@/lib/snake'

const BUTTONS: { direction: Direction; label: string; Icon: typeof ArrowUp; area: string }[] = [
  { direction: 'up', label: 'Move up', Icon: ArrowUp, area: 'col-start-2 row-start-1' },
  { direction: 'left', label: 'Move left', Icon: ArrowLeft, area: 'col-start-1 row-start-2' },
  { direction: 'down', label: 'Move down', Icon: ArrowDown, area: 'col-start-2 row-start-2' },
  { direction: 'right', label: 'Move right', Icon: ArrowRight, area: 'col-start-3 row-start-2' },
]

export function DirectionPad({ onDirection }: { onDirection: (direction: Direction) => void }) {
  return (
    <div className="mx-auto grid grid-cols-3 grid-rows-2 gap-2 sm:hidden" role="group" aria-label="Direction controls">
      {BUTTONS.map(({ direction, label, Icon, area }) => (
        <Button
          key={direction}
          variant="secondary"
          className={`size-14 ${area}`}
          aria-label={label}
          onPointerDown={(e) => {
            e.preventDefault()
            onDirection(direction)
          }}
        >
          <Icon className="size-6" />
        </Button>
      ))}
    </div>
  )
}
