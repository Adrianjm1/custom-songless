import React from "react"
import { useSongStore } from "./store"

export const StepIndicator: React.FC = () => {
  const step = useSongStore((s) => s.step)
  // step inicia en 1, pero los cuadros son 0-4
  return (
    <div className="flex gap-2 justify-center mt-4 mb-2">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="w-8 h-8 flex items-center justify-center rounded border border-gray-500 bg-gray-800">
          {n <= step - 1 ? <span className="text-red-500 text-2xl font-bold">✗</span> : null}
        </div>
      ))}
    </div>
  )
}
