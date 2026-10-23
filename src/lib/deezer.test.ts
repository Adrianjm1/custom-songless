import { describe, expect, it } from "vitest"
import { isMainArtist } from "./deezer"

describe("isMainArtist", () => {
  const thalia = { id: 710, name: "Thalía" }

  it("acepta canciones del propio artista", () => {
    expect(isMainArtist({ artist: { id: 710, name: "Thalia" } }, thalia)).toBe(true)
  })

  it("acepta el mismo artista duplicado con otro id", () => {
    expect(isMainArtist({ artist: { id: 999, name: "Thalia" } }, thalia)).toBe(true)
  })

  it("descarta colaboraciones de otros artistas", () => {
    expect(isMainArtist({ artist: { id: 4321, name: "Diego Torres" } }, thalia)).toBe(false)
  })
})
