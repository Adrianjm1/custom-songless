import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { MAX_ATTEMPTS, buildShareText, skipBonus, unlockedSeconds } from "@/lib/game"
import type { Song } from "@/lib/types"
import { useGameStore } from "./game-store"
import { useStatsStore } from "./stats-store"

const song: Song = {
  id: 42,
  title: "Gasolina",
  artist: "Daddy Yankee",
  album: "Barrio Fino",
  preview: "https://example.com/preview.mp3",
  cover: "https://example.com/cover.jpg",
  coverLarge: "https://example.com/cover-xl.jpg",
  link: "https://www.deezer.com/track/42",
}

beforeEach(() => {
  useStatsStore.getState().resetStats()
  useGameStore.setState({ status: "playing", song, attempts: [], error: null })
})

describe("game store", () => {
  it("gana al acertar y registra la estadística", () => {
    useGameStore.getState().skip()
    useGameStore.getState().submitGuess("gasolina")

    const { status, attempts } = useGameStore.getState()
    expect(status).toBe("won")
    expect(attempts.map((a) => a.result)).toEqual(["skipped", "correct"])

    const stats = useStatsStore.getState()
    expect(stats).toMatchObject({ played: 1, wins: 1, currentStreak: 1, recentSongIds: [42] })
    expect(stats.distribution[1]).toBe(1)
  })

  it("pierde tras agotar los intentos y reinicia la racha", () => {
    useStatsStore.setState({ currentStreak: 3, bestStreak: 3 })
    for (let i = 0; i < MAX_ATTEMPTS; i++) useGameStore.getState().submitGuess("otra")

    expect(useGameStore.getState().status).toBe("lost")
    expect(useStatsStore.getState()).toMatchObject({ played: 1, wins: 0, currentStreak: 0, bestStreak: 3 })
  })

  it("ignora intentos vacíos y jugadas tras terminar", () => {
    useGameStore.getState().submitGuess("   ")
    expect(useGameStore.getState().attempts).toHaveLength(0)

    useGameStore.getState().submitGuess("Gasolina")
    useGameStore.getState().skip()
    expect(useGameStore.getState().attempts).toHaveLength(1)
    expect(useStatsStore.getState().played).toBe(1)
  })
})

describe("startRound", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("pide una canción del género elegido sin repetir las recientes", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(song)))
    vi.stubGlobal("fetch", fetchMock)
    useStatsStore.setState({ recentSongIds: [7, 8] })
    useGameStore.getState().setGenre("leyendas")

    await useGameStore.getState().startRound()

    expect(fetchMock).toHaveBeenCalledWith("/api/song?genre=leyendas&exclude=7%2C8", expect.anything())
    expect(useGameStore.getState()).toMatchObject({ status: "playing", song, attempts: [] })
  })

  it("muestra un error si la API falla", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 502 })))
    await useGameStore.getState().startRound()
    expect(useGameStore.getState().status).toBe("error")
  })

  it("goHome descarta una respuesta que llega tarde", async () => {
    let resolve!: (r: Response) => void
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>((r) => (resolve = r))))
    const pending = useGameStore.getState().startRound()
    useGameStore.getState().goHome()
    resolve(new Response(JSON.stringify(song)))
    await pending
    expect(useGameStore.getState()).toMatchObject({ status: "idle", song: null })
  })
})

describe("reglas", () => {
  it("desbloquea más segundos en cada intento", () => {
    expect(unlockedSeconds(0, false)).toBe(0.5)
    expect(unlockedSeconds(4, false)).toBe(20)
    expect(unlockedSeconds(2, true)).toBe(30)
    expect(skipBonus(0)).toBe(1.5)
    expect(skipBonus(MAX_ATTEMPTS - 1)).toBe(0)
  })

  it("genera el texto para compartir", () => {
    const text = buildShareText([{ result: "skipped" }, { result: "wrong" }, { result: "correct" }], true)
    expect(text).toBe("BeatLess 🎵 3/5\n⬛🟥🟩⬜⬜")
    expect(buildShareText([{ result: "wrong" }], false, "Leyendas").split("\n")[0]).toBe("BeatLess 🎵 Leyendas X/5")
  })
})
