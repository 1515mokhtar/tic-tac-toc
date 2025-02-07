"use client"

import { useState } from "react"
import Link from "next/link"
import { PlayerNameInput } from "../components/PlayerNameInput"

export default function Home() {
  const [playerName, setPlayerName] = useState<string | null>(null)

  const handleNameSubmit = (name: string) => {
    setPlayerName(name)
  }

  if (!playerName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-8">Welcome to Tic-Tac-Toe</h1>
        <div className="w-64">
          <PlayerNameInput onSubmit={handleNameSubmit} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Tic-Tac-Toe</h1>
      <p className="mb-4">Welcome, {playerName}!</p>
      <div className="space-y-4">
        <Link
          href={`/create-room?name=${encodeURIComponent(playerName)}`}
          className="block w-48 px-4 py-2 text-center bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Create Room
        </Link>
        <Link
          href={`/join-room?name=${encodeURIComponent(playerName)}`}
          className="block w-48 px-4 py-2 text-center bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Join Room
        </Link>
      </div>
    </div>
  )
}

