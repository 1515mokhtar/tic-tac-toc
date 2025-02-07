"use client"

import { useState, useEffect } from "react"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "./firebase"
import type { GameState, Player } from "../types/game"

export function useGameState(gameId: string) {
  const [gameState, setGameState] = useState<GameState | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "games", gameId), (doc) => {
      if (doc.exists()) {
        setGameState(doc.data() as GameState)
      }
    })

    return () => unsubscribe()
  }, [gameId])

  const updateGame = async (updates: Partial<GameState>) => {
    if (gameState) {
      await updateDoc(doc(db, "games", gameId), updates)
    }
  }

  const makeMove = async (index: number) => {
    if (gameState && gameState.board[index] === null && !gameState.winner) {
      const newBoard = [...gameState.board]
      newBoard[index] = gameState.currentPlayer

      const winner = checkWinner(newBoard)
      const isDraw = newBoard.every((cell) => cell !== null)

      await updateGame({
        board: newBoard,
        currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
        winner: winner || (isDraw ? "draw" : null),
        lastMoveAt: Date.now(),
      })
    }
  }

  const resetGame = async () => {
    await updateGame({
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
      lastMoveAt: Date.now(),
    })
  }

  return { gameState, makeMove, resetGame }
}

function checkWinner(board: (Player | null)[]): Player | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player
    }
  }

  return null
}

