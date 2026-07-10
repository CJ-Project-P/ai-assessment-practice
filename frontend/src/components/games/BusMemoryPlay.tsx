import { useEffect, useState } from 'react'
import { Bus, Check, Trash, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { PageContainer } from '@/components/ui/PageContainer'
import { cn } from '@/lib/utils'
import { GameExitButton, GameResultSummary, MistakeList } from '@/components/games/GameSessionUI'
import { generateBusProblem, type BusMemoryProblem, type BusTurn, type Round } from '@/lib/busMemoryProblems'
import { addPracticeRecord } from '@/lib/practiceRecords'
import { addWrongAnswer } from '@/lib/wrongAnswers'
import { roundPair, type Mode } from '@/lib/gameRounds'
import { ko } from '@/i18n'

/** DB에는 정답/내 답안 숫자만 저장한다 (턴 노출 데이터는 오답 카드에서 안 쓰여서 저장 안 함). */
export type BusMistake = {
  correctNumber: number
  selectedNumber: number | null
}

const TURN_MS = 1000
const ANSWER_MS = 3000
const PRACTICE_ROUND_COUNT = 10
const BUS_COLORS = [
  'var(--color-chart-amber)',
  'var(--color-primary)',
  'var(--color-chart-green)',
  'var(--color-chart-purple)',
  'var(--color-destructive)',
  'var(--color-chart-teal)',
]

function TurnCard({ turn }: { turn: BusTurn }) {
  return (
    <div className="flex flex-col items-center gap-10">
      <p className="text-7xl font-bold text-foreground">{turn.name}</p>
      <div
        className="w-full max-w-6xl overflow-hidden rounded-2xl border border-border"
        style={{
          background: 'linear-gradient(180deg, var(--color-sky-100) 0%, var(--color-sky-50) 70%, var(--color-sky-50) 100%)',
        }}
      >
        <div className="flex flex-wrap items-end justify-center gap-24 px-20 pb-0 pt-20">
          {turn.numbers.map((num, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="rounded-xl bg-foreground px-8 py-4 text-5xl font-extrabold text-background">
                {num}
              </div>
              <Bus size={140} weight="fill" style={{ color: BUS_COLORS[i % BUS_COLORS.length] }} />
            </div>
          ))}
        </div>
        <div className="relative h-14 w-full bg-neutral-500">
          <div
            className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, white 0px, white 32px, transparent 32px, transparent 64px)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

function AnswerOption({
  number,
  disabled,
  onSelect,
  status,
}: {
  number: number
  disabled: boolean
  onSelect: () => void
  status: 'idle' | 'correct' | 'wrong'
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        'flex cursor-pointer items-center justify-center rounded-2xl border-2 px-10 py-14 text-5xl font-extrabold transition-colors',
        status === 'idle' && 'border-border text-foreground hover:border-primary/50',
        status === 'correct' && 'border-primary bg-primary/10 text-primary',
        status === 'wrong' && 'border-destructive bg-destructive/10 text-destructive',
        disabled && status === 'idle' && 'cursor-not-allowed hover:border-border',
      )}
    >
      {number}
    </button>
  )
}

export function BusMistakeCard({
  mistake,
  title,
  meta,
  onDelete,
}: {
  mistake: BusMistake
  title: string
  meta?: string
  onDelete?: () => void
}) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-muted-foreground">{title}</p>
        {meta && <p className="text-sm text-muted-foreground">{meta}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-primary">{ko.common.answerLabel}</p>
          <p className="text-4xl font-extrabold text-foreground">{mistake.correctNumber}</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-destructive">{ko.common.myAnswerLabel}</p>
          {mistake.selectedNumber !== null ? (
            <p className="text-4xl font-extrabold text-foreground">{mistake.selectedNumber}</p>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">{ko.common.timedOut}</p>
          )}
        </div>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="flex cursor-pointer items-center justify-center gap-1 text-sm text-destructive hover:underline"
        >
          <Trash size={16} weight="bold" />
          {ko.common.delete}
        </button>
      )}
    </div>
  )
}

type BusMemoryPlayProps = {
  mode: Mode
  round1Count?: number
  round2Count?: number
  onFinish?: () => void
}

