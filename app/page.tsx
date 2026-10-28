import { SnakeGame } from '@/components/snake/snake-game'

export default function Page() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold uppercase tracking-[0.3em] text-primary">Snake</h1>
        <p className="mt-1 text-sm text-muted-foreground">Eat. Grow. Don&apos;t bite yourself.</p>
      </header>
      <SnakeGame />
    </main>
  )
}
