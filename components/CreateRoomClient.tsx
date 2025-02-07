"use client"

import { useState, useEffect } from "react"

import { Suspense } from 'react';

import { useRouter, useSearchParams } from "next/navigation"
import { doc, setDoc, onSnapshot } from "firebase/firestore"
import { db } from "../lib/firebase"
import type { GameState } from "../types/game"


function CreateRoomContent() {
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(60)
  const router = useRouter()
  const searchParams = useSearchParams()
  const playerName = searchParams.get("name")

  useEffect(() => {
    const generateRoomCode = async () => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      const gameState: GameState = {
        id: code,
        board: Array(9).fill(null),
        currentPlayer: "X",
        winner: null,
        createdAt: Date.now(),
        lastMoveAt: Date.now(),
        players: [{ name: playerName, symbol: "X" }],
      }

      await setDoc(doc(db, "games", code), gameState)
      setRoomCode(code)
    }

    generateRoomCode()
  }, [playerName])

  useEffect(() => {
    if (roomCode) {
      // Set up a real-time listener for the room
      const gameRef = doc(db, "games", roomCode)
      const unsubscribe = onSnapshot(gameRef, (doc) => {
        const gameData = doc.data()
        if (gameData && gameData.players.length === 2) {
          // Redirect to the game page when the second player joins
          router.push(`/game/${roomCode}?name=${encodeURIComponent(playerName)}`)
        }
      })

      // Clean up the listener when the component unmounts
      return () => unsubscribe()
    }
  }, [roomCode, router, playerName])

  useEffect(() => {
    if (roomCode) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push("/")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [roomCode, router])

  const copyToClipboard = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode)
    }
  }

  const shareRoomLink = () => {
    if (roomCode) {
      const url = `${window.location.origin}/join-room?code=${roomCode}`
      navigator.clipboard.writeText(url)
      alert("Room link copied to clipboard!")
    }
  }

  if (!roomCode) {
    return <div>Generating room code...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Room Created</h1>
      <p className="text-2xl mb-4">Room Code: {roomCode}</p>
      <div className="space-y-4">
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Copy Room Code
        </button>
        <button
          onClick={shareRoomLink}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Share Room Link
        </button>
      </div>
      <p className="mt-4">Waiting for player to join... ({countdown}s)</p>
    </div>
  )
}

export default function CreateRoomClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateRoomContent />
    </Suspense>
  )
}

