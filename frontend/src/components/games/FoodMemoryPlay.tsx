import { useEffect, useState } from 'react'
import { Check, Trash, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { PageContainer } from '@/components/ui/PageContainer'
import { cn } from '@/lib/utils'
import { GameExitButton, GameResultSummary, MistakeList } from '@/components/games/GameSessionUI'
import {
  generateFoodProblem,
  getFoodItemById,
  type FoodItem,
  type FoodMemoryProblem,
  type FoodTurn,
  type Round,
} from '@/lib/foodMemoryProblems'
import { addPracticeRecord } from '@/lib/practiceRecords'
import { addWrongAnswer } from '@/lib/wrongAnswers'
import { roundPair, type Mode } from '@/lib/gameRounds'
import { ko } from '@/i18n'

/** DB에는 음식 id만 저장한다 (턴 노출 데이터는 오답 카드에서 안 쓰여서 저장 안 함, 이미지 경로는 getFoodItemById로 다시 찾음). */
export type FoodMistake = {
  correctItemId: string
  selectedItemId: string | null
}

const TURN_MS = 1000
const ANSWER_MS = 3000
const PRACTICE_ROUND_COUNT = 10

/** 실제 텍스처 이미지 자산이 없어 나무 테이블 느낌을 CSS 그라디언트로만 표현한다. */
const WOOD_TABLE_BACKGROUND = {
  backgroundImage: [
    'repeating-linear-gradient(180deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 72px)',
    'repeating-linear-gradient(90deg, rgba(0,0,0,0.035) 0px, rgba(0,0,0,0.035) 1px, transparent 1px, transparent 4px)',
    'linear-gradient(180deg, var(--color-wood-100) 0%, var(--color-wood-300) 55%, var(--color-wood-500) 100%)',
  ].join(', '),
}

function TurnCard({ turn }: { turn: FoodTurn }) {
  return (
    <div className="flex flex-col items-center gap-12">
      <p className="text-7xl font-bold text-foreground">{turn.name}</p>
      <div
        className="flex flex-wrap items-center justify-center gap-16 rounded-2xl border border-border p-20"
        style={WOOD_TABLE_BACKGROUND}
      >
        {turn.items.map((item) => (
          <img key={item.id} src={item.src} alt={item.name} className="w-[30rem] h-auto object-contain" />
        ))}
      </div>
    </div>
  )
}

function AnswerOption({
  item,
  disabled,
  onSelect,
  status,
}: {
  item: FoodItem
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
        'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 p-10 transition-colors',
        status === 'idle' && 'border-border hover:border-primary/50',
        status === 'correct' && 'border-primary bg-primary/10',
        status === 'wrong' && 'border-destructive bg-destructive/10',
        disabled && status === 'idle' && 'cursor-not-allowed hover:border-border',
      )}
    >
      <img src={item.src} alt={item.name} className="w-96 h-auto object-contain" />
    </button>
  )
}

export function FoodMistakeCard({
  mistake,
  title,
  meta,
  onDelete,
}: {
  mistake: FoodMistake
  title: string
  meta?: string
  onDelete?: () => void
}) {
  const correctItem = getFoodItemById(mistake.correctItemId)
  const selectedItem = mistake.selectedItemId ? getFoodItemById(mistake.selectedItemId) : null

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-muted-foreground">{title}</p>
        {meta && <p className="text-sm text-muted-foreground">{meta}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-primary">{ko.common.answerLabel}</p>
          {correctItem && (
            <img src={correctItem.src} alt={correctItem.name} className="w-56 h-auto object-contain" />
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-destructive">{ko.common.myAnswerLabel}</p>
          {selectedItem ? (
            <img src={selectedItem.src} alt={selectedItem.name} className="w-56 h-auto object-contain" />
          ) : (
            <p className="mt-8 text-sm text-muted-foreground">{ko.common.timedOut}</p>
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

type FoodMemoryPlayProps = {
  mode: Mode
  round1Count?: number
  round2Count?: number
  onFinish?: () => void
}

export function FoodMemoryPlay({ mode, round1Count: round1CountProp, round2Count: round2CountProp, onFinish }: FoodMemoryPlayProps) {
  const [round1Count, round2Count] = roundPair(mode, PRACTICE_ROUND_COUNT, round1CountProp, round2CountProp)

  const [round, setRound] = useState<Round>(1)
  const [roundSolvedCount, setRoundSolvedCount] = useState(0)
  const [solvedCount, setSolvedCount] = useState(0)
  const [problem, setProblem] = useState<FoodMemoryProblem>(() => generateFoodProblem(1))
  const [phase, setPhase] = useState<'turn' | 'answer'>('turn')
  const [turnIndex, setTurnIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<FoodItem | null>(null)
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)
  const [remainingMs, setRemainingMs] = useState(TURN_MS)
  const [mistakes, setMistakes] = useState<FoodMistake[]>([])
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
    setProblem(generateFoodProblem(currentRound))
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
          addPracticeRecord('food-memory', newSolvedCount, newSolvedCount - mistakes.length).catch(console.error)
        }
        setFinished(true)
      }
    } else {
      setRoundSolvedCount(nextRoundSolved)
      goToNextQuestion(round)
    }
  }

  function handleAnswer(item: FoodItem | null) {
    if (answered || phase !== 'answer') return
    setAnswered(true)
    setSelected(item)

    const correct = item?.id === problem.correctItem.id
    if (!correct) {
      const mistake: FoodMistake = { correctItemId: problem.correctItem.id, selectedItemId: item?.id ?? null }
      setMistakes((prev) => [...prev, mistake])
      addWrongAnswer('food-memory', mode, mistake).catch(console.error)
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
        <MistakeList mistakes={mistakes} renderItem={(mistake, i) => <FoodMistakeCard key={i} mistake={mistake} title={ko.common.nthMistake(i)} />} />
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
          <p className="text-4xl text-muted-foreground">{ko.foodMemory.watchItems(turnIndex + 1)}</p>
          <TurnCard turn={problem.turns[turnIndex]} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-12 py-4">
          <p className="text-5xl font-bold text-foreground">{ko.foodMemory.question}</p>
          <p className="text-2xl text-muted-foreground">{ko.foodMemory.hint}</p>
          <div className="grid grid-cols-3 gap-12">
            {problem.options.map((item) => {
              let status: 'idle' | 'correct' | 'wrong' = 'idle'
              if (mode === 'learn' && answered) {
                if (item.id === problem.correctItem.id) status = 'correct'
                else if (item.id === selected?.id) status = 'wrong'
              }
              return (
                <AnswerOption
                  key={item.id}
                  item={item}
                  disabled={answered}
                  onSelect={() => handleAnswer(item)}
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
