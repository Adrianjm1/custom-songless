// Segundos de canción desbloqueados en cada intento
export const SNIPPET_DURATIONS = [0.5, 2, 5, 10, 20] as const
export const MAX_ATTEMPTS = SNIPPET_DURATIONS.length
// Duración de los previews de Deezer, se puede escuchar completa al terminar
export const FULL_PREVIEW_SECONDS = 30

export type AttemptResult = "correct" | "wrong" | "skipped"

export interface Attempt {
  result: AttemptResult
  text?: string
}

export type GameStatus = "idle" | "loading" | "playing" | "won" | "lost" | "error"

export function unlockedSeconds(attemptCount: number, finished: boolean): number {
  if (finished) return FULL_PREVIEW_SECONDS
  return SNIPPET_DURATIONS[Math.min(attemptCount, MAX_ATTEMPTS - 1)]
}

// Segundos extra que da saltar el intento actual (0 si es el último)
export function skipBonus(attemptCount: number): number {
  if (attemptCount >= MAX_ATTEMPTS - 1) return 0
  return SNIPPET_DURATIONS[attemptCount + 1] - SNIPPET_DURATIONS[attemptCount]
}

const RESULT_EMOJI: Record<AttemptResult, string> = { correct: "🟩", wrong: "🟥", skipped: "⬛" }

export function buildShareText(attempts: Attempt[], won: boolean, genreLabel?: string): string {
  const grid = Array.from({ length: MAX_ATTEMPTS }, (_, i) => (attempts[i] ? RESULT_EMOJI[attempts[i].result] : "⬜")).join("")
  const score = won ? `${attempts.length}/${MAX_ATTEMPTS}` : `X/${MAX_ATTEMPTS}`
  const title = genreLabel ? `BeatLess 🎵 ${genreLabel} ${score}` : `BeatLess 🎵 ${score}`
  return `${title}\n${grid}`
}

export function formatSeconds(seconds: number): string {
  return `${seconds.toFixed(seconds < 10 ? 1 : 0)}s`
}
