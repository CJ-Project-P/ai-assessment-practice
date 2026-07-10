import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Trash } from '@phosphor-icons/react'
import { PageContainer } from '@/components/ui/PageContainer'
import { ShapeGrid } from '@/components/games/ShapeGrid'
import { LetterShape } from '@/components/games/LetterShape'
import { OPS } from '@/components/games/RotateControls'
import { deleteSavedShape, getSavedShapes, type SavedShape } from '@/lib/savedShapes'
import { applySequence, IDENTITY } from '@/lib/shapeTransform'
import { ko } from '@/i18n'

function SavedShapePreview({ shape, size }: { shape: SavedShape; size: number }) {
  if (shape.kind === 'letter') {
    return <LetterShape letter={shape.letter} transform={IDENTITY} size={size} />
  }
  return <ShapeGrid cells={new Set(shape.cells)} transform={IDENTITY} size={size} />
}

function SavedShapeResult({ shape, size }: { shape: SavedShape; size: number }) {
  const transform = applySequence(shape.history)
  if (shape.kind === 'letter') {
    return <LetterShape letter={shape.letter} transform={transform} size={size} />
  }
  return <ShapeGrid cells={new Set(shape.cells)} transform={transform} size={size} />
}

function SavedSequence({ history }: { history: SavedShape['history'] }) {
  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground">{ko.shapeMistakeCard.noOps}</p>
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {history.map((op, i) => {
        const meta = OPS.find((o) => o.op === op)
        const OpIcon = meta?.icon
        return (
          <div
            key={i}
            title={meta?.label}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground"
          >
            {OpIcon ? <OpIcon size={16} weight="bold" className="text-primary" /> : i + 1}
          </div>
        )
      })}
    </div>
  )
}

export default function SavedShapes() {
  const { gameId } = useParams()
  const [shapes, setShapes] = useState<SavedShape[]>([])

  useEffect(() => {
    setShapes(getSavedShapes())
  }, [])

  function handleDelete(id: string) {
    deleteSavedShape(id)
    setShapes((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <PageContainer className="py-12">
      <div className="relative mb-10 text-center">
        <h1 className="text-4xl font-bold text-foreground">{ko.shapeRotate.savedShapesTitle}</h1>
        <Link
          to={`/games/${gameId}/simulator`}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-base text-primary hover:underline"
        >
          {ko.shapeRotate.backToSimulator}
        </Link>
      </div>

      {shapes.length === 0 ? (
        <p className="text-center text-lg text-muted-foreground">{ko.shapeRotate.noSavedShapes}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shapes.map((shape) => (
            <div
              key={shape.id}
              className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6"
            >
              <div className="grid w-full grid-cols-2 gap-3 text-center">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-muted-foreground">{ko.shapeMistakeCard.before}</p>
                  <SavedShapePreview shape={shape} size={140} />
                </div>
                <div className="flex flex-col items-center gap-2 rounded-xl bg-primary/5 p-2">
                  <p className="text-sm text-muted-foreground">{ko.shapeRotate.after}</p>
                  <SavedShapeResult shape={shape} size={140} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(shape.createdAt).toLocaleString('ko-KR')}
              </p>
              <SavedSequence history={shape.history} />
              <button
                type="button"
                onClick={() => handleDelete(shape.id)}
                className="flex cursor-pointer items-center gap-1 text-sm text-destructive hover:underline"
              >
                <Trash size={16} weight="bold" />
                {ko.common.delete}
              </button>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
