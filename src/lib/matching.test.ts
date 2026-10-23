import { describe, expect, it } from "vitest"
import { cleanTitle, isCorrectGuess, normalize } from "./matching"

describe("normalize", () => {
  it("quita tildes y mayúsculas", () => {
    expect(normalize("  Tití Me PREGUNTÓ ")).toBe("titi me pregunto")
  })
})

describe("cleanTitle", () => {
  it.each([
    ["Tití Me Preguntó", "titi me pregunto"],
    ["Pepas (Remix)", "pepas"],
    ["Hawái - Remix", "hawai"],
    ["La Bebé [Remix]", "la bebe"],
    ["Despacito feat. Justin Bieber", "despacito"],
    ["Gasolina ft Lil Jon", "gasolina"],
    ["¿Qué Más Pues?", "que mas pues"],
    ["Ella Baila Sola", "ella baila sola"],
  ])("%s -> %s", (input, expected) => {
    expect(cleanTitle(input)).toBe(expected)
  })
})

describe("isCorrectGuess", () => {
  const answer = { id: 1, title: "Tití Me Preguntó (feat. Alguien)" }

  it("acepta el título sin tildes ni versión", () => {
    expect(isCorrectGuess("titi me pregunto", answer)).toBe(true)
  })

  it("rechaza títulos distintos", () => {
    expect(isCorrectGuess("Me Porto Bonito", answer)).toBe(false)
  })

  it("acepta la sugerencia con el mismo id aunque el texto difiera", () => {
    expect(isCorrectGuess("otro texto", answer, { id: 1, title: "otro texto" })).toBe(true)
  })

  it("acepta otra versión de la misma canción elegida en las sugerencias", () => {
    expect(isCorrectGuess("Tití Me Preguntó", answer, { id: 99, title: "Tití Me Preguntó" })).toBe(true)
  })

  it("compara tal cual los títulos formados solo por símbolos", () => {
    expect(isCorrectGuess("$$$", { id: 2, title: "$$$" })).toBe(true)
    expect(isCorrectGuess("!!!", { id: 2, title: "$$$" })).toBe(false)
  })
})
