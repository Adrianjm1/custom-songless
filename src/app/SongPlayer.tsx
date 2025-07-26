import React, { useRef, useState, useEffect } from "react"
import { useSongStore } from "./store"

export const SongPlayer: React.FC = () => {
  const song = useSongStore((s) => s.song)
  const step = useSongStore((s) => s.step)
  const loading = useSongStore((s) => s.loading)
  const isPlaying = useSongStore((s) => s.isPlaying)
  const setIsPlaying = useSongStore((s) => s.setIsPlaying)
  const stepDurations = [0, 0.5, 2, 5, 10, 20]
  const audioRef = useRef<HTMLAudioElement>(null)

  // Estado para el contador regresivo
  const [remaining, setRemaining] = useState(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  // Limpia audio y timers
  const cleanAudio = () => {
    if (intervalId) clearInterval(intervalId)
    if (timeoutId) clearTimeout(timeoutId)
    setIntervalId(null)
    setTimeoutId(null)
    setRemaining(0)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return
    // Si está sonando, pausar y limpiar
    if (isPlaying) {
      cleanAudio()
      return
    }
    // Siempre reiniciar desde el inicio
    audio.currentTime = 0
    audio.volume = 0.3
    audio.play().catch(() => setIsPlaying(false))
    setIsPlaying(true)
    setRemaining(stepDurations[step])
    // Iniciar contador regresivo
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 0.01) {
          clearInterval(id)
          return 0
        }
        return +(prev - 0.01).toFixed(2)
      })
    }, 10)
    setIntervalId(id)
    const tId = setTimeout(() => {
      cleanAudio()
    }, stepDurations[step] * 1000)
    setTimeoutId(tId)
  }

  // Limpiar interval y timeout al desmontar o cuando cambia la canción
  useEffect(() => {
    return () => {
      cleanAudio()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlay = () => setIsPlaying(true)
    const onPause = () => {
      setIsPlaying(false)
      if (intervalId) clearInterval(intervalId)
      setRemaining(0)
    }
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    return () => {
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
    }
  }, [setIsPlaying, intervalId])

  return (
    <>
      <audio ref={audioRef} src={song?.preview || ""} preload="auto" />
      <div className="flex items-center gap-4 mb-2">
        <button
          className={`px-6 text-white cursor-pointer py-2 rounded text-lg font-semibold transition ${
            isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
          } flex items-center justify-center`}
          onClick={handlePlayPause}
          disabled={loading}
          aria-label={isPlaying ? "Pausar" : "Escuchar"}
        >
          {isPlaying ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                <rect x="14" y="4" width="4" height="16" fill="currentColor" />
              </svg>
              Pausar
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <polygon points="5,3 19,12 5,21" fill="currentColor" />
              </svg>
              Escuchar
            </>
          )}
        </button>
        {/* Contador regresivo SIEMPRE visible */}
        <span className="font-mono text-xl bg-gray-800 px-4 py-1 rounded shadow text-yellow-400 min-w-[80px] text-center">
          {isPlaying ? remaining.toFixed(2) : stepDurations[step].toFixed(2)}s
        </span>
      </div>
    </>
  )
}
