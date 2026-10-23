import { type KeyboardEvent, useRef } from "react"
import { cn } from "@/lib/cn"
import { GENRES, type GenreId } from "@/lib/genres"

interface GenrePickerProps {
  value: GenreId
  onChange: (genre: GenreId) => void
}

// Grupo de opciones con navegación por flechas, como un radio group nativo
export function GenrePicker({ value, onChange }: GenrePickerProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (index + step + GENRES.length) % GENRES.length
    onChange(GENRES[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div role="radiogroup" aria-label="Género" className="grid w-full grid-cols-2 gap-2.5">
      {GENRES.map((genre, i) => {
        const selected = genre.id === value
        const featured = genre.id === "todos"
        return (
          <button
            key={genre.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(genre.id)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={cn(
              "group relative flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-left transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              featured && "col-span-2",
              selected
                ? "border-brand/60 bg-linear-to-br from-brand/15 to-brand-2/15 shadow-lg shadow-brand/10"
                : "border-white/8 bg-white/4 hover:border-white/15 hover:bg-white/7",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-xl text-xl transition group-active:scale-90",
                selected ? "bg-white/10" : "bg-white/5",
              )}
            >
              {genre.emoji}
            </span>
            <span className="min-w-0">
              <span className={cn("block text-sm leading-tight font-semibold", selected ? "text-white" : "text-white/85")}>{genre.label}</span>
              {"description" in genre && <span className="mt-0.5 block truncate text-xs text-white/45">{genre.description}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}
