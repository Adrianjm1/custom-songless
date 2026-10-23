import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { type Attempt, type GameStatus, MAX_ATTEMPTS } from "@/lib/game"
import { DEFAULT_GENRE, type GenreId, isGenreId } from "@/lib/genres"
import { isCorrectGuess } from "@/lib/matching"
import type { Song, Suggestion } from "@/lib/types"
import { useStatsStore } from "./stats-store"

interface GameStore {
  status: GameStatus
  genre: GenreId
  song: Song | null
  attempts: Attempt[]
  error: string | null
  setGenre: (genre: GenreId) => void
  startRound: () => Promise<void>
  submitGuess: (text: string, picked?: Suggestion | null) => void
  skip: () => void
  goHome: () => void
}

// Evita que una respuesta lenta de una ronda anterior pise la actual
let latestRequest = 0

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => {
      const addAttempt = (attempt: Attempt) => {
        const { status, song, attempts } = get()
        if (status !== "playing" || !song) return

        const next = [...attempts, attempt]
        const won = attempt.result === "correct"
        if (!won && next.length < MAX_ATTEMPTS) {
          set({ attempts: next })
          return
        }
        set({ attempts: next, status: won ? "won" : "lost" })
        useStatsStore.getState().recordResult({ won, attempts: next.length, songId: song.id })
      }

      return {
        status: "idle",
        genre: DEFAULT_GENRE,
        song: null,
        attempts: [],
        error: null,

        setGenre: (genre) => set({ genre }),

        startRound: async () => {
          const requestId = ++latestRequest
          set({ status: "loading", song: null, attempts: [], error: null })
          try {
            const params = new URLSearchParams({ genre: get().genre })
            const exclude = useStatsStore.getState().recentSongIds.join(",")
            if (exclude) params.set("exclude", exclude)
            const res = await fetch(`/api/song?${params}`, { cache: "no-store" })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const song = (await res.json()) as Song
            if (requestId === latestRequest) set({ song, status: "playing" })
          } catch {
            if (requestId === latestRequest) {
              set({ status: "error", error: "No pudimos cargar una canción. Revisa tu conexión e inténtalo de nuevo." })
            }
          }
        },

        submitGuess: (text, picked) => {
          const { song } = get()
          const guess = text.trim()
          if (!song || !guess) return
          addAttempt({
            result: isCorrectGuess(guess, song, picked) ? "correct" : "wrong",
            text: picked ? `${picked.title} — ${picked.artist}` : guess,
          })
        },

        skip: () => addAttempt({ result: "skipped" }),

        goHome: () => {
          latestRequest++
          set({ status: "idle", song: null, attempts: [], error: null })
        },
      }
    },
    {
      name: "beatless-game",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Solo se recuerda el género elegido, no la partida en curso
      partialize: (s) => ({ genre: s.genre }),
      merge: (persisted, current) => {
        const genre = (persisted as { genre?: unknown } | undefined)?.genre
        return isGenreId(genre) ? { ...current, genre } : current
      },
      skipHydration: true,
    },
  ),
)