export function BusMemoryPlay({ mode, round1Count: round1CountProp, round2Count: round2CountProp, onFinish }: BusMemoryPlayProps) {
  const [round1Count, round2Count] = roundPair(mode, PRACTICE_ROUND_COUNT, round1CountProp, round2CountProp)

  const [round, setRound] = useState<Round>(1)
  const [roundSolvedCount, setRoundSolvedCount] = useState(0)
  const [solvedCount, setSolvedCount] = useState(0)
  const [problem, setProblem] = useState<BusMemoryProblem>(() => generateBusProblem(1))
  const [phase, setPhase] = useState<'turn' | 'answer'>('turn')
  const [turnIndex, setTurnIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)
  const [remainingMs, setRemainingMs] = useState(TURN_MS)
  const [mistakes, setBusMistakes] = useState<BusMistake[]>([])
  const [finished, setFinished] = useState(false)

  const roundTarget = round === 1 ? round1Count : round2Count

  // 턴 노출(1초)과 응답 제한(3초) 진행 — 실제 판정을 담당하는 타이머
  useEffect(() => {
    if (finished) return
    if (phase === 'answer' && answered) return

    const duration = phase === 'turn' ? TURN_MS : ANSWER_MS
    const id = setTimeout(() => {
      if (phase === 'turn') {
        if (turnIndex < 2) {
          setTurnIndex((i) => i + 1)
        } else {
          setPhase('answer')
        }
      } else {
        handleAnswer(null)
      }
    }, duration)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, turnIndex, problem, finished, answered])

  // 남은 시간 표시용 카운트다운 (판정 로직과 분리된 화면 표시 전용)
  useEffect(() => {
    if (finished) return
    const duration = phase === 'turn' ? TURN_MS : ANSWER_MS
    setRemainingMs(duration)
    if (phase === 'answer' && answered) return
    const id = setInterval(() => {
      setRemainingMs((prev) => Math.max(0, prev - 100))
    }, 100)
    return () => clearInterval(id)
  }, [phase, turnIndex, problem, finished, answered])

  function goToNextQuestion(currentRound: Round) {
    setProblem(generateBusProblem(currentRound))
    setPhase('turn')
    setTurnIndex(0)
    setAnswered(false)
    setSelected(null)
    setResult(null)
  }

  function proceedToNext() {
    const nextRoundSolved = roundSolvedCount + 1
    const newSolvedCount = solvedCount + 1
    setSolvedCount(newSolvedCount)
    if (nextRoundSolved >= roundTarget) {
      if (round === 1) {
        setRound(2)
        setRoundSolvedCount(0)
        goToNextQuestion(2)
      } else {
        if (mode === 'practice') {
          addPracticeRecord('bus-memory', newSolvedCount, newSolvedCount - mistakes.length).catch(console.error)
        }
        setFinished(true)
      }
    } else {
      setRoundSolvedCount(nextRoundSolved)
      goToNextQuestion(round)
    }
  }

  function handleAnswer(number: number | null) {
    if (answered || phase !== 'answer') return
    setAnswered(true)
    setSelected(number)

    const correct = number === problem.correctNumber
    if (!correct) {
      const mistake: BusMistake = { correctNumber: problem.correctNumber, selectedNumber: number }
      setBusMistakes((prev) => [...prev, mistake])
      addWrongAnswer('bus-memory', mode, mistake).catch(console.error)
    }

    if (mode === 'practice') {
      proceedToNext()
    } else {
      setResult(correct ? 'correct' : 'incorrect')
    }
  }

  if (finished) {
    return (
      <GameResultSummary
        mode={mode}
        summaryText={ko.common.mistakeSummary(solvedCount, mistakes.length)}
        onFinish={onFinish}
        showWrongAnswersLink
      >
        <MistakeList mistakes={mistakes} renderItem={(mistake, i) => <BusMistakeCard key={i} mistake={mistake} title={ko.common.nthMistake(i)} />} />
      </GameResultSummary>
    )
  }

  const duration = phase === 'turn' ? TURN_MS : ANSWER_MS
  const progressPct = (remainingMs / duration) * 100

  return (
    <PageContainer className="flex min-h-dvh flex-col justify-center gap-28 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between text-2xl text-muted-foreground">
          <span className="flex items-center gap-6">
            <GameExitButton />
            <span>
              {ko.common.roundProgress(
                mode === 'learn' ? ko.common.learnMode : ko.common.practiceMode,
                round,
                solvedCount + 1,
              )}
            </span>
          </span>
          <span className="font-mono text-4xl font-semibold text-foreground">
            {ko.common.secondsLeft((remainingMs / 1000).toFixed(1))}
          </span>
        </div>

        <div className="h-4 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${progressPct}%`, transition: 'width 100ms linear' }}
          />
        </div>
      </div>

      {phase === 'turn' ? (
        <div className="flex flex-col items-center gap-10 py-8">
          <p className="text-4xl text-muted-foreground">{ko.busMemory.watchNumbers(turnIndex + 1)}</p>
          <TurnCard turn={problem.turns[turnIndex]} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-12 py-4">
          <p className="text-5xl font-bold text-foreground">{ko.busMemory.question}</p>
          <p className="text-2xl text-muted-foreground">{ko.busMemory.hint}</p>
          <div className="grid grid-cols-5 gap-8">
            {problem.options.map((number) => {
              let status: 'idle' | 'correct' | 'wrong' = 'idle'
              if (mode === 'learn' && answered) {
                if (number === problem.correctNumber) status = 'correct'
                else if (number === selected) status = 'wrong'
              }
              return (
                <AnswerOption
                  key={number}
                  number={number}
                  disabled={answered}
                  onSelect={() => handleAnswer(number)}
                  status={status}
                />
              )
            })}
          </div>
        </div>
      )}

      {result && mode === 'learn' && (
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-10">
          {result === 'correct' ? (
            <span className="flex items-center gap-3 text-3xl font-semibold text-primary">
              <Check size={40} weight="bold" /> {ko.common.correct}
            </span>
          ) : (
            <span className="flex items-center gap-3 text-3xl font-semibold text-destructive">
              <X size={40} weight="bold" /> {ko.common.incorrect}
            </span>
          )}
          <Button onClick={proceedToNext} className="px-14 py-6 text-xl">
            {ko.common.nextProblem}
          </Button>
        </div>
      )}
    </PageContainer>
  )
}
