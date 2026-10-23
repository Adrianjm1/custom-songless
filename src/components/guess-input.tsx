import { type FormEvent, type KeyboardEvent, useId, useRef, useState } from "react"
import { useSuggestions } from "@/hooks/use-suggestions"
import { cn } from "@/lib/cn"
import { MAX_ATTEMPTS, skipBonus } from "@/lib/game"
import type { Suggestion } from "@/lib/types"
import { useGameStore } from "@/store/game-store"
import { Button } from "./button"
import { Cover } from "./cover"
import { SearchIcon, SkipIcon } from "./icons"

export function GuessInput() {
  const attemptCount = useGameStore((s) => s.attempts.length)
  const submitGuess = useGameStore((s) => s.submitGuess)
  const skip = useGameStore((s) => s.skip)

  const [query, setQuery] = useState("")
  const [picked, setPicked] = useState<Suggestion | null>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  const suggestions = useSuggestions(query)
  const visible = open ? suggestions : []
  const isLastAttempt = attemptCount === MAX_ATTEMPTS - 1
  const bonus = skipBonus(attemptCount)

  const clear = () => {
    setQuery("")
    setPicked(null)
    setOpen(false)
    setActiveIndex(-1)
  }

  const choose = (s: Suggestion) => {
    setQuery(s.title)
    setPicked(s)
    setOpen(false)
    setActiveIndex(-1)
    inputRef.current?.focus()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Enter con una sugerencia resaltada la selecciona; el siguiente Enter la envía
    if (activeIndex >= 0 && visible[activeIndex]) {
      choose(visible[activeIndex])
      return
    }
    if (!query.trim()) return
    submitGuess(query, picked)
    clear()
  }

  const handleSkip = () => {
    skip()
    clear()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && visible.length) {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => (i + 1) % visible.length)
    } else if (e.key === "ArrowUp" && visible.length) {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? visible.length - 1 : i - 1))
    } else if (e.key === "Escape") {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="animate-fade-up flex flex-col gap-3">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-white/40" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label="Título de la canción"
          aria-expanded={visible.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          placeholder="Escribe el título de la canción…"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPicked(null)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-2xl border border-white/10 bg-ink-900/80 py-4 pr-4 pl-12 text-base text-white backdrop-blur placeholder:text-white/35 focus:border-brand/60 focus:ring-4 focus:ring-brand/15 focus:outline-none"
        />

        {visible.length > 0 && (
          <ul
            id={listId}
            role="listbox"
            className="animate-pop absolute inset-x-0 bottom-full z-20 mb-2 max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-ink-800/95 p-1.5 shadow-2xl backdrop-blur-xl sm:top-full sm:bottom-auto sm:mt-2 sm:mb-0"
          >
            {visible.map((s, i) => (
              <li
                key={s.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                // mousedown en lugar de click para que el blur del input no cierre la lista antes
                onMouseDown={(e) => {
                  e.preventDefault()
                  choose(s)
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn("flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2", i === activeIndex && "bg-white/8")}
              >
                <Cover src={s.cover} alt="" width={40} height={40} className="size-10 shrink-0 rounded-lg" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">{s.title}</span>
                  <span className="block truncate text-xs text-white/50">{s.artist}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" className="whitespace-nowrap" onClick={handleSkip}>
          <SkipIcon className="size-4" />
          {isLastAttempt ? "Rendirse" : `Saltar +${bonus}s`}
        </Button>
        <Button type="submit" disabled={!query.trim()}>
          Adivinar
        </Button>
      </div>
    </form>
  )
}
