export type ShapeName = 'circle' | 'triangle' | 'square'
export type Answer = 'space' | 'left' | 'right'
export type Round = 1 | 2

export const SHAPES: ShapeName[] = ['circle', 'triangle', 'square']
/** 1라운드는 2개 전과만 비교하므로, 첫 판정을 위해 필요한 최소 워밍업은 2개다. */
export const WARMUP_COUNT = 2

function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}

function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(arr.length)]
}

export function generateWarmupShapes(): ShapeName[] {
  return Array.from({ length: WARMUP_COUNT }, () => randomChoice(SHAPES))
}

/**
 * history는 지금까지 나온 도형(워밍업 포함) 전체 순서다.
 * round에서 허용하는 정답 유형 중 하나를 무작위로 고르고, 그 정답이 나오도록 다음 도형을 만든다.
 * - 1라운드: 다름(space) 또는 2번째 전과 같음(left)만 나온다.
 * - 2라운드: 다름(space) / 2번째 전과 같음(left) / 3번째 전과 같음(right) 모두 나올 수 있다.
 */
export function generateNextShape(history: ShapeName[], round: Round): { shape: ShapeName; correctAnswer: Answer } {
  const twoBack = history[history.length - 2]
  const threeBack = history[history.length - 3]

  const allowedAnswers: Answer[] = round === 1 ? ['space', 'left'] : ['space', 'left', 'right']
  const correctAnswer = randomChoice(allowedAnswers)

  let shape: ShapeName
  if (correctAnswer === 'left') {
    shape = twoBack
  } else if (correctAnswer === 'right') {
    shape = threeBack
  } else {
    const exclude = new Set(round === 1 ? [twoBack] : [twoBack, threeBack])
    const candidates = SHAPES.filter((s) => !exclude.has(s))
    shape = randomChoice(candidates)
  }

  return { shape, correctAnswer }
}
