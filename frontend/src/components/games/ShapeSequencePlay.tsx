import { useEffect, useState } from 'react'
import { Check, Trash, X } from '@phosphor-icons/react'
import { PageContainer } from '@/components/ui/PageContainer'
import { cn } from '@/lib/utils'
import { GameExitButton, GameResultSummary, MistakeList } from '@/components/games/GameSessionUI'
import {
  generateNextShape,
  generateWarmupShapes,
  WARMUP_COUNT,
  type Answer,
  type Round,
  type ShapeName,
} from '@/lib/shapeSequenceProblems'
import { addPracticeRecord } from '@/lib/practiceRecords'
import { addWrongAnswer } from '@/lib/wrongAnswers'
import { roundPair, type Mode } from '@/lib/gameRounds'
import { ko } from '@/i18n'

export type SequenceMistake = {
  shape: ShapeName
  twoBack: ShapeName
  threeBack: ShapeName | null
  correctAnswer: Answer
  selectedAnswer: Answer | null
}

const SHAPE_MS = 3000
const PRACTICE_ROUND_COUNT = 15
const SHAPE_COLOR = 'var(--color-chart-teal)'

const ANSWER_LABEL: Record<Answer, string> = ko.shapeSequence.answerLabel

function ShapeIcon({ shape, size = 140 }: { shape: ShapeName; size?: number }) {
  if (shape === 'circle') {
    return <div style={{ width: size, height: size, borderRadius: '9999px', background: SHAPE_COLOR }} />
  }
  if (shape === 'square') {
    return <div style={{ width: size, height: size, borderRadius: size * 0.14, background: SHAPE_COLOR }} />
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon points="50,8 92,90 8,90" fill={SHAPE_COLOR} />
    </svg>
  )
}

function ShapeCard({ shape }: { shape: ShapeName | null }) {
  return (
    <div className="relative flex h-96 w-80 items-center justify-center">
      <div className="absolute inset-0 translate-x-4 translate-y-4 -rotate-3 rounded-3xl bg-card shadow" />
      <div className="absolute inset-0 translate-x-2 translate-y-2 -rotate-1 rounded-3xl bg-card shadow" />
      <div className="relative flex h-full w-full items-center justify-center rounded-3xl border border-border bg-card shadow-lg">
        {shape && <ShapeIcon shape={shape} size={160} />}
      </div>
    </div>
  )
}

function OptionRow({
  keyLabel,
  description,
  disabled,
  onSelect,
  status,
}: {
  keyLabel: string
  description: string
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
        'flex w-full cursor-pointer items-center gap-6 rounded-2xl border-2 px-8 py-6 text-left transition-colors',
        status === 'idle' && 'border-border hover:border-primary/50',
        status === 'correct' && 'border-primary bg-primary/10',
        status === 'wrong' && 'border-destructive bg-destructive/10',
        disabled && status === 'idle' && 'cursor-not-allowed hover:border-border',
      )}
    >
      <span className="flex h-14 min-w-24 items-center justify-center rounded-lg border border-border bg-background px-4 text-xl font-bold text-muted-foreground">
        {keyLabel}
      </span>
      <span className="text-2xl font-semibold text-foreground">{description}</span>
    </button>
  )
}

