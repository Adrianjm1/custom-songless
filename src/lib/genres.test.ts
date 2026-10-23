import { describe, expect, it } from "vitest"
import { CATALOG_SOURCES, sourcePath } from "./catalog-sources"
import { GENRES, getGenre, isGenreId } from "./genres"

describe("géneros", () => {
  it("cada género (salvo 'todos') tiene fuentes de canciones", () => {
    const withSources = GENRES.map((g) => g.id).filter((id) => id !== "todos")
    expect(Object.keys(CATALOG_SOURCES).sort()).toEqual([...withSources].sort())
    for (const sources of Object.values(CATALOG_SOURCES)) expect(sources.length).toBeGreaterThan(0)
  })

  it("no repite fuentes dentro de un mismo género", () => {
    for (const sources of Object.values(CATALOG_SOURCES)) {
      const paths = sources.map(sourcePath)
      expect(new Set(paths).size).toBe(paths.length)
    }
  })

  it("valida ids de género", () => {
    expect(isGenreId("leyendas")).toBe(true)
    expect(isGenreId("jazz")).toBe(false)
    expect(isGenreId(undefined)).toBe(false)
    expect(getGenre("regional").label).toBe("Regional mexicano")
  })
})
