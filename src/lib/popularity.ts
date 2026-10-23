export interface CatalogEntry {
  id: number
  // Popularidad de Deezer (0 – ~1.000.000)
  rank: number
}

// Cuánto se favorecen las canciones famosas. Con 3, en el catálogo actual (~900 canciones)
// el top 250 sale ~60% de las veces y la mitad menos popular ~17%.
export const POPULARITY_EXPONENT = 3

// Elige una entrada al azar con probabilidad proporcional a (rank / máximo) ^ exponente
export function pickByPopularity<T extends CatalogEntry>(entries: readonly T[], random: () => number = Math.random): T | undefined {
  if (entries.length === 0) return undefined
  const maxRank = Math.max(...entries.map((e) => e.rank), 1)
  const weights = entries.map((e) => (Math.max(e.rank, 0) / maxRank) ** POPULARITY_EXPONENT)
  const total = weights.reduce((sum, w) => sum + w, 0)
  if (total === 0) return entries[Math.floor(random() * entries.length)]

  let target = random() * total
  for (let i = 0; i < entries.length; i++) {
    target -= weights[i]
    if (target < 0) return entries[i]
  }
  return entries[entries.length - 1]
}
