// Quita tildes, pasa a minúsculas y recorta espacios
export function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
}

// Reduce un título a su forma "esencial" para comparar:
// "Tití Me Preguntó (feat. X) - Remix" -> "titi me pregunto"
export function cleanTitle(title: string): string {
  return normalize(title)
    .replace(/\([^)]*\)|\[[^\]]*\]/g, " ")
    .replace(/\s[-–—]\s.*$/, " ")
    .replace(/\b(feat|ft|featuring)\b\.?\s.*$/, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
}

interface Answer {
  id: number
  title: string
}

export function isCorrectGuess(guess: string, answer: Answer, picked?: Answer | null): boolean {
  if (picked && picked.id === answer.id) return true
  const target = cleanTitle(answer.title)
  // Títulos hechos solo de símbolos se comparan tal cual
  if (!target) return normalize(guess) === normalize(answer.title)
  return cleanTitle(guess) === target
}
