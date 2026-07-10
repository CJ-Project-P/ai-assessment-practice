import { matToCssTransform, IDENTITY, INSCRIBE_SCALE, type Mat2 } from '@/lib/shapeTransform'

type ShapeGridProps = {
  cells: Set<number>
  transform?: Mat2
  size?: number
  onCellClick?: (index: number) => void
}

/** 4x4 격자 위에 색칠된 도형을 그린다. 배경 프레임은 항상 정사각형으로 고정하고, 격자 내용만 회전/반전시켜 보여준다. */
export function ShapeGrid({ cells, transform = IDENTITY, size = 160, onCellClick }: ShapeGridProps) {
  return (
    <div
      className="flex aspect-square w-full items-center justify-center"
      style={{ maxWidth: size * 1.5 }}
    >
      <div
        className="flex aspect-square w-full max-w-full items-center justify-center overflow-hidden rounded-lg bg-border p-1"
        style={{ maxWidth: size }}
      >
        <div
          className="grid aspect-square h-full w-full grid-cols-4 grid-rows-4 gap-1"
          style={{
            transform: `${matToCssTransform(transform)} scale(${INSCRIBE_SCALE})`,
            transition: 'transform 300ms ease',
          }}
        >
          {Array.from({ length: 16 }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`cell-${i}`}
              onClick={onCellClick ? () => onCellClick(i) : undefined}
              className={
                cells.has(i)
                  ? 'rounded-sm bg-primary'
                  : 'rounded-sm bg-card' + (onCellClick ? ' cursor-pointer hover:bg-muted' : '')
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
