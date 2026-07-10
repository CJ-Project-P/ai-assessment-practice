import { FloppyDisk, Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { ShapeGrid } from '@/components/games/ShapeGrid'
import { LetterShape } from '@/components/games/LetterShape'
import { OPS } from '@/components/games/RotateControls'
import type { ShapeKind } from '@/lib/shapeRotateProblems'
import { applySequence, IDENTITY, type Mat2, type Operation } from '@/lib/shapeTransform'
import { ko } from '@/i18n'

function MiniShape({
  kind,
  cells,
  letter,
  transform,
  size,
}: {
  kind: ShapeKind
  cells: number[]
  letter: string
  transform: Mat2
  size: number
}) {
  if (kind === 'letter') {
    return <LetterShape letter={letter} transform={transform} size={size} />
  }
  return <ShapeGrid cells={new Set(cells)} transform={transform} size={size} />
}

function OpSequence({ ops }: { ops: Operation[] }) {
  if (ops.length === 0) {
    return <p className="text-sm text-muted-foreground">{ko.shapeMistakeCard.noOps}</p>
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {ops.map((op, i) => {
        const meta = OPS.find((o) => o.op === op)
        const OpIcon = meta?.icon
        return (
          <div
            key={i}
            title={meta?.label}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground"
          >
            {OpIcon ? <OpIcon size={18} weight="bold" className="text-primary" /> : i + 1}
          </div>
        )
      })}
    </div>
  )
}

type ShapeMistakeCardProps = {
  kind: ShapeKind
  cells: number[]
  letter: string
  answerOps: Operation[]
  userOps: Operation[]
  title?: string
  meta?: string
  onSave?: () => void
  saved?: boolean
  onDelete?: () => void
}

export function ShapeMistakeCard({
  kind,
  cells,
  letter,
  answerOps,
  userOps,
  title,
  meta,
  onSave,
  saved,
  onDelete,
}: ShapeMistakeCardProps) {
  const targetTransform = applySequence(answerOps)
  const userTransform = applySequence(userOps)

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
      {(title || meta) && (
        <div className="flex items-center justify-between">
          {title && <p className="text-base font-semibold text-muted-foreground">{title}</p>}
          {meta && <p className="text-sm text-muted-foreground">{meta}</p>}
        </div>
      )}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">{ko.shapeMistakeCard.before}</p>
          <MiniShape kind={kind} cells={cells} letter={letter} transform={IDENTITY} size={140} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-primary">{ko.common.answerLabel}</p>
          <MiniShape kind={kind} cells={cells} letter={letter} transform={targetTransform} size={140} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-destructive">{ko.common.myAnswerLabel}</p>
          <MiniShape kind={kind} cells={cells} letter={letter} transform={userTransform} size={140} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">{ko.shapeMistakeCard.answerSequence}</p>
          <OpSequence ops={answerOps} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">{ko.shapeMistakeCard.mySequence}</p>
          <OpSequence ops={userOps} />
        </div>
      </div>
      {(onSave || onDelete) && (
        <div className="flex justify-center gap-3">
          {onSave && (
            <Button variant="secondary" onClick={onSave} disabled={saved} className="px-6 py-3 text-sm">
              <FloppyDisk size={18} weight="bold" className="mr-1 inline" />
              {saved ? ko.shapeMistakeCard.saved : ko.shapeMistakeCard.save}
            </Button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="flex cursor-pointer items-center gap-1 text-sm text-destructive hover:underline"
            >
              <Trash size={16} weight="bold" />
              {ko.common.delete}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
