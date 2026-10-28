import { Button } from '@/components/ui/button'
import type { GameStatus } from '@/lib/snake'

type GameOverlayProps = {
  status: GameStatus
  score: number
  best: number
  onStart: () => void
  onResume: () => void
}

export function GameOverlay({ status, score, best, onStart, onResume }: GameOverlayProps) {
  if (status === 'running') return null

  const content = {
    idle: {
      title: 'Ready?',
      body: 'Eat the food to grow. Avoid the walls and your own tail.',
      action: 'Start game',
      onClick: onStart,
    },
    paused: {
      title: 'Paused',
      body: 'Take a breath. The snake will wait.',
      action: 'Resume',
      onClick: onResume,
    },
    over: {
      title: 'Game over',
      body: score > 0 && score >= best ? `New best: ${score}!` : `You scored ${score}.`,
      action: 'Play again',
      onClick: onStart,
    },
  }[status]

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/75 p-6 text-center backdrop-blur-sm">
      <h2 className="text-2xl font-bold uppercase tracking-widest text-primary">{content.title}</h2>
      <p className="max-w-xs text-sm text-muted-foreground">{content.body}</p>
      <Button size="lg" className="mt-2" onClick={content.onClick} autoFocus>
        {content.action}
      </Button>
    </div>
  )
}
