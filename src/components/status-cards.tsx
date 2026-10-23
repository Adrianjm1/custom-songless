import { useGameStore } from "@/store/game-store"
import { Button } from "./button"
import { Equalizer } from "./equalizer"

export function LoadingCard() {
  return (
    <div className="card animate-fade-up flex flex-col items-center gap-4 px-6 py-12" role="status">
      <Equalizer className="h-10" />
      <p className="text-sm text-white/60">Buscando un temazo…</p>
    </div>
  )
}

export function ErrorCard() {
  const error = useGameStore((s) => s.error)
  const startRound = useGameStore((s) => s.startRound)

  return (
    <div className="card animate-fade-up flex flex-col items-center gap-5 px-6 py-10 text-center" role="alert">
      <p className="text-white/80">{error}</p>
      <Button onClick={() => void startRound()}>Reintentar</Button>
    </div>
  )
}
