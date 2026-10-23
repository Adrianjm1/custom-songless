"use client"

import { useEffect, useState } from "react"
import { KOFI_URL } from "@/lib/site"
import { useGameStore } from "@/store/game-store"
import { useStatsStore } from "@/store/stats-store"
import { Header } from "./header"
import { CoffeeIcon } from "./icons"
import { Round } from "./round"
import { StartScreen } from "./start-screen"
import { StatsDialog } from "./stats-dialog"
import { ErrorCard, LoadingCard } from "./status-cards"

export function Game() {
  const status = useGameStore((s) => s.status)
  const [statsOpen, setStatsOpen] = useState(false)

  useEffect(() => {
    void useStatsStore.persist.rehydrate()
    void useGameStore.persist.rehydrate()
  }, [])

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4">
      <Header onOpenStats={() => setStatsOpen(true)} />
      <main className="flex flex-1 flex-col justify-center py-6">
        {status === "idle" && <StartScreen />}
        {status === "loading" && <LoadingCard />}
        {status === "error" && <ErrorCard />}
        {(status === "playing" || status === "won" || status === "lost") && <Round />}
      </main>
      <footer className="flex flex-col items-center gap-3 py-6 text-center text-xs text-white/35">
        <a
          href={KOFI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <CoffeeIcon className="size-4 text-sun" />
          ¿Te gusta BeatLess? Invítame un café
        </a>
        <p>Fragmentos de audio vía Deezer · Proyecto no oficial</p>
      </footer>
      {statsOpen && <StatsDialog onClose={() => setStatsOpen(false)} />}
    </div>
  )
}
