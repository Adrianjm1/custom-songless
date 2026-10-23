import { useState } from "react"
import { type Attempt, MAX_ATTEMPTS, buildShareText } from "@/lib/game"
import { getGenre } from "@/lib/genres"
import type { Song } from "@/lib/types"
import { useGameStore } from "@/store/game-store"
import { useStatsStore } from "@/store/stats-store"
import { Button } from "./button"
import { Cover } from "./cover"
import { ArrowRightIcon, ExternalIcon, FlameIcon, ShareIcon } from "./icons"

interface ResultCardProps {
  song: Song
  won: boolean
  attempts: Attempt[]
}

export function ResultCard({ song, won, attempts }: ResultCardProps) {
  const startRound = useGameStore((s) => s.startRound)
  const genre = useGameStore((s) => s.genre)
  const streak = useStatsStore((s) => s.currentStreak)
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const text = buildShareText(attempts, won, genre === "todos" ? undefined : getGenre(genre).label)
    try {
      if (navigator.share) {
        await navigator.share({ text: `${text}\n${location.origin}` })
        return
      }
      await navigator.clipboard.writeText(`${text}\n${location.origin}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // El usuario canceló el diálogo de compartir
    }
  }

  return (
    <section className="card animate-pop relative overflow-hidden" aria-live="polite">
      <Cover src={song.coverLarge} alt="" decorative fill sizes="512px" className="scale-125 object-cover opacity-35 blur-3xl" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-ink-950/80" />

      <div className="relative p-5">
        <p className={won ? "text-sm font-semibold text-brand" : "text-sm font-semibold text-brand-2"}>
          {won ? `¡La sacaste en ${attempts.length}/${MAX_ATTEMPTS}!` : "Esta vez no fue…"}
        </p>

        <div className="mt-4 flex items-center gap-4">
          <Cover src={song.cover} alt={`Portada de ${song.album}`} width={112} height={112} className="size-28 shrink-0 rounded-2xl shadow-2xl ring-1 ring-white/10" />
          <div className="min-w-0">
            <h2 className="font-display text-2xl leading-tight font-extrabold text-balance">{song.title}</h2>
            <p className="mt-1 truncate text-white/70">{song.artist}</p>
            <a
              href={song.link}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white/50 transition hover:text-white"
            >
              Escuchar completa en Deezer
              <ExternalIcon className="size-3.5" />
            </a>
          </div>
        </div>

        {won && streak > 1 && (
          <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-sun">
            <FlameIcon className="size-4" />
            Racha de {streak} canciones
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={() => void share()}>
            <ShareIcon className="size-4" />
            {copied ? "¡Copiado!" : "Compartir"}
          </Button>
          <Button onClick={() => void startRound()}>
            Siguiente
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
