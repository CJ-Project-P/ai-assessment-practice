import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FloppyDisk } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { PageContainer } from '@/components/ui/PageContainer'
import { ShapeGrid } from '@/components/games/ShapeGrid'
import { RotateControls } from '@/components/games/RotateControls'
import { applySequence, type Operation } from '@/lib/shapeTransform'
import { saveShape } from '@/lib/savedShapes'
import { ko } from '@/i18n'

const MAX_HISTORY = 8

export default function ShapeRotateSimulator() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [cells, setCells] = useState<Set<number>>(new Set())
  const [history, setHistory] = useState<Operation[]>([])
  const [saved, setSaved] = useState(false)

  const transform = applySequence(history)

  function toggleCell(index: number) {
    setSaved(false)
    setCells((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function handleOp(op: Operation) {
    if (history.length >= MAX_HISTORY) return
    setSaved(false)
    setHistory((prev) => [...prev, op])
  }

  function handleUndo() {
    setSaved(false)
    setHistory((prev) => prev.slice(0, -1))
  }

  function handleReset() {
    setSaved(false)
    setHistory([])
  }

  function handleClear() {
    setSaved(false)
    setCells(new Set())
    setHistory([])
  }

  function handleSave() {
    if (cells.size === 0) return
    saveShape({ kind: 'grid', cells }, history)
    setSaved(true)
  }

  return (
    <PageContainer className="flex min-h-dvh flex-col justify-center gap-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">{ko.shapeRotate.simulatorTitle}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{ko.shapeRotate.simulatorDescription}</p>
      </div>

      <div className="grid grid-cols-1 gap-10 rounded-2xl border border-border bg-card p-10 lg:grid-cols-2">
        <div className="flex items-center justify-center">
          <ShapeGrid cells={cells} transform={transform} size={760} onCellClick={toggleCell} />
        </div>
        <div className="flex flex-col justify-center gap-8">
          <RotateControls
            history={history}
            maxClicks={MAX_HISTORY}
            onOp={handleOp}
            onUndo={handleUndo}
            onReset={handleReset}
          />
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleSave} disabled={cells.size === 0} className="px-10 py-5 text-lg">
              <FloppyDisk size={24} weight="bold" className="mr-1 inline" />
              {saved ? ko.shapeMistakeCard.saved : ko.shapeMistakeCard.save}
            </Button>
            <Button variant="secondary" onClick={handleClear} className="px-10 py-5 text-lg">
              {ko.shapeRotate.clear}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 text-base">
        <Link to={`/games/${gameId}/simulator/saved`} className="text-primary hover:underline">
          {ko.shapeRotate.savedShapesLink}
        </Link>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="cursor-pointer text-muted-foreground hover:underline"
        >
          {ko.shapeRotate.back}
        </button>
      </div>
    </PageContainer>
  )
}
