// Géneros que se muestran en la interfaz. Las fuentes de cada uno están en catalog-sources.ts
export const GENRES = [
  { id: "todos", label: "Todo aleatorio", emoji: "🎲", description: "Un poco de todo, de cada época" },
  { id: "reggaeton", label: "Reggaetón", emoji: "🔥" },
  { id: "pop", label: "Pop latino", emoji: "💃" },
  { id: "rock", label: "Rock en español", emoji: "🎸" },
  { id: "romanticas", label: "Baladas y boleros", emoji: "🌹" },
  { id: "tropical", label: "Salsa, bachata y cumbia", emoji: "🎺" },
  { id: "regional", label: "Regional mexicano", emoji: "🤠" },
  { id: "leyendas", label: "Leyendas", emoji: "👑" },
] as const

export type GenreId = (typeof GENRES)[number]["id"]
export type Genre = (typeof GENRES)[number]

export const DEFAULT_GENRE: GenreId = "todos"

export function isGenreId(value: unknown): value is GenreId {
  return GENRES.some((g) => g.id === value)
}

export function getGenre(id: GenreId): Genre {
  return GENRES.find((g) => g.id === id) ?? GENRES[0]
}
