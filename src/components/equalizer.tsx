import { cn } from "@/lib/cn"

const BAR_DELAYS = [0, -0.4, -0.2, -0.6, -0.1]

export function Equalizer({ className, paused = false }: { className?: string; paused?: boolean }) {
  return (
    <span aria-hidden className={cn("flex items-end gap-1", className)}>
      {BAR_DELAYS.map((delay) => (
        <span
          key={delay}
          className={cn("h-full w-1.5 origin-bottom rounded-full bg-linear-to-t from-brand to-brand-2", paused ? "scale-y-30" : "animate-eq")}
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </span>
  )
}
