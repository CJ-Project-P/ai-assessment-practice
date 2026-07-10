import {
  ArrowUUpLeft,
  ArrowUUpRight,
  FlipHorizontal,
  FlipVertical,
} from '@phosphor-icons/react'
import type { Operation } from '@/lib/shapeTransform'
import { cn } from '@/lib/utils'
import { ko } from '@/i18n'

export const OPS: { op: Operation; label: string; icon: typeof ArrowUUpLeft }[] = [
  { op: 'rotate-left', label: ko.rotateControls.rotateLeft, icon: ArrowUUpLeft },
  { op: 'rotate-right', label: ko.rotateControls.rotateRight, icon: ArrowUUpRight },
  { op: 'flip-h', label: ko.rotateControls.flipH, icon: FlipHorizontal },
  { op: 'flip-v', label: ko.rotateControls.flipV, icon: FlipVertical },
]

const HISTORY_SLOTS = 8

type RotateControlsProps = {
  history: Operation[]
  maxClicks: number
  onOp: (op: Operation) => void
  onUndo: () => void
  onReset: () => void
}

export function RotateControls({ history, maxClicks, onOp, onUndo, onReset }: RotateControlsProps) {
  const remaining = maxClicks - history.length
  const full = history.length >= HISTORY_SLOTS || remaining <= 0

  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-2 gap-7 sm:grid-cols-4">
        {OPS.map(({ op, label, icon: OpIcon }) => (
          <button
            key={op}
            type="button"
            disabled={full}
            onClick={() => onOp(op)}
            className={cn(
              'flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-primary/30 px-5 py-12 text-2xl font-medium text-primary transition-colors',
              'hover:bg-primary/5 disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:hover:bg-transparent',
            )}
          >
            <OpIcon size={64} weight="bold" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-7 sm:flex-row">
        <div className="grid grid-cols-4 grid-rows-2 gap-7 rounded-xl border border-border bg-card p-8">
          {Array.from({ length: HISTORY_SLOTS }, (_, i) => {
            const step = history[i]
            const StepIcon = step ? OPS.find((o) => o.op === step)?.icon : undefined
            return (
              <div
                key={i}
                className="flex h-28 w-28 items-center justify-center rounded-md border border-border text-3xl text-muted-foreground"
              >
                {StepIcon ? <StepIcon size={46} weight="bold" className="text-primary" /> : i + 1}
              </div>
            )
          })}
        </div>
        <div className="flex flex-1 flex-col justify-between gap-5 rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-xl text-muted-foreground">{ko.rotateControls.remainingClicks}</p>
          <p className="text-7xl font-bold text-foreground">{remaining}</p>
          <button
            type="button"
            onClick={onUndo}
            disabled={history.length === 0}
            className="cursor-pointer text-xl text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {ko.rotateControls.undoOne}
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={history.length === 0}
            className="cursor-pointer text-xl text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {ko.rotateControls.resetAll}
          </button>
        </div>
      </div>
    </div>
  )
}
