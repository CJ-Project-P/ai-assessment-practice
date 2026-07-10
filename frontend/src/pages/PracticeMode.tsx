import { useParams } from 'react-router-dom'
import { ShapeRotatePlay } from '@/components/games/ShapeRotatePlay'
import { FoodMemoryPlay } from '@/components/games/FoodMemoryPlay'
import { BusMemoryPlay } from '@/components/games/BusMemoryPlay'
import { ShapeSequencePlay } from '@/components/games/ShapeSequencePlay'
import { PotionPlay } from '@/components/games/PotionPlay'
import { getGame } from '@/lib/games'
import { ko } from '@/i18n'

export default function PracticeMode() {
  const { gameId } = useParams()
  const game = getGame(gameId)

  if (!game) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-muted-foreground">{ko.common.gameNotFound}</p>
      </div>
    )
  }

  if (game.id === 'shape-rotate') {
    return (
      <div className="min-h-dvh bg-background">
        <ShapeRotatePlay mode="practice" />
      </div>
    )
  }

  if (game.id === 'food-memory') {
    return (
      <div className="min-h-dvh bg-background">
        <FoodMemoryPlay mode="practice" />
      </div>
    )
  }

  if (game.id === 'bus-memory') {
    return (
      <div className="min-h-dvh bg-background">
        <BusMemoryPlay mode="practice" />
      </div>
    )
  }

  if (game.id === 'shape-sequence') {
    return (
      <div className="min-h-dvh bg-background">
        <ShapeSequencePlay mode="practice" />
      </div>
    )
  }

  if (game.id === 'potion') {
    return (
      <div className="min-h-dvh bg-background">
        <PotionPlay mode="practice" />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-background px-6 text-center">
      <h1 className="text-2xl font-bold text-foreground">
        {game.name} · {ko.modeSelect.practiceTitle}
      </h1>
      <p className="text-muted-foreground">{ko.practiceMode.inProgress}</p>
    </div>
  )
}
