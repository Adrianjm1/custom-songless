import { type NextRequest, NextResponse } from "next/server"
import { withReachableCovers } from "@/lib/artwork"
import { CATALOG_SOURCES } from "@/lib/catalog-sources"
import { getCatalog, getTrack } from "@/lib/deezer"
import { DEFAULT_GENRE, type GenreId, isGenreId } from "@/lib/genres"
import { pickByPopularity } from "@/lib/popularity"

// Si la canción elegida ya no tiene preview se prueba con otra
const MAX_PICK_ATTEMPTS = 3

const CATALOG_GENRES = Object.keys(CATALOG_SOURCES) as Exclude<GenreId, "todos">[]

// "todos" elige primero un género al azar para mezclar épocas y estilos;
// si no, los géneros con canciones más recientes (y más rank) acapararían el sorteo
function resolveGenre(genre: GenreId): Exclude<GenreId, "todos"> {
  return genre === "todos" ? CATALOG_GENRES[Math.floor(Math.random() * CATALOG_GENRES.length)] : genre
}

// Devuelve una canción del género pedido, favoreciendo las más populares.
// `?genre=leyendas` elige el género; `?exclude=1,2,3` evita repetir canciones recientes.
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const genreParam = params.get("genre") ?? DEFAULT_GENRE
  if (!isGenreId(genreParam)) {
    return NextResponse.json({ error: "Género desconocido" }, { status: 400 })
  }
  const exclude = new Set(
    (params.get("exclude") ?? "")
      .split(",")
      .map(Number)
      .filter((id) => Number.isInteger(id) && id > 0),
  )

  try {
    const catalog = await getCatalog(resolveGenre(genreParam))
    const fresh = catalog.filter((entry) => !exclude.has(entry.id))
    // Si ya se jugó todo el género, se vuelve a permitir cualquiera
    let pool = fresh.length > 0 ? fresh : catalog

    for (let i = 0; i < MAX_PICK_ATTEMPTS && pool.length > 0; i++) {
      const entry = pickByPopularity(pool)!
      const song = await getTrack(entry.id)
      if (song) {
        return NextResponse.json(await withReachableCovers(song), { headers: { "Cache-Control": "no-store" } })
      }
      pool = pool.filter((e) => e.id !== entry.id)
    }
    return NextResponse.json({ error: "No se encontraron canciones" }, { status: 404 })
  } catch (error) {
    console.error("[api/song]", error)
    return NextResponse.json({ error: "No se pudo obtener una canción" }, { status: 502 })
  }
}
