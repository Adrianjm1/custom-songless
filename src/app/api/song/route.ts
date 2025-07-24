import { NextResponse } from "next/server"

// Utiliza la API de Deezer para buscar canciones latinas/urbanas
// Puedes cambiar el género o la consulta para afinar resultados
// IDs de géneros Deezer: https://developers.deezer.com/api/genre
const GENRES = [197, 60]

export async function GET() {
  try {
    // Selecciona un género aleatorio
    const genre = GENRES[Math.floor(Math.random() * GENRES.length)]
    console.log(`Fetching song from genre: ${genre}`)

    // Consulta canciones populares del género
    const res = await fetch(`https://api.deezer.com/chart/${genre}/tracks?limit=50`)
    const data = await res.json()
    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ error: "No songs found" }, { status: 404 })
    }
    // Selecciona una canción aleatoria
    const song = data.data[Math.floor(Math.random() * data.data.length)]
    // Retorna solo los datos necesarios
    return NextResponse.json({
      title: song.title,
      artist: song.artist.name,
      preview: song.preview, // 30 segundos de preview
      cover: song.album.cover_medium,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch song" }, { status: 500 })
  }
}
