import { create } from "zustand"

interface Suggestion {
  title: string
  artist: string
}

interface Song {
  title: string
  artist: string
  preview: string
  cover: string
}

interface SongStore {
  song: Song | null
  setSong: (song: Song | null) => void
  step: number
  setStep: (step: number) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  started: boolean
  setStarted: (started: boolean) => void
  guess: string
  setGuess: (guess: string) => void
  suggestions: Suggestion[]
  setSuggestions: (suggestions: Suggestion[]) => void
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  guessedSongs: number
  setGuessedSongs: (count: number) => void
  reset: () => void
}

export const useSongStore = create<SongStore>((set) => ({
  song: null,
  setSong: (song: Song | null) => set({ song }),
  step: 1,
  setStep: (step: number) => set({ step }),
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  started: false,
  setStarted: (started: boolean) => set({ started }),
  guess: "",
  setGuess: (guess: string) => set({ guess }),
  suggestions: [],
  setSuggestions: (suggestions: Suggestion[]) => set({ suggestions }),
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  guessedSongs: 0,
  setGuessedSongs: (count: number) => set({ guessedSongs: count }),
  reset: () =>
    set({
      song: null,
      step: 1,
      loading: false,
      started: false,
      guess: "",
      suggestions: [],
      isPlaying: false,
    }),
}))
