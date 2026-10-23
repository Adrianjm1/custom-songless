import { useGameStore } from "@/store/game-store"
import { useStatsStore } from "@/store/stats-store"
import { Button } from "./button"
import { ChartIcon, FlameIcon, LogoIcon } from "./icons"

export function Header({ onOpenStats }: { onOpenStats: () => void }) {
  const streak = useStatsStore((s) => s.currentStreak)
  const goHome = useGameStore((s) => s.goHome)

  return (
    <header className="flex items-center justify-between py-5">
      <button type="button" onClick={goHome} aria-label="Volver al inicio" className="flex cursor-pointer items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
        <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-brand to-brand-2 text-ink-950">
          <LogoIcon className="size-5" />
        </span>
        <span className="font-display text-xl font-extrabold tracking-tight">
          Beat<span className="text-gradient">Less</span>
        </span>
      </button>
      <div className="flex items-center gap-1">
        {streak > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-sun/10 px-3 py-1.5 text-sm font-semibold text-sun" title="Racha actual">
            <FlameIcon className="size-4" />
            {streak}
          </span>
        )}
        <Button variant="ghost" className="size-10 px-0" onClick={onOpenStats} aria-label="Ver estadísticas">
          <ChartIcon className="size-5" />
        </Button>
      </div>
    </header>
  )
}
