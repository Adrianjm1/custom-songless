import { useEffect } from "react"
import { cn } from "@/lib/cn"
import { useStatsStore } from "@/store/stats-store"
import { Button } from "./button"
import { XIcon } from "./icons"

export function StatsDialog({ onClose }: { onClose: () => void }) {
  const { played, wins, currentStreak, bestStreak, distribution, lastResult } = useStatsStore()
  const maxCount = Math.max(1, ...distribution)
  const winRate = played ? Math.round((wins / played) * 100) : 0

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const numbers = [
    { label: "Jugadas", value: played },
    { label: "% Aciertos", value: winRate },
    { label: "Racha", value: currentStreak },
    { label: "Mejor racha", value: bestStreak },
  ]

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink-950/70 backdrop-blur-sm sm:place-items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stats-title"
        onClick={(e) => e.stopPropagation()}
        className="card animate-fade-up w-full max-w-md rounded-b-none bg-ink-900 p-6 sm:rounded-b-3xl"
      >
        <div className="flex items-center justify-between">
          <h2 id="stats-title" className="font-display text-xl font-extrabold">
            Estadísticas
          </h2>
          <Button variant="ghost" className="size-9 px-0" onClick={onClose} aria-label="Cerrar" autoFocus>
            <XIcon className="size-5" />
          </Button>
        </div>

        <dl className="mt-5 grid grid-cols-4 gap-2 text-center">
          {numbers.map(({ label, value }) => (
            <div key={label} className="rounded-2xl bg-white/4 px-1 py-3">
              <dd className="font-display text-2xl font-extrabold tabular-nums">{value}</dd>
              <dt className="mt-0.5 text-[11px] leading-tight text-white/50">{label}</dt>
            </div>
          ))}
        </dl>

        <h3 className="mt-6 mb-3 text-sm font-semibold text-white/70">Aciertos por intento</h3>
        <ol className="flex flex-col gap-1.5">
          {distribution.map((count, i) => {
            const highlight = lastResult?.won && lastResult.attempts === i + 1
            return (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="w-3 font-mono text-white/50">{i + 1}</span>
                <span
                  className={cn(
                    "flex h-6 min-w-7 items-center justify-end rounded-md px-2 font-semibold tabular-nums transition-[width] duration-700",
                    highlight ? "bg-linear-to-r from-brand to-brand-2 text-ink-950" : "bg-white/10 text-white/80",
                  )}
                  style={{ width: `${(count / maxCount) * 100}%` }}
                >
                  {count}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
