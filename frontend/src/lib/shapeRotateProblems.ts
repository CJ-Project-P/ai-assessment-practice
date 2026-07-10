import { applySequence, IDENTITY, matricesEqual, type Mat2, type Operation } from '@/lib/shapeTransform'
import { randomInt } from '@/lib/random'

export type ShapeKind = 'grid' | 'letter'

export type ShapeRotateProblem = {
  kind: ShapeKind
  cells: Set<number>
  letter: string
  answerOps: Operation[]
  targetTransform: Mat2
}

export type Round = 1 | 2

const ALL_OPS: Operation[] = ['rotate-left', 'rotate-right', 'flip-h', 'flip-v']
const LETTERS = ['J', 'G', 'P', 'R', 'L']

function randomCells(): Set<number> {
  const count = 3 + randomInt(4) // 3~6개
  const cells = new Set<number>()
  while (cells.size < count) {
    cells.add(randomInt(16))
  }
  return cells
}

function randomLetter(): string {
  return LETTERS[randomInt(LETTERS.length)]
}

function randomOps(): Operation[] {
  const count = 1 + randomInt(3) // 1~3단계
  return Array.from({ length: count }, () => ALL_OPS[randomInt(ALL_OPS.length)])
}

/** round 1은 문자 도형(J/G/P/R/L), round 2는 4x4 격자 도형만 출제한다. */
export function generateProblem(round: Round = 1): ShapeRotateProblem {
  const kind: ShapeKind = round === 1 ? 'letter' : 'grid'

  // 돌리기 전/후 모양이 절대 같아서는 안 되므로, 항등 변환이 나오면 다시 뽑는다.
  let answerOps: Operation[]
  let targetTransform: Mat2
  do {
    answerOps = randomOps()
    targetTransform = applySequence(answerOps)
  } while (matricesEqual(targetTransform, IDENTITY))

  return {
    kind,
    cells: kind === 'grid' ? randomCells() : new Set(),
    letter: kind === 'letter' ? randomLetter() : '',
    answerOps,
    targetTransform,
  }
}
