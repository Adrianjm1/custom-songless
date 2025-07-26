import Image from "next/image"
import React from "react"

interface SongResultProps {
  cover: string
  title: string
  artist: string
}

export const SongResult: React.FC<SongResultProps> = ({ cover, title, artist }) => (
  <div className="mt-4 justify-center flex flex-col items-center">
    <Image src={cover} alt="cover" width={160} height={160} className="rounded mb-4 shadow-lg" style={{ width: "160px", height: "160px" }} />
    <p className="text-xl font-bold">{title}</p>
    <p className="text-lg">{artist}</p>
  </div>
)
