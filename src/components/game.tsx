"use client"

import { useEffect, useState } from "react"
import { useGameStore } from "@/store/game-store"
import { useStatsStore } from "@/store/stats-store"
import { Header } from "./header"
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
      <footer className="py-6 text-center text-xs text-white/35">Fragmentos de audio vía Deezer · Proyecto no oficial</footer>
      {statsOpen && <StatsDialog onClose={() => setStatsOpen(false)} />}
    </div>
  )
}
