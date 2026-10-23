import { CATALOG_SOURCES, type CatalogSource, sourcePath } from "./catalog-sources"
import type { GenreId } from "./genres"
import { cleanTitle } from "./matching"
import type { CatalogEntry } from "./popularity"
import type { Song, Suggestion } from "./types"

// Cliente mínimo de la API pública de Deezer (solo se usa desde los route handlers)
const API_URL = "https://api.deezer.com"

// Por debajo de este rank suelen ser versiones de recopilatorios o temas poco conocidos
const MIN_RANK = 80_000
const EXCLUDED_ARTISTS = new Set(["various artists"])
// Deezer limita a ~50 peticiones cada 5 segundos
const MAX_CONCURRENT_REQUESTS = 6

// El catálogo solo guarda ids y popularidad, así que se puede cachear varias horas.
// Las URLs de preview caducan a los ~15 minutos: se piden frescas al elegir la canción.
const CATALOG_REVALIDATE_SECONDS = 6 * 60 * 60
const SEARCH_REVALIDATE_SECONDS = 24 * 60 * 60

interface DeezerTrack {
  id: number
  title: string
  preview: string
  link: string
  rank: number
  readable?: boolean
  artist: { name: string }
  album: { title: string; cover_small: string; cover_medium: string; cover_xl: string }
}

interface DeezerError {
  error?: { message: string }
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init)
  if (!res.ok) throw new Error(`Deezer respondió ${res.status}`)
  // Deezer devuelve los errores con status 200 y un campo `error`
  const body = (await res.json()) as T & DeezerError
  if (body.error) throw new Error(`Deezer: ${body.error.message}`)
  return body
}

async function fetchSource(source: CatalogSource): Promise<DeezerTrack[]> {
  try {
    const { data = [] } = await request<{ data?: DeezerTrack[] }>(sourcePath(source), { next: { revalidate: CATALOG_REVALIDATE_SECONDS } })
    return data
  } catch (error) {
    // Una fuente caída no debe dejar el género vacío
    console.warn(`[deezer] fuente "${source.name}" no disponible:`, error)
    return []
  }
}

async function fetchSources(sources: CatalogSource[]): Promise<DeezerTrack[][]> {
  const results: DeezerTrack[][] = []
  for (let i = 0; i < sources.length; i += MAX_CONCURRENT_REQUESTS) {
    results.push(...(await Promise.all(sources.slice(i, i + MAX_CONCURRENT_REQUESTS).map(fetchSource))))
  }
  return results
}

export async function getCatalog(genre: Exclude<GenreId, "todos">): Promise<CatalogEntry[]> {
  const lists = await fetchSources(CATALOG_SOURCES[genre])

  // La misma canción aparece en varias playlists y versiones: se queda la más popular
  const byKey = new Map<string, CatalogEntry>()
  for (const tracks of lists) {
    for (const t of tracks) {
      if (!t.preview || t.rank < MIN_RANK || EXCLUDED_ARTISTS.has(t.artist.name.toLowerCase())) continue
      const key = `${cleanTitle(t.title)}|${t.artist.name.toLowerCase()}`
      const existing = byKey.get(key)
      if (!existing || existing.rank < t.rank) byKey.set(key, { id: t.id, rank: t.rank })
    }
  }
  return [...byKey.values()]
}

// Datos frescos de una canción (preview recién firmado)
export async function getTrack(id: number): Promise<Song | null> {
  const t = await request<DeezerTrack>(`/track/${id}`, { cache: "no-store" })
  if (!t.preview || t.readable === false) return null
  return {
    id: t.id,
    title: t.title,
    artist: t.artist.name,
    album: t.album.title,
    preview: t.preview,
    cover: t.album.cover_medium,
    coverLarge: t.album.cover_xl,
    link: t.link,
  }
}

export async function searchTracks(query: string, limit = 8): Promise<Suggestion[]> {
  const { data = [] } = await request<{ data?: DeezerTrack[] }>(`/search/track?q=${encodeURIComponent(query)}&limit=${limit * 2}`, {
    next: { revalidate: SEARCH_REVALIDATE_SECONDS },
  })
  // Deezer repite la misma canción en singles, álbumes y recopilatorios
  const unique = new Map<string, Suggestion>()
  for (const t of data) {
    const key = `${t.title}|${t.artist.name}`.toLowerCase()
    if (!unique.has(key)) unique.set(key, { id: t.id, title: t.title, artist: t.artist.name, cover: t.album.cover_small })
  }
  return [...unique.values()].slice(0, limit)
}
