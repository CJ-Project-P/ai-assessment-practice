import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageContainer } from '@/components/ui/PageContainer'
import { cn } from '@/lib/utils'
import { onAuthStateChange, type AuthUser } from '@/lib/auth'
import { getPracticeRecords, type PracticeRecord } from '@/lib/practiceRecords'
import { games } from '@/lib/games'
import { ko } from '@/i18n'

const CHART_HEIGHT = 120
const MAX_BARS = 20

function withAccuracy(record: PracticeRecord) {
  const accuracy = record.total === 0 ? 0 : Math.round((record.correct / record.total) * 100)
  return { ...record, accuracy }
}

function AccuracyChart({ records }: { records: PracticeRecord[] }) {
  const data = records.map(withAccuracy).slice(-MAX_BARS)
  return (
    <div
      className="flex items-end gap-3 overflow-x-auto rounded-xl border border-border bg-background p-4"
      style={{ minHeight: CHART_HEIGHT + 40 }}
    >
      {data.map((r) => (
        <div key={r.id} className="flex shrink-0 flex-col items-center gap-1">
          <span className="text-xs font-semibold text-foreground">{r.accuracy}%</span>
          <div
            className="w-6 rounded-t-sm bg-primary"
            style={{ height: Math.max(4, (r.accuracy / 100) * CHART_HEIGHT) }}
          />
        </div>
      ))}
    </div>
  )
}

function TrendNote({ records }: { records: PracticeRecord[] }) {
  if (records.length < 2) return null
  const data = records.map(withAccuracy)
  const latest = data[data.length - 1]
  const previous = data[data.length - 2]
  const diff = latest.accuracy - previous.accuracy

  if (diff > 0) {
    return <p className="text-base font-semibold text-primary">{ko.myRecords.trendUp(diff)}</p>
  }
  if (diff < 0) {
    return <p className="text-base font-semibold text-destructive">{ko.myRecords.trendDown(Math.abs(diff))}</p>
  }
  return <p className="text-base text-muted-foreground">{ko.myRecords.trendSame}</p>
}

function GameRecordSection({ gameId, gameName, records }: { gameId: string; gameName: string; records: PracticeRecord[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">{gameName}</h2>
        <span className="text-sm text-muted-foreground">{ko.myRecords.recordCount(records.length)}</span>
      </div>

      <AccuracyChart records={records} />
      <TrendNote records={records} />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-muted-foreground">
              <th className="py-2 pr-4 font-medium">{ko.myRecords.dateHeader}</th>
              <th className="py-2 pr-4 font-medium">{ko.myRecords.correctHeader}</th>
              <th className="py-2 pr-4 font-medium">{ko.myRecords.accuracyHeader}</th>
            </tr>
          </thead>
          <tbody>
            {[...records]
              .reverse()
              .map(withAccuracy)
              .map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-2 pr-4 text-foreground">{new Date(r.createdAt).toLocaleString('ko-KR')}</td>
                  <td className="py-2 pr-4 text-foreground">
                    {r.correct} / {r.total}
                  </td>
                  <td className="py-2 pr-4 text-foreground">{r.accuracy}%</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">{ko.myRecords.gameIdLabel(gameId)}</p>
    </div>
  )
}

export default function MyRecords() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [allRecords, setAllRecords] = useState<PracticeRecord[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedGameId = searchParams.get('game')

  useEffect(() => onAuthStateChange(setUser), [])

  useEffect(() => {
    getPracticeRecords().then(setAllRecords)
  }, [])

  const allSections = games
    .map((game) => ({ game, records: allRecords.filter((r) => r.gameId === game.id) }))
    .filter((s) => s.records.length > 0)
  const sections = selectedGameId ? allSections.filter((s) => s.game.id === selectedGameId) : allSections

  function handleSelectGame(gameId: string | null) {
    if (gameId) {
      setSearchParams({ game: gameId })
    } else {
      setSearchParams({})
    }
  }

  return (
    <PageContainer className="py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">{ko.myRecords.title}</h1>
          <p className="mt-2 text-base text-muted-foreground">{ko.myRecords.subtitle(user?.email ?? null)}</p>
        </div>
        <Link to="/games" className="text-base text-primary hover:underline">
          {ko.myRecords.backToGames}
        </Link>
      </div>

      {allSections.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleSelectGame(null)}
            className={cn(
              'cursor-pointer rounded-full border-2 px-5 py-2 text-sm font-semibold transition-colors',
              !selectedGameId ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground',
            )}
          >
            {ko.myRecords.all}
          </button>
          {allSections.map(({ game }) => (
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
      )}

      {sections.length === 0 ? (
        <p className="text-center text-lg text-muted-foreground">{ko.myRecords.empty}</p>
      ) : (
        <div className="flex flex-col gap-8">
          {sections.map(({ game, records }) => (
            <GameRecordSection key={game.id} gameId={game.id} gameName={game.name} records={records} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
