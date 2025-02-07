export type Player = "X" | "O"

export interface PlayerInfo {
  name: string
  symbol: Player
}

export interface GameState {
  id: string
  board: (Player | null)[]
  currentPlayer: Player
  winner: Player | "draw" | null
  createdAt: number
  lastMoveAt: number
  players: PlayerInfo[]
}