export function SequenceMistakeCard({
  mistake,
  title,
  meta,
  onDelete,
}: {
  mistake: SequenceMistake
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
      <div className={cn('grid gap-3 text-center', mistake.threeBack ? 'grid-cols-3' : 'grid-cols-2')}>
        {mistake.threeBack && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">{ko.shapeSequence.threeBack}</p>
            <ShapeIcon shape={mistake.threeBack} size={72} />
          </div>
        )}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">{ko.shapeSequence.twoBack}</p>
          <ShapeIcon shape={mistake.twoBack} size={72} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-primary">{ko.shapeSequence.shown}</p>
          <ShapeIcon shape={mistake.shape} size={72} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-sm font-semibold text-primary">{ko.common.answerLabel}</p>
          <p className="text-lg text-foreground">{ANSWER_LABEL[mistake.correctAnswer]}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-destructive">{ko.common.myAnswerLabel}</p>
          <p className="text-lg text-foreground">
            {mistake.selectedAnswer ? ANSWER_LABEL[mistake.selectedAnswer] : ko.common.timedOut}
          </p>
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

type ShapeSequencePlayProps = {
  mode: Mode
  round1Count?: number
  round2Count?: number
  onFinish?: () => void
}

export function ShapeSequencePlay({ mode, round1Count: round1CountProp, round2Count: round2CountProp, onFinish }: ShapeSequencePlayProps) {
  const [round1Count, round2Count] = roundPair(mode, PRACTICE_ROUND_COUNT, round1CountProp, round2CountProp)

  const [round, setRound] = useState<Round>(1)
  const [roundSolvedCount, setRoundSolvedCount] = useState(0)
  const [solvedCount, setSolvedCount] = useState(0)
  const [history, setHistory] = useState<ShapeName[]>(() => generateWarmupShapes())
  const [phase, setPhase] = useState<'warmup' | 'judge'>('warmup')
  const [warmupIndex, setWarmupIndex] = useState(0)
  const [currentShape, setCurrentShape] = useState<ShapeName | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<Answer | null>(null)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<Answer | null>(null)
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)
  const [shapeSeq, setShapeSeq] = useState(0)
  const [remainingMs, setRemainingMs] = useState(SHAPE_MS)
  const [mistakes, setSequenceMistakes] = useState<SequenceMistake[]>([])
  const [finished, setFinished] = useState(false)

  const roundTarget = round === 1 ? round1Count : round2Count
  const displayedShape = phase === 'warmup' ? history[warmupIndex] : currentShape

  function gradeAnswer(answer: Answer | null) {
    if (phase !== 'judge' || answered || correctAnswer === null || currentShape === null) return
    setAnswered(true)
    setSelected(answer)

    const correct = answer === correctAnswer
    if (!correct) {
      const twoBack = history[history.length - 2]
      const threeBack = history.length >= 3 ? history[history.length - 3] : null
      const mistake: SequenceMistake = { shape: currentShape, twoBack, threeBack, correctAnswer, selectedAnswer: answer }
      setSequenceMistakes((prev) => [...prev, mistake])
      addWrongAnswer('shape-sequence', mode, mistake).catch(console.error)
    }
    if (mode === 'learn') {
      setResult(correct ? 'correct' : 'incorrect')
    }
  }

  function showNextJudgeShape(currentRound: Round, currentHistory: ShapeName[]) {
    const { shape, correctAnswer: nextCorrect } = generateNextShape(currentHistory, currentRound)
    setHistory((prev) => [...prev, shape])
    setCurrentShape(shape)
    setCorrectAnswer(nextCorrect)
    setAnswered(false)
    setSelected(null)
    setResult(null)
    setShapeSeq((s) => s + 1)
  }

  function advanceAfterJudge() {
    const nextRoundSolved = roundSolvedCount + 1
    const newSolvedCount = solvedCount + 1
    setSolvedCount(newSolvedCount)
    if (nextRoundSolved >= roundTarget) {
      if (round === 1) {
        setRound(2)
        setRoundSolvedCount(0)
        showNextJudgeShape(2, history)
      } else {
        if (mode === 'practice') {
          addPracticeRecord('shape-sequence', newSolvedCount, newSolvedCount - mistakes.length).catch(console.error)
        }
        setFinished(true)
      }
    } else {
      setRoundSolvedCount(nextRoundSolved)
      showNextJudgeShape(round, history)
    }
  }

  function handleTick() {
    if (phase === 'warmup') {
      if (warmupIndex < WARMUP_COUNT - 1) {
        setWarmupIndex((i) => i + 1)
        setShapeSeq((s) => s + 1)
      } else {
        setPhase('judge')
        showNextJudgeShape(round, history)
      }
      return
    }
    if (!answered) {
      gradeAnswer(null)
    }
    advanceAfterJudge()
  }

  // 도형 하나가 표시되는 3초 타이머 — 응답 여부와 무관하게 항상 정해진 박자로 다음 도형으로 넘어간다.
  useEffect(() => {
    if (finished) return
    const id = setTimeout(handleTick, SHAPE_MS)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeSeq, finished])

  // 남은 시간 표시용 카운트다운 (판정 로직과 분리된 화면 표시 전용)
  useEffect(() => {
    if (finished) return
    setRemainingMs(SHAPE_MS)
    const id = setInterval(() => {
      setRemainingMs((prev) => Math.max(0, prev - 100))
    }, 100)
    return () => clearInterval(id)
  }, [shapeSeq, finished])

  // 키보드 입력: Space(다름) / ←(2번째 전과 같음) / →(3번째 전과 같음, 2라운드만)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (phase !== 'judge' || answered || finished) return
      if (e.code === 'Space') {
        e.preventDefault()
        gradeAnswer('space')
      } else if (e.code === 'ArrowLeft') {
        gradeAnswer('left')
      } else if (e.code === 'ArrowRight' && round === 2) {
        gradeAnswer('right')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, answered, finished, round, correctAnswer, currentShape])

  if (finished) {
    return (
      <GameResultSummary
        mode={mode}
        summaryText={ko.common.mistakeSummary(solvedCount, mistakes.length)}
        onFinish={onFinish}
        showWrongAnswersLink
      >
        <MistakeList mistakes={mistakes} renderItem={(mistake, i) => <SequenceMistakeCard key={i} mistake={mistake} title={ko.common.nthMistake(i)} />} />
      </GameResultSummary>
    )
  }

  const progressPct = (remainingMs / SHAPE_MS) * 100

  return (
    <PageContainer className="flex min-h-dvh flex-col justify-center gap-28 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between text-2xl text-muted-foreground">
          <span className="flex items-center gap-6">
            <GameExitButton />
            <span>
              {mode === 'learn' ? ko.common.learnMode : ko.common.practiceMode} · {ko.common.roundLabel(round)}
              {phase === 'judge' && ` · ${ko.shapeSequence.problemLabel(solvedCount + 1)}`}
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

      <p className="text-center text-3xl text-muted-foreground">
        {phase === 'warmup'
          ? ko.shapeSequence.warmupInstructions
          : round === 1
            ? ko.shapeSequence.judgeInstructionsRound1
            : ko.shapeSequence.judgeInstructionsRound2}
      </p>

      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="flex items-center justify-center">
          <ShapeCard shape={displayedShape} />
        </div>
        <div className="flex flex-col gap-6">
          <OptionRow
            keyLabel="SPACE BAR"
            description={ko.shapeSequence.answerLabel.space}
            disabled={phase !== 'judge' || answered}
            onSelect={() => gradeAnswer('space')}
            status={
              mode === 'learn' && answered
                ? correctAnswer === 'space'
                  ? 'correct'
                  : selected === 'space'
                    ? 'wrong'
                    : 'idle'
                : 'idle'
            }
          />
          <OptionRow
            keyLabel="←"
            description={ko.shapeSequence.answerLabel.left}
            disabled={phase !== 'judge' || answered}
            onSelect={() => gradeAnswer('left')}
            status={
              mode === 'learn' && answered
                ? correctAnswer === 'left'
                  ? 'correct'
                  : selected === 'left'
                    ? 'wrong'
                    : 'idle'
                : 'idle'
            }
          />
          {round === 2 && (
            <OptionRow
              keyLabel="→"
              description={ko.shapeSequence.answerLabel.right}
              disabled={phase !== 'judge' || answered}
              onSelect={() => gradeAnswer('right')}
              status={
                mode === 'learn' && answered
                  ? correctAnswer === 'right'
                    ? 'correct'
                    : selected === 'right'
                      ? 'wrong'
                      : 'idle'
                  : 'idle'
              }
            />
          )}
        </div>
      </div>

      {result && mode === 'learn' && (
        <div className="flex items-center justify-center gap-3">
          {result === 'correct' ? (
            <span className="flex items-center gap-2 text-2xl font-semibold text-primary">
              <Check size={32} weight="bold" /> {ko.common.correct}
            </span>
          ) : (
            <span className="flex items-center gap-2 text-2xl font-semibold text-destructive">
              <X size={32} weight="bold" /> {ko.common.incorrect}
            </span>
          )}
        </div>
      )}
    </PageContainer>
  )
}
