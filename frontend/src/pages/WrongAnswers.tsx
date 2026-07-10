import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageContainer } from '@/components/ui/PageContainer'
import { cn } from '@/lib/utils'
import { ShapeMistakeCard } from '@/components/games/ShapeMistakeCard'
import { FoodMistakeCard, type FoodMistake } from '@/components/games/FoodMemoryPlay'
import { BusMistakeCard, type BusMistake } from '@/components/games/BusMemoryPlay'
import { SequenceMistakeCard, type SequenceMistake } from '@/components/games/ShapeSequencePlay'
import { clearWrongAnswers, deleteWrongAnswer, getWrongAnswers, type WrongAnswerEntry } from '@/lib/wrongAnswers'
import { saveShape } from '@/lib/savedShapes'
import { games, getGame } from '@/lib/games'
import type { ShapeKind } from '@/lib/shapeRotateProblems'
import type { Operation } from '@/lib/shapeTransform'
import { ko } from '@/i18n'

const MODE_LABEL: Record<WrongAnswerEntry['mode'], string> = {
  learn: ko.common.learnMode,
  practice: ko.common.practiceMode,
}

type ShapeRotateMistakeData = {
  kind: ShapeKind
  cells: number[]
  letter: string
  answerOps: Operation[]
  userOps: Operation[]
}

// "틀린 문제 모아보기"를 지원하는 게임만 나열한다 (마법약은 개별 오답을 남기지 않는 설계라 제외).
const SUPPORTED_GAME_IDS = ['shape-rotate', 'food-memory', 'bus-memory', 'shape-sequence']

function WrongAnswerItem({ entry, onDelete }: { entry: WrongAnswerEntry; onDelete: () => void }) {
  const [saved, setSaved] = useState(false)
  const title = `${getGame(entry.gameId)?.name ?? entry.gameId} · ${MODE_LABEL[entry.mode]}`
  const meta = new Date(entry.createdAt).toLocaleString('ko-KR')

  if (entry.gameId === 'shape-rotate') {
    const data = entry.data as ShapeRotateMistakeData
    function handleSave() {
      saveShape({ kind: data.kind, cells: data.cells, letter: data.letter }, data.answerOps)
      setSaved(true)
    }
    return (
      <ShapeMistakeCard
        title={title}
        meta={meta}
        kind={data.kind}
        cells={data.cells}
        letter={data.letter}
        answerOps={data.answerOps}
        userOps={data.userOps}
        onSave={handleSave}
        saved={saved}
        onDelete={onDelete}
      />
    )
  }

  if (entry.gameId === 'food-memory') {
    return <FoodMistakeCard mistake={entry.data as FoodMistake} title={title} meta={meta} onDelete={onDelete} />
  }

  if (entry.gameId === 'bus-memory') {
    return <BusMistakeCard mistake={entry.data as BusMistake} title={title} meta={meta} onDelete={onDelete} />
  }

  if (entry.gameId === 'shape-sequence') {
    return <SequenceMistakeCard mistake={entry.data as SequenceMistake} title={title} meta={meta} onDelete={onDelete} />
  }

  return null
}

export default function WrongAnswers() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedGameId = searchParams.get('game')
  const [entries, setEntries] = useState<WrongAnswerEntry[]>([])

  useEffect(() => {
    setEntries(getWrongAnswers(selectedGameId ?? undefined))
  }, [selectedGameId])

  function handleSelectGame(gameId: string | null) {
    if (gameId) {
      setSearchParams({ game: gameId })
    } else {
      setSearchParams({})
    }
  }

  function handleDelete(id: string) {
    deleteWrongAnswer(id)
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  function handleClearAll() {
    clearWrongAnswers(selectedGameId ?? undefined)
    setEntries([])
  }

  const filterableGames = games.filter((game) => SUPPORTED_GAME_IDS.includes(game.id))

  return (
    <PageContainer className="py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">{ko.wrongAnswers.title}</h1>
          <p className="mt-2 text-base text-muted-foreground">{ko.wrongAnswers.subtitle}</p>
        </div>
        <div className="flex items-center gap-6">
          {entries.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="cursor-pointer text-base text-destructive hover:underline"
            >
              {selectedGameId ? ko.wrongAnswers.deleteThisGame : ko.wrongAnswers.deleteAll}
            </button>
          )}
          <Link to="/games" className="text-base text-primary hover:underline">
            {ko.wrongAnswers.backToGames}
          </Link>
        </div>
      </div>

      <div className="mb-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleSelectGame(null)}
          className={cn(
            'cursor-pointer rounded-full border-2 px-5 py-2 text-sm font-semibold transition-colors',
            !selectedGameId ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground',
          )}
        >
          {ko.wrongAnswers.all}
        </button>
        {filterableGames.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => handleSelectGame(game.id)}
            className={cn(
              'cursor-pointer rounded-full border-2 px-5 py-2 text-sm font-semibold transition-colors',
              selectedGameId === game.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground',
            )}
          >
            {game.name}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <p className="text-center text-lg text-muted-foreground">{ko.wrongAnswers.empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {entries.map((entry) => (
            <WrongAnswerItem key={entry.id} entry={entry} onDelete={() => handleDelete(entry.id)} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
