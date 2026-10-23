import { describe, expect, it } from "vitest"
import { pickByPopularity } from "./popularity"

describe("pickByPopularity", () => {
  it("devuelve undefined con un catálogo vacío", () => {
    expect(pickByPopularity([])).toBeUndefined()
  })

  it("respeta los extremos del número aleatorio", () => {
    const entries = [
      { id: 1, rank: 1000 },
      { id: 2, rank: 500 },
    ]
    expect(pickByPopularity(entries, () => 0)?.id).toBe(1)
    expect(pickByPopularity(entries, () => 0.999999)?.id).toBe(2)
  })

  it("favorece claramente a las canciones más populares", () => {
    const entries = [
      { id: 1, rank: 1_000_000 },
      { id: 2, rank: 500_000 },
    ]
    let seed = 1
    const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
    const picks = Array.from({ length: 9000 }, () => pickByPopularity(entries, random)?.id)
    const famous = picks.filter((id) => id === 1).length / picks.length
    // Peso 1 frente a 0.125 -> ~89%
    expect(famous).toBeGreaterThan(0.85)
    expect(famous).toBeLessThan(0.93)
  })

  it("elige al azar si ninguna tiene popularidad", () => {
    const entries = [
      { id: 1, rank: 0 },
      { id: 2, rank: 0 },
    ]
    expect(pickByPopularity(entries, () => 0.75)?.id).toBe(2)
  })
})
