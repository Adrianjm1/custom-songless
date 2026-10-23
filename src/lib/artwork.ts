import { cleanTitle } from "./matching"
import type { Song } from "./types"

// El CDN de imágenes de Deezer responde 403 en algunas regiones.
// En ese caso se buscan las portadas en la API pública de iTunes.
const ITUNES_SEARCH_URL = "https://itunes.apple.com/search"
const ARTWORK_REVALIDATE_SECONDS = 7 * 24 * 60 * 60
const ARTWORK_SIZE = 600

interface ItunesResponse {
  results?: { artworkUrl100?: string }[]
}

async function isReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" })
    return res.ok
  } catch {
    return false
  }
}

async function findItunesArtwork(artist: string, title: string): Promise<string | null> {
  const term = encodeURIComponent(`${artist} ${cleanTitle(title)}`)
  try {
    const res = await fetch(`${ITUNES_SEARCH_URL}?term=${term}&entity=song&limit=1`, {
      next: { revalidate: ARTWORK_REVALIDATE_SECONDS },
    })
    if (!res.ok) return null
    const url = ((await res.json()) as ItunesResponse).results?.[0]?.artworkUrl100
    return url ? url.replace(/\/\d+x\d+bb\.jpg$/, `/${ARTWORK_SIZE}x${ARTWORK_SIZE}bb.jpg`) : null
  } catch {
    return null
  }
}

// Devuelve la canción con portadas que se puedan cargar (o vacías si no hay ninguna)
export async function withReachableCovers(song: Song): Promise<Song> {
  if (await isReachable(song.cover)) return song
  const artwork = await findItunesArtwork(song.artist, song.title)
  return { ...song, cover: artwork ?? "", coverLarge: artwork ?? "" }
}
