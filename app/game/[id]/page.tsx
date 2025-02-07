import GameClient from "../../../components/GameClient"

export default function Game({ params }: { params: { id: string } }) {
  return <GameClient id={params.id} />
}

