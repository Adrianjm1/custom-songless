import { FULL_PREVIEW_SECONDS, SNIPPET_DURATIONS, unlockedSeconds } from "@/lib/game"
import { getGenre } from "@/lib/genres"
import { useGameStore } from "@/store/game-store"
import { AttemptList } from "./attempt-list"
import { GuessInput } from "./guess-input"
import { ResultCard } from "./result-card"
import { SnippetPlayer } from "./snippet-player"

export function Round() {
  const song = useGameStore((s) => s.song)
  const status = useGameStore((s) => s.status)
  const attempts = useGameStore((s) => s.attempts)
  const genre = getGenre(useGameStore((s) => s.genre))
  const goHome = useGameStore((s) => s.goHome)
  if (!song) return null

  const finished = status !== "playing"
  const limit = unlockedSeconds(attempts.length, finished)
  const scale = finished ? FULL_PREVIEW_SECONDS : SNIPPET_DURATIONS[SNIPPET_DURATIONS.length - 1]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 rounded-full bg-white/6 px-3 py-1.5 font-medium text-white/80 ring-1 ring-white/10">
          <span aria-hidden>{genre.emoji}</span>
          {genre.label}
        </span>
        <button type="button" onClick={goHome} className="cursor-pointer rounded-full px-3 py-1.5 text-white/50 transition hover:bg-white/6 hover:text-white">
          Cambiar género
        </button>
      </div>
      {finished &&<ResultCard song={song} won={status === "won"} attempts={attempts} />}
      {/* key: reinicia el reproductor con cada canción */}
      <SnippetPlayer key={song.id} src={song.preview} limit={limit} scale={scale} markers={finished ? [] : SNIPPET_DURATIONS} />
      {!finished && <GuessInput />}
      <AttemptList attempts={attempts} active={!finished} />
    </div>
  )
}
