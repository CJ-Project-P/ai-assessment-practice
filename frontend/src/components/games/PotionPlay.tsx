import { useEffect, useState } from 'react'
import { Clover, Flask, Leaf, Plant } from '@phosphor-icons/react'
import { PageContainer } from '@/components/ui/PageContainer'
import { cn } from '@/lib/utils'
import { GameExitButton, GameResultSummary } from '@/components/games/GameSessionUI'
import {
  brewPotion,
  generatePotionProblem,
  generateRuleTable,
  mutateRuleTable,
  type Ingredient,
  type PotionColor,
  type PotionProblem,
  type PotionRuleTable,
} from '@/lib/potionProblems'
import { addPracticeRecord } from '@/lib/practiceRecords'
import { singleRoundValue, type Mode } from '@/lib/gameRounds'
import { ko } from '@/i18n'

const CHOOSE_MS = 3000
const REVEAL_MS = 1000
const PRACTICE_TOTAL = 100
const MUTATION_INTERVAL = 20

const INGREDIENT_ICON: Record<Ingredient, typeof Leaf> = {
  fern: Leaf,
  clover: Clover,
  grass: Plant,
}

const COLOR_LABEL: Record<PotionColor, string> = {
  blue: ko.potion.blue,
  red: ko.potion.red,
}

function IngredientSlot({ ingredient }: { ingredient: Ingredient | null }) {
  const Icon = ingredient ? INGREDIENT_ICON[ingredient] : null
  return (
    <div
      className={cn(
        'flex aspect-video items-center justify-center rounded-2xl border border-border',
        ingredient ? 'bg-primary/10' : 'bg-border/60',
      )}
    >
      {Icon && <Icon size={72} weight="fill" className="text-primary" />}
    </div>
  )
}

function IngredientGrid({ slots }: { slots: (Ingredient | null)[] }) {
  return (
    <div className="grid w-full max-w-xl grid-cols-2 gap-6">
      {slots.map((ingredient, i) => (
        <IngredientSlot key={i} ingredient={ingredient} />
      ))}
    </div>
  )
}

function PredictButton({
  color,
  disabled,
  selected,
  onSelect,
}: {
  color: PotionColor
  disabled: boolean
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        'cursor-pointer rounded-full border-2 px-12 py-5 text-2xl font-bold transition-colors',
        color === 'blue' ? 'border-blue-400 text-blue-500' : 'border-red-400 text-red-500',
        selected && color === 'blue' && 'bg-blue-400/15',
        selected && color === 'red' && 'bg-red-400/15',
        disabled && !selected && 'opacity-40',
        disabled && 'cursor-not-allowed',
      )}
    >
      {COLOR_LABEL[color]}
    </button>
  )
}

type PotionPlayProps = {
  mode: Mode
  totalCount?: number
  onFinish?: () => void
}

export function PotionPlay({ mode, totalCount, onFinish }: PotionPlayProps) {
  const target = singleRoundValue(mode, PRACTICE_TOTAL, totalCount)

  const [ruleTable, setRuleTable] = useState<PotionRuleTable>(() => generateRuleTable())
  const [solvedCount, setSolvedCount] = useState(0)
  const [problem, setProblem] = useState<PotionProblem>(() => generatePotionProblem())
  const [phase, setPhase] = useState<'choose' | 'reveal'>('choose')
  const [prediction, setPrediction] = useState<PotionColor | null>(null)
  const [actual, setActual] = useState<PotionColor | null>(null)
  const [remainingMs, setRemainingMs] = useState(CHOOSE_MS)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  function gradeChoice(color: PotionColor | null) {
    if (phase !== 'choose') return
    const brewed = brewPotion(problem.combo, ruleTable)
    setPrediction(color)
    setActual(brewed)
    if (color === brewed) {
      setCorrectCount((prev) => prev + 1)
    }
    setPhase('reveal')
  }

  function proceedToNext() {
    const nextSolved = solvedCount + 1
    setSolvedCount(nextSolved)
    if (nextSolved % MUTATION_INTERVAL === 0) {
      setRuleTable((prev) => mutateRuleTable(prev))
    }
    if (nextSolved >= target) {
      if (mode === 'practice') {
        addPracticeRecord('potion', nextSolved, correctCount)
      }
      setFinished(true)
      return
    }
    setProblem(generatePotionProblem())
    setPrediction(null)
    setActual(null)
    setPhase('choose')
  }

  // 선택 제한 3초 — 시간 안에 못 고르면 응답 없음으로 처리
  useEffect(() => {
    if (finished || phase !== 'choose') return
    const id = setTimeout(() => gradeChoice(null), CHOOSE_MS)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, problem, finished])

  // 결과 노출 1초 후 자동으로 다음 문제로
  useEffect(() => {
    if (finished || phase !== 'reveal') return
    const id = setTimeout(proceedToNext, REVEAL_MS)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, problem, finished])

  // 남은 시간 표시용 카운트다운 (판정 로직과 분리된 화면 표시 전용)
  useEffect(() => {
    if (finished) return
    const duration = phase === 'choose' ? CHOOSE_MS : REVEAL_MS
    setRemainingMs(duration)
    const id = setInterval(() => {
      setRemainingMs((prev) => Math.max(0, prev - 100))
    }, 100)
    return () => clearInterval(id)
  }, [phase, problem, finished])

  if (finished) {
    return (
      <GameResultSummary
        mode={mode}
        summaryText={ko.potion.problemSummary(solvedCount, correctCount)}
        onFinish={onFinish}
      />
    )
  }

  const duration = phase === 'choose' ? CHOOSE_MS : REVEAL_MS
  const progressPct = (remainingMs / duration) * 100
  const success = phase === 'reveal' && prediction === actual

  return (
    <PageContainer className="flex min-h-dvh flex-col justify-center gap-16 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between text-2xl text-muted-foreground">
          <span className="flex items-center gap-6">
            <GameExitButton />
            <span>
              {mode === 'learn' ? ko.common.learnMode : ko.common.practiceMode} · {ko.potion.problemLabel(solvedCount + 1)}
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

      <p className="text-center text-3xl text-muted-foreground">{ko.potion.instructions}</p>

      <div className="flex flex-col items-center gap-12">
        {phase === 'choose' ? (
          <IngredientGrid slots={problem.slots} />
        ) : (
          <div
            className={cn(
              'flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border p-10',
              actual === 'blue' ? 'border-blue-300 bg-blue-50' : 'border-red-300 bg-red-50',
            )}
          >
            <Flask size={96} weight="fill" className={actual === 'blue' ? 'text-blue-500' : 'text-red-500'} />
            <p className={cn('text-2xl font-bold', success ? 'text-primary' : 'text-yellow-600')}>
              {success ? ko.potion.predictSuccess : ko.potion.predictFail}
            </p>
            <p className="text-lg text-foreground">{ko.potion.brewed(COLOR_LABEL[actual as PotionColor])}</p>
          </div>
        )}

        <div className="flex items-center gap-8">
          <PredictButton
            color="blue"
            disabled={phase !== 'choose'}
            selected={prediction === 'blue'}
            onSelect={() => gradeChoice('blue')}
          />
          <PredictButton
            color="red"
            disabled={phase !== 'choose'}
            selected={prediction === 'red'}
            onSelect={() => gradeChoice('red')}
          />
        </div>
      </div>
    </PageContainer>
  )
}
