import { useNavigate, useParams } from 'react-router-dom'
import { BookOpen, Shapes, Timer } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageContainer } from '@/components/ui/PageContainer'
import { cn } from '@/lib/utils'
import { getGame } from '@/lib/games'
import { ko } from '@/i18n'

export default function ModeSelect() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const game = getGame(gameId)

  if (!game) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-muted-foreground">{ko.common.gameNotFound}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-12 bg-background px-8 py-20 text-center">
      <div>
        <h1 className="text-6xl font-bold tracking-tight text-foreground">{game.name}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{ko.modeSelect.subtitle}</p>
      </div>
      <PageContainer
        className={cn(
          'grid grid-cols-1 gap-8',
          game.hasSimulator ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
        )}
      >
        <Card
          className="flex flex-col items-center gap-5 py-20 text-center"
          onClick={() => navigate(`/games/${game.id}/learn`)}
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BookOpen size={40} weight="bold" />
          </span>
          <h2 className="text-2xl font-semibold text-foreground">{ko.modeSelect.learnTitle}</h2>
          <p className="text-base text-muted-foreground">{ko.modeSelect.learnDescription}</p>
        </Card>
        <Card
          className="flex flex-col items-center gap-5 py-20 text-center"
          onClick={() => navigate(`/games/${game.id}/practice`)}
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Timer size={40} weight="bold" />
          </span>
          <h2 className="text-2xl font-semibold text-foreground">{ko.modeSelect.practiceTitle}</h2>
          <p className="text-base text-muted-foreground">{ko.modeSelect.practiceDescription}</p>
        </Card>
        {game.hasSimulator && (
          <Card
            className="flex flex-col items-center gap-5 py-20 text-center"
            onClick={() => navigate(`/games/${game.id}/simulator`)}
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/20 text-primary">
              <Shapes size={40} weight="bold" />
            </span>
            <h2 className="text-2xl font-semibold text-foreground">{ko.modeSelect.simulatorTitle}</h2>
            <p className="text-base text-muted-foreground">{ko.modeSelect.simulatorDescription}</p>
          </Card>
        )}
      </PageContainer>
      <Button variant="secondary" onClick={() => navigate('/games')} className="px-8 py-4 text-base">
        {ko.modeSelect.otherGame}
      </Button>

      <div className="flex flex-wrap items-center justify-center gap-6 text-base">
        {game.id !== 'potion' && (
          <button
            type="button"
            onClick={() => navigate(`/wrong-answers?game=${game.id}`)}
            className="cursor-pointer text-primary hover:underline"
          >
            {ko.modeSelect.wrongAnswersForGame}
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate(`/my-records?game=${game.id}`)}
          className="cursor-pointer text-primary hover:underline"
        >
          {ko.modeSelect.myRecordsForGame}
        </button>
      </div>
    </div>
  )
}
