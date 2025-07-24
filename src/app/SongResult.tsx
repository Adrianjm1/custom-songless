import React from "react"

interface SongResultProps {
  cover: string
  title: string
  artist: string
}

export const SongResult: React.FC<SongResultProps> = ({ cover, title, artist }) => (
  <div className="mt-4">
    <img src={cover} alt="cover" className="w-40 h-40 rounded mb-4 shadow-lg" />
    <p className="text-xl font-bold">{title}</p>
    <p className="text-lg">{artist}</p>
  </div>
)
