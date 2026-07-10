import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShapeRotatePlay } from '@/components/games/ShapeRotatePlay'
import { FoodMemoryPlay } from '@/components/games/FoodMemoryPlay'
import { BusMemoryPlay } from '@/components/games/BusMemoryPlay'
import { ShapeSequencePlay } from '@/components/games/ShapeSequencePlay'
import { PotionPlay } from '@/components/games/PotionPlay'
import { Button } from '@/components/ui/Button'
import { getGame } from '@/lib/games'
import { ko } from '@/i18n'

type RoundTime = { minutes: number; seconds: number }

function RoundTimeInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: RoundTime
  onChange: (next: RoundTime) => void
}) {
  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-3xl font-semibold text-foreground">{label}</p>
      <div className="flex items-center gap-8">
        <label className="flex flex-col items-center gap-3">
          <input
            type="number"
            min={0}
            max={59}
            value={value.minutes}
            onChange={(e) =>
              onChange({ ...value, minutes: Math.max(0, Math.min(59, Number(e.target.value))) })
            }
            className="w-44 rounded-xl border border-border bg-card px-3 py-6 text-center text-5xl font-semibold text-foreground focus:border-primary focus:outline-none"
          />
          <span className="text-xl text-muted-foreground">{ko.learnMode.minutes}</span>
        </label>
        <span className="text-5xl font-bold text-foreground">:</span>
        <label className="flex flex-col items-center gap-3">
          <input
            type="number"
            min={0}
            max={59}
            value={value.seconds}
            onChange={(e) =>
              onChange({ ...value, seconds: Math.max(0, Math.min(59, Number(e.target.value))) })
            }
            className="w-44 rounded-xl border border-border bg-card px-3 py-6 text-center text-5xl font-semibold text-foreground focus:border-primary focus:outline-none"
          />
          <span className="text-xl text-muted-foreground">{ko.learnMode.seconds}</span>
        </label>
      </div>
    </div>
  )
}

function TimeSetup({ onStart }: { onStart: (round1Sec: number, round2Sec: number) => void }) {
  const [round1, setRound1] = useState<RoundTime>({ minutes: 3, seconds: 0 })
  const [round2, setRound2] = useState<RoundTime>({ minutes: 3, seconds: 0 })

  const round1Sec = round1.minutes * 60 + round1.seconds
  const round2Sec = round2.minutes * 60 + round2.seconds

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 px-6 text-center">
      <h1 className="whitespace-nowrap text-6xl font-bold text-foreground">{ko.learnMode.shapeRotate.title}</h1>
      <p className="text-2xl text-muted-foreground">{ko.learnMode.shapeRotate.description}</p>
      <div className="flex flex-col gap-12 sm:flex-row sm:gap-20">
        <RoundTimeInput label={ko.learnMode.shapeRotate.round1Label} value={round1} onChange={setRound1} />
        <RoundTimeInput label={ko.learnMode.shapeRotate.round2Label} value={round2} onChange={setRound2} />
      </div>
      <Button
        onClick={() => onStart(round1Sec, round2Sec)}
        disabled={round1Sec === 0 || round2Sec === 0}
        className="px-16 py-7 text-2xl"
      >
        {ko.learnMode.shapeRotate.start}
      </Button>
    </div>
  )
}

type RoundCount = number

function CountInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: RoundCount
  onChange: (next: RoundCount) => void
}) {
  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-3xl font-semibold text-foreground">{label}</p>
      <input
        type="number"
        min={1}
        max={50}
        value={value}
        onChange={(e) => onChange(Math.max(1, Math.min(50, Number(e.target.value))))}
        className="w-44 rounded-xl border border-border bg-card px-3 py-6 text-center text-5xl font-semibold text-foreground focus:border-primary focus:outline-none"
      />
      <span className="text-xl text-muted-foreground">{ko.learnMode.problems}</span>
    </div>
  )
}

function FoodCountSetup({ onStart }: { onStart: (round1Count: number, round2Count: number) => void }) {
  const [round1Count, setRound1Count] = useState(5)
  const [round2Count, setRound2Count] = useState(5)

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 px-6 text-center">
      <h1 className="whitespace-nowrap text-6xl font-bold text-foreground">{ko.learnMode.foodMemory.title}</h1>
      <p className="text-2xl text-muted-foreground">{ko.learnMode.foodMemory.description}</p>
      <div className="flex flex-col gap-12 sm:flex-row sm:gap-20">
        <CountInput label={ko.learnMode.foodMemory.round1Label} value={round1Count} onChange={setRound1Count} />
        <CountInput label={ko.learnMode.foodMemory.round2Label} value={round2Count} onChange={setRound2Count} />
      </div>
      <Button onClick={() => onStart(round1Count, round2Count)} className="px-16 py-7 text-2xl">
        {ko.learnMode.foodMemory.start}
      </Button>
    </div>
  )
}

function BusCountSetup({ onStart }: { onStart: (round1Count: number, round2Count: number) => void }) {
  const [round1Count, setRound1Count] = useState(5)
  const [round2Count, setRound2Count] = useState(5)

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 px-6 text-center">
      <h1 className="whitespace-nowrap text-6xl font-bold text-foreground">{ko.learnMode.busMemory.title}</h1>
      <p className="text-2xl text-muted-foreground">{ko.learnMode.busMemory.description}</p>
      <div className="flex flex-col gap-12 sm:flex-row sm:gap-20">
        <CountInput label={ko.learnMode.busMemory.round1Label} value={round1Count} onChange={setRound1Count} />
        <CountInput label={ko.learnMode.busMemory.round2Label} value={round2Count} onChange={setRound2Count} />
      </div>
      <Button onClick={() => onStart(round1Count, round2Count)} className="px-16 py-7 text-2xl">
        {ko.learnMode.busMemory.start}
      </Button>
    </div>
  )
}

