import { useCallback, useEffect, useRef, useState } from "react"

const VOLUME = 0.5

// Reproduce un audio desde el inicio y lo corta al llegar a `limit` segundos
export function useSnippetPlayer(limit: number) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const frameRef = useRef(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(0)

  const stop = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    setIsPlaying(false)
    setPosition(0)
  }, [])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    audio.volume = VOLUME
    try {
      await audio.play()
    } catch {
      setIsPlaying(false)
      return
    }
    setIsPlaying(true)
    // requestAnimationFrame da precisión suficiente para cortar el fragmento de 0.5s
    const tick = () => {
      if (audio.ended || audio.currentTime >= limit) {
        stop()
        return
      }
      setPosition(audio.currentTime)
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
  }, [limit, stop])

  const toggle = useCallback(() => (isPlaying ? stop() : void play()), [isPlaying, play, stop])

  // Corta la reproducción cuando cambia el fragmento disponible o al desmontar
  useEffect(() => stop, [limit, stop])

  return { audioRef, isPlaying, position, toggle }
}
