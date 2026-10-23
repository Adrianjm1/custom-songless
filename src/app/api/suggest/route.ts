import { type NextRequest, NextResponse } from "next/server"
import { searchTracks } from "@/lib/deezer"

// Autocompletado de títulos para el campo de respuesta
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim() ?? ""
  if (query.length < 2 || query.length > 100) return NextResponse.json([])

  try {
    const suggestions = await searchTracks(query)
    return NextResponse.json(suggestions, { headers: { "Cache-Control": "public, max-age=3600" } })
  } catch (error) {
    console.error("[api/suggest]", error)
    return NextResponse.json([], { status: 502 })
  }
}
