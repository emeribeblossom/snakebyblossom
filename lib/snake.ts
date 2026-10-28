export const GRID_SIZE = 20
export const BASE_TICK_MS = 140
export const MIN_TICK_MS = 65
export const SPEED_STEP_MS = 4

export type Point = { x: number; y: number }
export type Direction = 'up' | 'down' | 'left' | 'right'
export type GameStatus = 'idle' | 'running' | 'paused' | 'over'

export const DIRECTION_VECTORS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const OPPOSITES: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

export type GameState = {
  snake: Point[]
  direction: Direction
  queuedDirections: Direction[]
  food: Point
  score: number
}

export function isOpposite(a: Direction, b: Direction) {
  return OPPOSITES[a] === b
}

export function randomFood(snake: Point[]): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`))
  const free: Point[] = []
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y })
    }
  }
  return free[Math.floor(Math.random() * free.length)] ?? { x: 0, y: 0 }
}

export function createInitialState(): GameState {
  const mid = Math.floor(GRID_SIZE / 2)
  const snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ]
  return {
    snake,
    direction: 'right',
    queuedDirections: [],
    food: randomFood(snake),
    score: 0,
  }
}

export function queueDirection(state: GameState, next: Direction) {
  const last = state.queuedDirections.at(-1) ?? state.direction
  if (next === last || isOpposite(next, last)) return
  if (state.queuedDirections.length < 3) state.queuedDirections.push(next)
}

export function tickDuration(score: number) {
  return Math.max(MIN_TICK_MS, BASE_TICK_MS - score * SPEED_STEP_MS)
}

export type StepResult = { ate: boolean; dead: boolean }

export function step(state: GameState): StepResult {
  const nextDirection = state.queuedDirections.shift()
  if (nextDirection) state.direction = nextDirection

  const vector = DIRECTION_VECTORS[state.direction]
  const head = state.snake[0]
  const newHead = { x: head.x + vector.x, y: head.y + vector.y }

  const hitWall =
    newHead.x < 0 || newHead.y < 0 || newHead.x >= GRID_SIZE || newHead.y >= GRID_SIZE

  const ate = newHead.x === state.food.x && newHead.y === state.food.y
  const body = ate ? state.snake : state.snake.slice(0, -1)
  const hitSelf = body.some((p) => p.x === newHead.x && p.y === newHead.y)

  if (hitWall || hitSelf) return { ate: false, dead: true }

  state.snake = [newHead, ...body]
  if (ate) {
    state.score++
    state.food = randomFood(state.snake)
  }

  return { ate, dead: false }
}
