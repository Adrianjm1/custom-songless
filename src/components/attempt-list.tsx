import { cn } from "@/lib/cn"
import { type Attempt, MAX_ATTEMPTS } from "@/lib/game"
import { CheckIcon, SkipIcon, XIcon } from "./icons"

const STYLES = {
  correct: { row: "border-brand/40 bg-brand/10 text-brand", icon: CheckIcon },
  wrong: { row: "border-brand-2/30 bg-brand-2/8 text-brand-2 animate-shake", icon: XIcon },
  skipped: { row: "border-white/10 bg-white/4 text-white/45", icon: SkipIcon },
} as const

export function AttemptList({ attempts, active }: { attempts: Attempt[]; active: boolean }) {
  return (
    <ol className="flex flex-col gap-2" aria-label="Intentos">
      {Array.from({ length: MAX_ATTEMPTS }, (_, i) => {
        const attempt = attempts[i]
        if (!attempt) {
          const isCurrent = active && i === attempts.length
          return (
            <li
              key={i}
              className={cn(
                "flex h-12 items-center gap-3 rounded-xl border border-dashed px-4 text-sm text-white/25",
                isCurrent ? "border-brand/50 text-white/50" : "border-white/8",
              )}
            >
              <span className="font-mono tabular-nums">{i + 1}</span>
              {isCurrent && <span>Tu turno</span>}
            </li>
          )
        }
        const { row, icon: Icon } = STYLES[attempt.result]
        return (
          <li key={i} className={cn("flex h-12 items-center gap-3 rounded-xl border px-4 text-sm", row)}>
            <Icon className="size-4 shrink-0" />
            <span className="truncate text-white/80">{attempt.result === "skipped" ? "Saltado" : attempt.text}</span>
          </li>
        )
      })}
    </ol>
  )
}
