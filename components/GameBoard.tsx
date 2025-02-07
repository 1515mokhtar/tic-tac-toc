import type { GameState, Player } from "../types/game"

interface GameBoardProps {
  gameState: GameState
  onMakeMove: (index: number) => void
  isPlayerTurn: boolean
  currentPlayerSymbol: Player | undefined
}

export default function GameBoard({ gameState, onMakeMove, isPlayerTurn, currentPlayerSymbol }: GameBoardProps) {
  const renderSquare = (index: number) => {
    const value = gameState.board[index]
    const player = gameState.players.find((p) => p.symbol === value)
    return (
      <button
        className={`w-20 h-20 border border-gray-300 text-4xl font-bold flex items-center justify-center ${
          isPlayerTurn && !value ? "hover:bg-gray-200" : ""
        }`}
        onClick={() => isPlayerTurn && onMakeMove(index)}
        disabled={!isPlayerTurn || value !== null || gameState.winner !== null}
      >
        {value && (
          <span className="flex items-center justify-center">
            {value}
            <span className="text-xs ml-1">{player?.name}</span>
          </span>
        )}
      </button>
    )
  }

  return <div className="grid grid-cols-3 gap-2">{gameState.board.map((_, index) => renderSquare(index))}</div>
}

