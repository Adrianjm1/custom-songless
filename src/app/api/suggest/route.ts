/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")
  if (!q || q.length < 2) {
    return NextResponse.json([])
  }
  try {
    const res = await fetch(`https://api.deezer.com/search/track?q=${encodeURIComponent(q)}&limit=5`)
    const data = await res.json()
    if (data.data) {
      // Canciones únicas por título y artista
      const unique = Array.from(new Map(data.data.map((t: any) => [t.title + t.artist.name, { title: t.title, artist: t.artist.name }])).values())
      return NextResponse.json(unique)
    }
    return NextResponse.json([])
  } catch {
    return NextResponse.json([])
  }
}
