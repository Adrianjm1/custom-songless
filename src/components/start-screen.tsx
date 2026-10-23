import { MAX_ATTEMPTS, SNIPPET_DURATIONS, formatSeconds } from "@/lib/game"
import { getGenre } from "@/lib/genres"
import { useGameStore } from "@/store/game-store"
import { Button } from "./button"
import { GenrePicker } from "./genre-picker"
import { ArrowRightIcon } from "./icons"

const FIRST_SNIPPET = formatSeconds(SNIPPET_DURATIONS[0])
const LAST_SNIPPET = formatSeconds(SNIPPET_DURATIONS[SNIPPET_DURATIONS.length - 1])

export function StartScreen() {
  const genre = useGameStore((s) => s.genre)
  const setGenre = useGameStore((s) => s.setGenre)
  const startRound = useGameStore((s) => s.startRound)

  return (
    <section className="animate-fade-up flex flex-col items-center text-center">
      <h1 className="font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl">
        ¿Cuántos segundos <span className="text-gradient">te bastan?</span>
      </h1>
      <p className="mt-4 max-w-sm text-pretty text-white/60">
        Escucha {FIRST_SNIPPET} de un éxito en español y adivina cuál es. Cada fallo desbloquea más segundos, hasta {LAST_SNIPPET}, y
        tienes {MAX_ATTEMPTS} intentos.
      </p>

      <h2 className="mt-8 mb-3 self-start text-sm font-semibold text-white/70">Elige qué quieres escuchar</h2>
      <GenrePicker value={genre} onChange={setGenre} />

      <Button className="mt-6 w-full py-4 text-base" onClick={() => void startRound()}>
        Jugar · {getGenre(genre).label}
        <ArrowRightIcon className="size-5" />
      </Button>
    </section>
  )
}
