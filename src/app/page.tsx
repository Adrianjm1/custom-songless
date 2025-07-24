// ...existing code...
"use client"

import React, { useEffect, useRef } from "react"
import { SongPlayer } from "./SongPlayer"
import { GuessForm } from "./GuessForm"
import { SongResult } from "./SongResult"
import { normalize } from "./normalize"
import { useSongStore } from "./store"
import { StepIndicator } from "./StepIndicator"
import { CustomAlert } from "./CustomAlert"

interface Song {
  title: string
  artist: string
  preview: string
  cover: string
}

// Componente principal de la página
export default function Page() {
  const [showCongrats, setShowCongrats] = React.useState(false)
  const {
    song,
    setSong,
    setGuessedSongs,
    step,
    setStep,
    loading,
    setLoading,
    started,
    setStarted,
    guess,
    setGuess,
    suggestions,
    setSuggestions,
    guessedSongs,
    isPlaying,
    setIsPlaying,
    reset,
  } = useSongStore()
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Reproduce el preview de la canción solo por la cantidad de segundos del paso actual o pausa si ya está sonando
  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }
    audio.currentTime = 0
    audio.volume = 0.3
    audio.play()
    setIsPlaying(true)
    setTimeout(() => {
      audio.pause()
      setIsPlaying(false)
    }, stepDurations[step] * 1000)
  }
  // Página principal del clon de Bandle/Songless
  // Permite escuchar previews de canciones latinas/urbanas en 5 pasos
  // Solo cargar la canción cuando el usuario haga click en Start
  useEffect(() => {
    if (started) {
      fetchSong()
    }
  }, [started])

  // Consulta la API interna para obtener una canción aleatoria y reinicia todo
  const fetchSong = async () => {
    // Reinicia todo el estado, pero luego vuelve a poner started en true
    reset()
    setStarted(true)
    setLoading(true)
    const res = await fetch("/api/song")
    if (res.ok) {
      const data = await res.json()
      setSong(data)
    }
    setLoading(false)
  }

  // Avanza al siguiente paso (máximo 5)
  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      setGuessedSongs(guessedSongs + 1)
    }
  }

  // Reinicia el audio cada vez que cambia la canción o el paso
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.pause()
      audioRef.current.load()
    }
  }, [song, step])

  // Duraciones personalizadas por paso
  const stepDurations = [0, 0.5, 2, 5, 10, 20] // índice 1 a 5

  // Actualiza el estado isPlaying según eventos del audio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    return () => {
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
    }
  }, [audioRef])

  // Validar intento del usuario
  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault()
    if (!song) return
    if (normalize(guess) === normalize(song.title)) {
      setShowCongrats(true)
    } else {
      setStep(step + 1)
      setGuess("")
      setSuggestions([])
      handleNext()
    }
  }

  // Renderizado principal
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Songless Latino</h1>
      {/* Si no ha iniciado, mostrar botón Start */}
      {!started && (
        <div className="text-center mb-8 flex flex-col items-center gap-5">
          <p>¡Bienvenido a Songless Latino! Adivina la canción.</p>
          <button className="bg-yellow-500 px-8 py-3 rounded text-xl font-bold mb-4 hover:bg-yellow-600 transition" onClick={() => setStarted(true)}>
            Start
          </button>
        </div>
      )}
      {/* Mensaje de carga */}
      {started && loading && <p>Cargando canción...</p>}
      {/* Si hay canción, mostrar reproductor y controles */}
      {started && song && (
        <div className="flex flex-col items-center">
          <StepIndicator />
          <SongPlayer />
          <GuessForm onSubmit={handleGuess} />
          {step < 5 && (
            <div className="flex gap-4 ">
              <button
                className="bg-green-600 px-4 py-1 rounded text-lg font-semibold  hover:bg-green-700 transition"
                onClick={handleNext}
                disabled={step >= 5 || loading}
              >
                Next
              </button>
              <button
                onClick={handleGuess}
                className="bg-purple-600 px-4 py-1 rounded text-white font-semibold  hover:bg-purple-700 transition"
                disabled={loading || !guess || step === 5}
              >
                Adivinar
              </button>
            </div>
          )}

          <button className="bg-gray-700 px-4 py-1 rounded text-sm mt-2 hover:bg-gray-800 transition" onClick={fetchSong} disabled={loading}>
            Nueva canción
          </button>
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold">Pista: {step}/5</p>
            <p className="text-md mt-2">¿Adivinas la canción?</p>
            {step === 5 && <SongResult cover={song.cover} title={song.title} artist={song.artist} />}
          </div>
        </div>
      )}
      {showCongrats && (
        <CustomAlert
          message={guessedSongs < 3 ? "¡Adivinaste la canción! 🎶 " : " ¡Adivinaste la canción! 🎉 Vuelve mañana para mas contenido"}
          onClose={() => setShowCongrats(false)}
        />
      )}
    </main>
  )
}
