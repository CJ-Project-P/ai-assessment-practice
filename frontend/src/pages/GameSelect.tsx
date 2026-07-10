import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowsClockwise,
  Bus,
  Cards,
  Flask,
  ForkKnife,
  type Icon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageContainer } from '@/components/ui/PageContainer'
import { games, type GameId } from '@/lib/games'
import { ko } from '@/i18n'

const gameIcons: Record<GameId, Icon> = {
  'shape-rotate': ArrowsClockwise,
  potion: Flask,
  'shape-sequence': Cards,
  'food-memory': ForkKnife,
  'bus-memory': Bus,
}

export default function GameSelect() {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-background px-8 py-20">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute left-8 top-8 flex cursor-pointer items-center gap-1 text-base text-muted-foreground hover:text-foreground hover:underline"
      >
        <ArrowLeft size={20} weight="bold" />
        {ko.gameSelect.backHome}
      </button>

      <PageContainer>
        <div className="mb-16 text-center">
          <h1 className="text-6xl font-bold tracking-tight text-foreground">{ko.gameSelect.title}</h1>
          <p className="mt-5 text-xl text-muted-foreground">{ko.gameSelect.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {games.map((game) => {
            const GameIcon = gameIcons[game.id]
            return (
              <Card
                key={game.id}
                className="flex flex-col items-center gap-6 py-20 text-center"
                onClick={() => navigate(`/games/${game.id}`)}
              >
                <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <GameIcon size={56} weight="bold" />
                </span>
                <span>
                  <h2 className="text-3xl font-semibold text-foreground">{game.name}</h2>
                  <p className="mt-3 text-lg text-muted-foreground">{game.description}</p>
                </span>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/wrong-answers')} className="px-10 py-5 text-lg">
            {ko.common.wrongAnswersLink}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/my-records')} className="px-10 py-5 text-lg">
            {ko.gameSelect.myRecords}
          </Button>
        </div>
      </PageContainer>
    </div>
  )
}
