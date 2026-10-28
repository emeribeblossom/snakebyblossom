'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createInitialState,
  queueDirection,
  step,
  tickDuration,
  type Direction,
  type GameState,
  type GameStatus,
} from '@/lib/snake'
import { drawGame } from '@/lib/render-snake'
import { ScoreBoard } from './score-board'
import { GameOverlay } from './game-overlay'
import { DirectionPad } from './direction-pad'

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
}

const CANVAS_SIZE = 600

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<GameState>(createInitialState())
  const statusRef = useRef<GameStatus>('idle')
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const [status, setStatus] = useState<GameStatus>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)

  const updateStatus = useCallback((next: GameStatus) => {
    statusRef.current = next
    setStatus(next)
  }, [])

  const start = useCallback(() => {
    stateRef.current = createInitialState()
    setScore(0)
    updateStatus('running')
  }, [updateStatus])

  const togglePause = useCallback(() => {
    const current = statusRef.current
    if (current === 'running') updateStatus('paused')
    else if (current === 'paused') updateStatus('running')
  }, [updateStatus])

  const steer = useCallback(
    (direction: Direction) => {
      const current = statusRef.current
      if (current === 'idle' || current === 'over') start()
      if (statusRef.current === 'paused') updateStatus('running')
      queueDirection(stateRef.current, direction)
    },
    [start, updateStatus],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = CANVAS_SIZE * dpr
    canvas.height = CANVAS_SIZE * dpr
    ctx.scale(dpr, dpr)

    let frame = 0
    let last = performance.now()
    let accumulator = 0

    const loop = (now: number) => {
      const delta = now - last
      last = now

      if (statusRef.current === 'running') {
        accumulator += delta
        const duration = tickDuration(stateRef.current.score)
        while (accumulator >= duration && statusRef.current === 'running') {
          accumulator -= duration
          const result = step(stateRef.current)
          if (result.dead) {
            updateStatus('over')
            accumulator = 0
          } else if (result.ate) {
            const nextScore = stateRef.current.score
            setScore(nextScore)
            setBest((b) => Math.max(b, nextScore))
          }
        }
      } else {
        accumulator = 0
      }

      drawGame(ctx, CANVAS_SIZE, stateRef.current, now)
      frame = requestAnimationFrame(loop)
    }

    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [updateStatus])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      const direction = KEY_MAP[key]
      if (direction) {
        event.preventDefault()
        steer(direction)
        return
      }
      if (key === ' ' || key === 'Enter') {
        event.preventDefault()
        const current = statusRef.current
        if (current === 'idle' || current === 'over') start()
        else togglePause()
      } else if (key === 'p' || key === 'Escape') {
        togglePause()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [start, steer, togglePause])

  const onTouchStart = (event: React.TouchEvent) => {
    const t = event.touches[0]
    touchStartRef.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (event: React.TouchEvent) => {
    const origin = touchStartRef.current
    touchStartRef.current = null
    if (!origin) return
    const t = event.changedTouches[0]
    const dx = t.clientX - origin.x
    const dy = t.clientY - origin.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return
    if (Math.abs(dx) > Math.abs(dy)) steer(dx > 0 ? 'right' : 'left')
    else steer(dy > 0 ? 'down' : 'up')
  }

  return (
    <div className="flex w-full max-w-[min(92vw,600px)] flex-col gap-4">
      <ScoreBoard score={score} best={best} status={status} onTogglePause={togglePause} />

      <div
        className="relative aspect-square w-full touch-none overflow-hidden rounded-xl border border-border shadow-[0_0_60px_-20px] shadow-primary/40"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <canvas
          ref={canvasRef}
          className="block size-full"
          role="img"
          aria-label={`Snake game board. Score ${score}.`}
        />
        <GameOverlay status={status} score={score} best={best} onStart={start} onResume={togglePause} />
      </div>

      <DirectionPad onDirection={steer} />

      <p className="hidden text-center text-xs text-muted-foreground sm:block">
        Arrow keys or WASD to steer · Space to pause · Enter to restart
      </p>
      <p className="text-center text-xs text-muted-foreground sm:hidden">Swipe the board or use the pad to steer</p>
    </div>
  )
}
