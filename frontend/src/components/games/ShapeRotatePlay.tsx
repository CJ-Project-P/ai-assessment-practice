import { useEffect, useState } from 'react'
import { ArrowRight, Check, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { PageContainer } from '@/components/ui/PageContainer'
import { ShapeGrid } from '@/components/games/ShapeGrid'
import { LetterShape } from '@/components/games/LetterShape'
import { RotateControls } from '@/components/games/RotateControls'
import { ShapeMistakeCard } from '@/components/games/ShapeMistakeCard'
import { GameExitButton, GameResultSummary, MistakeList } from '@/components/games/GameSessionUI'
import { generateProblem, type Round, type ShapeRotateProblem } from '@/lib/shapeRotateProblems'
import { applySequence, IDENTITY, matricesEqual, type Operation } from '@/lib/shapeTransform'
import { saveShape } from '@/lib/savedShapes'
import { addWrongAnswer } from '@/lib/wrongAnswers'
import { addPracticeRecord } from '@/lib/practiceRecords'
import { roundPair, type Mode } from '@/lib/gameRounds'
import { ko } from '@/i18n'

type Mistake = {
  kind: ShapeRotateProblem['kind']
  cells: number[]
  letter: string
  answerOps: Operation[]
  userOps: Operation[]
}

const CLICK_BUDGET = 20
const PRACTICE_ROUND_SEC = 180

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function ProblemShape({
  problem,
  transform,
  size,
}: {
  problem: ShapeRotateProblem
  transform: ReturnType<typeof applySequence>
  size: number
}) {
  if (problem.kind === 'letter') {
    return <LetterShape letter={problem.letter} transform={transform} size={size} />
  }
  return <ShapeGrid cells={problem.cells} transform={transform} size={size} />
}

function SessionMistakeCard({ mistake, index }: { mistake: Mistake; index: number }) {
  const [saved, setSaved] = useState(false)

  function handleSave() {
    saveShape({ kind: mistake.kind, cells: mistake.cells, letter: mistake.letter }, mistake.answerOps)
    setSaved(true)
  }

  return (
    <ShapeMistakeCard
      title={ko.common.nthMistake(index)}
      kind={mistake.kind}
      cells={mistake.cells}
      letter={mistake.letter}
      answerOps={mistake.answerOps}
      userOps={mistake.userOps}
      onSave={handleSave}
      saved={saved}
    />
  )
}

type ShapeRotatePlayProps = {
  mode: Mode
  round1Sec?: number
  round2Sec?: number
  onFinish?: () => void
}

export function ShapeRotatePlay({ mode, round1Sec: round1SecProp, round2Sec: round2SecProp, onFinish }: ShapeRotatePlayProps) {
  const [round1Sec, round2Sec] = roundPair(mode, PRACTICE_ROUND_SEC, round1SecProp, round2SecProp)

  const [round, setRound] = useState<Round>(1)
  const [roundTimeLeft, setRoundTimeLeft] = useState(round1Sec)
  const [problem, setProblem] = useState(() => generateProblem(1))
  const [history, setHistory] = useState<Operation[]>([])
  const [usedClicks, setUsedClicks] = useState(0)
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)
  const [solvedCount, setSolvedCount] = useState(0)
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (finished) return
    if (roundTimeLeft <= 0) {
      if (round === 1) {
        setRound(2)
        setRoundTimeLeft(round2Sec)
        setProblem(generateProblem(2))
        setHistory([])
        setUsedClicks(0)
        setResult(null)
      } else {
        if (mode === 'practice') {
          addPracticeRecord('shape-rotate', solvedCount, solvedCount - mistakes.length).catch(console.error)
        }
        setFinished(true)
      }
      return
    }
    const id = setInterval(() => {
      setRoundTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundTimeLeft, round, round2Sec, finished])

  const remainingClicks = CLICK_BUDGET - usedClicks

  function handleOp(op: Operation) {
    if (result) return
    if (history.length >= 8 || remainingClicks <= 0) return
    setHistory((prev) => [...prev, op])
    setUsedClicks((prev) => prev + 1)
  }

  function handleUndo() {
    if (result) return
    setHistory((prev) => prev.slice(0, -1))
    setUsedClicks((prev) => Math.max(0, prev - 1))
  }

  function handleReset() {
    if (result) return
    setUsedClicks((prev) => Math.max(0, prev - history.length))
    setHistory([])
  }

  function goToNextProblem(currentRound: Round) {
    setProblem(generateProblem(currentRound))
    setHistory([])
    setUsedClicks(0)
    setResult(null)
    setSolvedCount((prev) => prev + 1)
  }

  function handleSubmit() {
    const correct = matricesEqual(applySequence(history), problem.targetTransform)
    if (!correct) {
      const mistake: Mistake = {
        kind: problem.kind,
        cells: Array.from(problem.cells),
        letter: problem.letter,
        answerOps: problem.answerOps,
        userOps: history,
      }
      setMistakes((prev) => [...prev, mistake])
      addWrongAnswer('shape-rotate', mode, mistake).catch(console.error)
    }

    if (mode === 'practice') {
      // 실전 분량 모드는 정오답을 보여주지 않고 제출 즉시 다음 문제로 넘어간다.
      goToNextProblem(round)
    } else {
      setResult(correct ? 'correct' : 'incorrect')
    }
  }

  function handleNext() {
    goToNextProblem(round)
  }

  const budgetExhausted = remainingClicks <= 0 && !result

  if (finished) {
    return (
      <GameResultSummary
        mode={mode}
        summaryText={ko.common.mistakeSummary(solvedCount, mistakes.length)}
        onFinish={onFinish}
        showWrongAnswersLink
      >
        <MistakeList mistakes={mistakes} renderItem={(mistake, i) => <SessionMistakeCard key={i} mistake={mistake} index={i} />} />
      </GameResultSummary>
    )
  }

  return (
    <PageContainer className="flex min-h-dvh flex-col justify-center gap-10 py-12">
      <div className="flex items-center justify-between text-2xl text-muted-foreground">
        <span className="flex items-center gap-5">
          <GameExitButton size={22} className="text-lg" />
          <span>
            {ko.common.roundProgress(
              mode === 'learn' ? ko.common.learnMode : ko.common.practiceMode,
              round,
              solvedCount + 1,
            )}
          </span>
        </span>
        <span className="font-mono text-4xl font-semibold text-foreground">{formatTime(roundTimeLeft)}</span>
      </div>
      <p className="text-center text-2xl text-muted-foreground">{ko.shapeRotate.instructions}</p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-10">
          <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-6">
            <div className="flex flex-col items-center gap-5">
              <ProblemShape problem={problem} transform={IDENTITY} size={760} />
              <p className="text-3xl font-semibold text-muted-foreground">{ko.shapeMistakeCard.before}</p>
            </div>
            <ArrowRight size={72} weight="bold" className="text-primary" />
            <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/5 p-5">
              <ProblemShape problem={problem} transform={problem.targetTransform} size={760} />
              <p className="text-3xl font-semibold text-muted-foreground">{ko.shapeRotate.after}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-12">
          <RotateControls
            history={history}
            maxClicks={CLICK_BUDGET}
            onOp={handleOp}
            onUndo={handleUndo}
            onReset={handleReset}
          />
        </div>
      </div>

      {result === null && (
        <Button
          onClick={handleSubmit}
          disabled={history.length === 0 || budgetExhausted}
          className="mx-auto px-16 py-7 text-2xl"
        >
          {ko.shapeRotate.submit}
        </Button>
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
          <Button onClick={handleNext} className="px-14 py-6 text-xl">
            {ko.common.nextProblem}
          </Button>
        </div>
      )}

      {budgetExhausted && (
        <p className="text-center text-xl text-destructive">{ko.shapeRotate.budgetExhausted}</p>
      )}
    </PageContainer>
  )
}
