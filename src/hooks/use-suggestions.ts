import { useEffect, useState } from "react"
import type { Suggestion } from "@/lib/types"

const DEBOUNCE_MS = 250
export const MIN_QUERY_LENGTH = 2

export function useSuggestions(query: string): Suggestion[] {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  useEffect(() => {
    const q = query.trim()
    if (q.length < MIN_QUERY_LENGTH) return
    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        if (res.ok) setSuggestions((await res.json()) as Suggestion[])
      } catch {
        // Petición cancelada o sin conexión: se conservan las sugerencias anteriores
      }
    }, DEBOUNCE_MS)
    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [query])

  return query.trim().length >= MIN_QUERY_LENGTH ? suggestions : []
}
