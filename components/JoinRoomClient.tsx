"use client"

import { useState, useEffect } from "react"
import { Suspense } from 'react';

import { useRouter, useSearchParams } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../lib/firebase"


function JoinRoomContent() {
  const [roomCode, setRoomCode] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const playerName = searchParams.get("name")

  const joinRoom = async (code: string) => {
    const gameRef = doc(db, "games", code)
    const gameSnap = await getDoc(gameRef)

    if (gameSnap.exists()) {
      const gameData = gameSnap.data()
      if (gameData.players.length < 2) {
        await updateDoc(gameRef, {
          players: [...gameData.players, { name: playerName, symbol: "O" }],
        })
        router.push(`/game/${code}?name=${encodeURIComponent(playerName)}`)
      } else {
        setError("This room is full")
      }
    } else {
      setError("Invalid room code")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    await joinRoom(roomCode)
  }

  useEffect(() => {
    const code = searchParams.get("code")
    if (code) {
      setRoomCode(code)
      joinRoom(code)
    }
  }, [searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Join Room</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Enter Room Code"
          className="px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Join Room
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}

export default function JoinRoomClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JoinRoomContent />
    </Suspense>
  )
}