function ShapeSequenceCountSetup({ onStart }: { onStart: (round1Count: number, round2Count: number) => void }) {
  const [round1Count, setRound1Count] = useState(5)
  const [round2Count, setRound2Count] = useState(5)

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 px-6 text-center">
      <h1 className="whitespace-nowrap text-6xl font-bold text-foreground">{ko.learnMode.shapeSequence.title}</h1>
      <p className="text-2xl text-muted-foreground">{ko.learnMode.shapeSequence.description}</p>
      <div className="flex flex-col gap-12 sm:flex-row sm:gap-20">
        <CountInput label={ko.learnMode.shapeSequence.round1Label} value={round1Count} onChange={setRound1Count} />
        <CountInput label={ko.learnMode.shapeSequence.round2Label} value={round2Count} onChange={setRound2Count} />
      </div>
      <Button onClick={() => onStart(round1Count, round2Count)} className="px-16 py-7 text-2xl">
        {ko.learnMode.shapeSequence.start}
      </Button>
    </div>
  )
}

function PotionCountSetup({ onStart }: { onStart: (totalCount: number) => void }) {
  const [totalCount, setTotalCount] = useState(20)

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-12 px-6 text-center">
      <h1 className="whitespace-nowrap text-6xl font-bold text-foreground">{ko.learnMode.potion.title}</h1>
      <p className="text-2xl text-muted-foreground">{ko.learnMode.potion.description}</p>
      <CountInput label={ko.learnMode.potion.totalLabel} value={totalCount} onChange={setTotalCount} />
      <Button onClick={() => onStart(totalCount)} className="px-16 py-7 text-2xl">
        {ko.learnMode.potion.start}
      </Button>
    </div>
  )
}

export default function LearnMode() {
  const { gameId } = useParams()
  const game = getGame(gameId)
  const [roundTimes, setRoundTimes] = useState<{ round1Sec: number; round2Sec: number } | null>(null)
  const [roundCounts, setRoundCounts] = useState<{ round1Count: number; round2Count: number } | null>(null)
  const [busRoundCounts, setBusRoundCounts] = useState<{ round1Count: number; round2Count: number } | null>(null)
  const [sequenceRoundCounts, setSequenceRoundCounts] = useState<{ round1Count: number; round2Count: number } | null>(
    null,
  )
  const [potionTotalCount, setPotionTotalCount] = useState<number | null>(null)

  if (!game) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-muted-foreground">{ko.common.gameNotFound}</p>
      </div>
    )
  }

  if (game.id === 'shape-rotate') {
    if (roundTimes === null) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 py-12">
          <TimeSetup onStart={(round1Sec, round2Sec) => setRoundTimes({ round1Sec, round2Sec })} />
          {game.hasSimulator && (
            <Link to={`/games/${game.id}/simulator`} className="text-base text-primary hover:underline">
              {ko.learnMode.shapeRotate.simulatorLink}
            </Link>
          )}
        </div>
      )
    }
    return (
      <div className="min-h-dvh bg-background">
        <ShapeRotatePlay
          mode="learn"
          round1Sec={roundTimes.round1Sec}
          round2Sec={roundTimes.round2Sec}
          onFinish={() => setRoundTimes(null)}
        />
      </div>
    )
  }

  if (game.id === 'food-memory') {
    if (roundCounts === null) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 py-12">
          <FoodCountSetup
            onStart={(round1Count, round2Count) => setRoundCounts({ round1Count, round2Count })}
          />
        </div>
      )
    }
    return (
      <div className="min-h-dvh bg-background">
        <FoodMemoryPlay
          mode="learn"
          round1Count={roundCounts.round1Count}
          round2Count={roundCounts.round2Count}
          onFinish={() => setRoundCounts(null)}
        />
      </div>
    )
  }

  if (game.id === 'bus-memory') {
    if (busRoundCounts === null) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 py-12">
          <BusCountSetup
            onStart={(round1Count, round2Count) => setBusRoundCounts({ round1Count, round2Count })}
          />
        </div>
      )
    }
    return (
      <div className="min-h-dvh bg-background">
        <BusMemoryPlay
          mode="learn"
          round1Count={busRoundCounts.round1Count}
          round2Count={busRoundCounts.round2Count}
          onFinish={() => setBusRoundCounts(null)}
        />
      </div>
    )
  }

  if (game.id === 'shape-sequence') {
    if (sequenceRoundCounts === null) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 py-12">
          <ShapeSequenceCountSetup
            onStart={(round1Count, round2Count) => setSequenceRoundCounts({ round1Count, round2Count })}
          />
        </div>
      )
    }
    return (
      <div className="min-h-dvh bg-background">
        <ShapeSequencePlay
          mode="learn"
          round1Count={sequenceRoundCounts.round1Count}
          round2Count={sequenceRoundCounts.round2Count}
          onFinish={() => setSequenceRoundCounts(null)}
        />
      </div>
    )
  }

  if (game.id === 'potion') {
    if (potionTotalCount === null) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 py-12">
          <PotionCountSetup onStart={setPotionTotalCount} />
        </div>
      )
    }
    return (
      <div className="min-h-dvh bg-background">
        <PotionPlay mode="learn" totalCount={potionTotalCount} onFinish={() => setPotionTotalCount(null)} />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-background px-6 text-center">
      <h1 className="text-2xl font-bold text-foreground">
        {game.name} · {ko.modeSelect.learnTitle}
      </h1>
      <p className="text-muted-foreground">{ko.learnMode.inProgress}</p>
    </div>
  )
}
