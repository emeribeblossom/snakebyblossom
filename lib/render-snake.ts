import { GRID_SIZE, type GameState } from './snake'

const COLORS = {
  board: '#0b120d',
  grid: 'rgba(163, 230, 53, 0.06)',
  head: '#d9f99d',
  bodyStart: [163, 230, 53] as const,
  bodyEnd: [54, 83, 20] as const,
  food: '#fb7185',
  foodGlow: 'rgba(251, 113, 133, 0.35)',
  eye: '#0b120d',
}

function mix(a: readonly number[], b: readonly number[], t: number) {
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`
}

export function drawGame(ctx: CanvasRenderingContext2D, size: number, state: GameState, time: number) {
  const cell = size / GRID_SIZE

  ctx.fillStyle = COLORS.board
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = COLORS.grid
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 1; i < GRID_SIZE; i++) {
    const p = Math.round(i * cell) + 0.5
    ctx.moveTo(p, 0)
    ctx.lineTo(p, size)
    ctx.moveTo(0, p)
    ctx.lineTo(size, p)
  }
  ctx.stroke()

  const pulse = 1 + Math.sin(time / 180) * 0.08
  const fx = (state.food.x + 0.5) * cell
  const fy = (state.food.y + 0.5) * cell
  ctx.fillStyle = COLORS.foodGlow
  ctx.beginPath()
  ctx.arc(fx, fy, cell * 0.6 * pulse, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = COLORS.food
  ctx.beginPath()
  ctx.arc(fx, fy, cell * 0.32 * pulse, 0, Math.PI * 2)
  ctx.fill()

  const len = state.snake.length
  const inset = cell * 0.08
  for (let i = len - 1; i >= 0; i--) {
    const seg = state.snake[i]
    ctx.fillStyle = i === 0 ? COLORS.head : mix(COLORS.bodyStart, COLORS.bodyEnd, len > 1 ? i / (len - 1) : 0)
    ctx.beginPath()
    ctx.roundRect(seg.x * cell + inset, seg.y * cell + inset, cell - inset * 2, cell - inset * 2, cell * 0.28)
    ctx.fill()
  }

  const head = state.snake[0]
  const dir = state.direction
  const cx = (head.x + 0.5) * cell
  const cy = (head.y + 0.5) * cell
  const forward = cell * 0.14
  const side = cell * 0.18
  const eyes =
    dir === 'left' || dir === 'right'
      ? [
          [cx + (dir === 'right' ? forward : -forward), cy - side],
          [cx + (dir === 'right' ? forward : -forward), cy + side],
        ]
      : [
          [cx - side, cy + (dir === 'down' ? forward : -forward)],
          [cx + side, cy + (dir === 'down' ? forward : -forward)],
        ]
  ctx.fillStyle = COLORS.eye
  for (const [ex, ey] of eyes) {
    ctx.beginPath()
    ctx.arc(ex, ey, cell * 0.08, 0, Math.PI * 2)
    ctx.fill()
  }
}
