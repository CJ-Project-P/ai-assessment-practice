import { matToCssTransform, IDENTITY, INSCRIBE_SCALE, type Mat2 } from '@/lib/shapeTransform'

type LetterShapeProps = {
  letter: string
  transform?: Mat2
  size?: number
}

/** 1라운드용 문자형 도형(J·G·P·R·L). 배경 프레임은 항상 정사각형으로 고정하고, 글자만 회전/반전시킨다. */
export function LetterShape({ letter, transform = IDENTITY, size = 160 }: LetterShapeProps) {
  return (
    <div
      className="flex aspect-square w-full items-center justify-center"
      style={{ maxWidth: size * 1.5 }}
    >
      <div
        className="flex aspect-square w-full max-w-full items-center justify-center overflow-hidden rounded-lg bg-border/30"
        style={{ maxWidth: size }}
      >
        <span
          className="font-black text-primary"
          style={{
            fontSize: size * 0.55,
            transform: `${matToCssTransform(transform)} scale(${INSCRIBE_SCALE})`,
            transition: 'transform 300ms ease',
          }}
        >
          {letter}
        </span>
      </div>
    </div>
  )
}
