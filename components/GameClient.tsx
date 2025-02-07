"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useGameState } from "../lib/useGameState"
import GameBoard from "./GameBoard"
import { User, UserCheck } from "lucide-react"

function GameContent({ id }: { id: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const playerName = searchParams.get("name")
  const { gameState, makeMove, resetGame } = useGameState(id)
  const [resetTimer, setResetTimer] = useState<number | null>(null)

  useEffect(() => {
    if (gameState?.winner) {
      const timer = setTimeout(() => {
        router.push("/")
      }, 30000)

      return () => clearTimeout(timer)
    }
  }, [gameState?.winner, router])

  const handleReset = async () => {
    if (resetTimer) {
      // Cancel the reset
      clearTimeout(resetTimer)
      setResetTimer(null)
    } else {
      // Initiate the reset
      await resetGame() // Reset the game in Firestore
      const timer = setTimeout(() => {
        router.push("/")
      }, 30000)
      setResetTimer(timer)
    }
  }

  if (!gameState) {
    return <div>Loading...</div>
  }

  const currentPlayer = gameState.players.find((p) => p.name === playerName)
  const opponent = gameState.players.find((p) => p.name !== playerName)
  const isPlayerTurn = currentPlayer?.symbol === gameState.currentPlayer

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold mb-8">Tic-Tac-Toe</h1>
      <div className="flex justify-between w-full max-w-md mb-4">
        <div className="flex items-center">
          <User className="mr-2" />
          <span>
            {currentPlayer?.name} ({currentPlayer?.symbol})
          </span>
        </div>
        <div className="flex items-center">
          <UserCheck className="mr-2" />
          <span>
            {opponent?.name} ({opponent?.symbol})
          </span>
        </div>
      </div>
      <GameBoard
        gameState={gameState}
        onMakeMove={makeMove}
        isPlayerTurn={isPlayerTurn}
        currentPlayerSymbol={currentPlayer?.symbol}
      />
      {gameState.winner && (
        <div className="mt-8 text-2xl font-bold">
          {gameState.winner === "draw" ? (
            "It's a draw!"
          ) : (
            <>
              {gameState.players.find((p) => p.symbol === gameState.winner)?.name} wins!
              {gameState.winner === currentPlayer?.symbol && <UserCheck className="inline ml-2" />}
            </>
          )}
        </div>
      )}
      {!gameState.winner && <div className="mt-4 text-xl">{isPlayerTurn ? "Your turn" : "Opponent's turn"}</div>}
      <button
        onClick={handleReset}
        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {resetTimer ? "Cancel Reset" : "Reset Game"}
      </button>
      {resetTimer && (
        <p className="mt-4 text-red-500">
          The other player has left. You will be redirected to the home page in 30 seconds.
        </p>
      )}
    </div>
  )
}

export default function GameClient({ id }: { id: string }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameContent id={id} />
    </Suspense>
  )
}

