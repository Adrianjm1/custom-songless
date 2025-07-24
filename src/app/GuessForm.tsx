import React from "react"
import { useSongStore } from "./store"

export const GuessForm: React.FC<{ onSubmit: (e: React.FormEvent) => void }> = ({ onSubmit }) => {
  const guess = useSongStore((s) => s.guess)
  const setGuess = useSongStore((s) => s.setGuess)
  const suggestions = useSongStore((s) => s.suggestions)
  const setSuggestions = useSongStore((s) => s.setSuggestions)
  const loading = useSongStore((s) => s.loading)
  const step = useSongStore((s) => s.step)
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null)

  // Fetch suggestions desde la API interna
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }
    try {
      const res = await fetch(`/api/suggest?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setSuggestions(Array.isArray(data) && data[0] && typeof data[0] === "object" ? data : [])
    } catch {
      setSuggestions([])
    }
  }

  // Debounce para sugerencias
  const handleGuessInput = (value: string) => {
    setGuess(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value)
    }, 400)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center w-full max-w-xs mb-2 relative">
      <input
        type="text"
        className="w-full px-3 py-2 rounded text-white bg-gray-800 mb-1 placeholder-gray-400 focus:outline-none"
        placeholder="¿Cuál es la canción?"
        value={guess}
        onChange={(e) => handleGuessInput(e.target.value)}
        autoComplete="off"
        disabled={loading || step === 5}
      />
      {suggestions.length > 0 && guess && (
        <ul className="absolute top-12 left-0 w-full bg-gray-900 border border-gray-700 rounded shadow-lg z-10 max-h-40 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="px-3 py-2 cursor-pointer hover:bg-gray-700 text-white"
              onClick={() => {
                setGuess(s.title)
                setSuggestions([])
              }}
            >
              <span className="font-semibold">{s.title}</span>
              <span className="text-gray-400 ml-2 text-sm">{s.artist}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        className="bg-purple-600 px-4 py-1 rounded text-white font-semibold mt-1 hover:bg-purple-700 transition"
        disabled={loading || !guess || step === 5}
      >
        Adivinar
      </button>
    </form>
  )
}
