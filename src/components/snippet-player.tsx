import { useSnippetPlayer } from "@/hooks/use-snippet-player"
import { cn } from "@/lib/cn"
import { formatSeconds } from "@/lib/game"
import { Equalizer } from "./equalizer"
import { PauseIcon, PlayIcon } from "./icons"

interface SnippetPlayerProps {
  src: string
  // Segundos que se pueden escuchar ahora
  limit: number
  // Segundos que representa la barra completa
  scale: number
  markers: readonly number[]
}

const pct = (seconds: number, scale: number) => `${Math.min(100, (seconds / scale) * 100)}%`

export function SnippetPlayer({ src, limit, scale, markers }: SnippetPlayerProps) {
  const { audioRef, isPlaying, position, toggle } = useSnippetPlayer(limit)

  return (
    <section className="card animate-fade-up p-5">
      <audio ref={audioRef} src={src} preload="auto" />

      <div className="relative h-3 overflow-hidden rounded-full bg-white/6">
        <div className="absolute inset-y-0 left-0 rounded-full bg-white/12 transition-[width] duration-500" style={{ width: pct(limit, scale) }} />
        <div className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-brand to-brand-2" style={{ width: pct(position, scale) }} />
        {markers.map((s) => (
          <span key={s} className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-ink-950/70" style={{ left: pct(s, scale) }} />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center">
        <span className="font-mono text-sm text-white/50 tabular-nums">{formatSeconds(position)}</span>
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? "Detener" : `Reproducir ${formatSeconds(limit)}`}
          className={cn(
            "relative grid size-16 cursor-pointer place-items-center rounded-full bg-linear-to-br from-brand to-brand-2 text-ink-950 shadow-lg shadow-brand/25 transition hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand",
          )}
        >
          {isPlaying && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-brand/30" />}
          {isPlaying ? <PauseIcon className="relative size-6" /> : <PlayIcon className="relative ml-0.5 size-6" />}
        </button>
        <span className="flex items-center justify-end gap-2 font-mono text-sm text-white/50 tabular-nums">
          <Equalizer className="h-4" paused={!isPlaying} />
          {formatSeconds(limit)}
        </span>
      </div>
    </section>
  )
}
