import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { MAX_ATTEMPTS } from "@/lib/game"

// Canciones recientes que no se repiten en las siguientes rondas
const RECENT_SONGS_LIMIT = 50

export interface Stats {
  played: number
  wins: number
  currentStreak: number
  bestStreak: number
  // distribution[i] = partidas ganadas en el intento i + 1
  distribution: number[]
  recentSongIds: number[]
  lastResult: { won: boolean; attempts: number } | null
}

interface StatsStore extends Stats {
  recordResult: (result: { won: boolean; attempts: number; songId: number }) => void
  resetStats: () => void
}

const initialStats: Stats = {
  played: 0,
  wins: 0,
  currentStreak: 0,
  bestStreak: 0,
  distribution: Array(MAX_ATTEMPTS).fill(0),
  recentSongIds: [],
  lastResult: null,
}

export const useStatsStore = create<StatsStore>()(
  persist(
    (set) => ({
      ...initialStats,
      recordResult: ({ won, attempts, songId }) =>
        set((s) => {
          const distribution = [...s.distribution]
          if (won) distribution[attempts - 1] = (distribution[attempts - 1] ?? 0) + 1
          const currentStreak = won ? s.currentStreak + 1 : 0
          return {
            played: s.played + 1,
            wins: s.wins + (won ? 1 : 0),
            currentStreak,
            bestStreak: Math.max(s.bestStreak, currentStreak),
            distribution,
            recentSongIds: [songId, ...s.recentSongIds.filter((id) => id !== songId)].slice(0, RECENT_SONGS_LIMIT),
            lastResult: { won, attempts },
          }
        }),
      resetStats: () => set(initialStats),
    }),
    {
      name: "beatless-stats",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Se rehidrata en el cliente tras montar para no romper la hidratación de React
      skipHydration: true,
    },
  ),
)
