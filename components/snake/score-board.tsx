import { Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { GameStatus } from '@/lib/snake'

type ScoreBoardProps = {
  score: number
  best: number
  status: GameStatus
  onTogglePause: () => void
}

export function ScoreBoard({ score, best, status, onTogglePause }: ScoreBoardProps) {
  const canToggle = status === 'running' || status === 'paused'

  return (
    <div className="flex items-end justify-between gap-4">
      <dl className="flex gap-6">
        <div>
          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Score</dt>
          <dd className="text-3xl font-bold tabular-nums text-primary" aria-live="polite">
            {score}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-muted-foreground">Best</dt>
          <dd className="text-3xl font-bold tabular-nums">{best}</dd>
        </div>
      </dl>
      <Button variant="outline" size="icon" onClick={onTogglePause} disabled={!canToggle} aria-label={status === 'paused' ? 'Resume game' : 'Pause game'}>
        {status === 'paused' ? <Play /> : <Pause />}
      </Button>
    </div>
  )
}
