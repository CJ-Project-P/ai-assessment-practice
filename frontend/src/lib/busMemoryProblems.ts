import { randomInRange, randomInt, sample, shuffle } from '@/lib/random'

const PERSON_NAMES = [
  '철수', '영희', '민수', '지훈', '수진', '유진', '하늘', '태우',
  '서연', '도윤', '예린', '준서', '가은', '시우', '나윤', '재현',
]

export type Round = 1 | 2

export type BusTurn = { name: string; numbers: number[] }

export type BusMemoryProblem = {
  turns: BusTurn[]
  correctNumber: number
  options: number[]
}

const TURN_COUNT = 3
const OPTION_COUNT = 5
const DECOY_COUNT = OPTION_COUNT - 1

/** 1라운드는 매 턴 2개씩 고정, 2라운드는 매 턴 1개 또는 2개 무작위(합이 4 미만이면 다시 뽑음). */
function generateTurnCounts(round: Round): number[] {
  if (round === 1) return [2, 2, 2]
  let counts: number[]
  do {
    counts = Array.from({ length: TURN_COUNT }, () => 1 + randomInt(2))
  } while (counts.reduce((a, b) => a + b, 0) < DECOY_COUNT)
  return counts
}

/** 1/2/3자리 번호를 각각 최소 1개씩 포함하도록 보장하며 서로 겹치지 않는 번호 풀을 만든다. */
function generateNumberPool(size: number): number[] {
  const pool = new Set<number>()
  pool.add(randomInRange(1, 9))
  pool.add(randomInRange(10, 99))
  pool.add(randomInRange(100, 999))
  while (pool.size < size) {
    pool.add(randomInRange(1, 999))
  }
  return shuffle([...pool])
}

export function generateBusProblem(round: Round = 1): BusMemoryProblem {
  const turnCounts = generateTurnCounts(round)
  const totalShown = turnCounts.reduce((a, b) => a + b, 0)
  const names = sample(PERSON_NAMES, TURN_COUNT)

  const pool = generateNumberPool(totalShown + 1)
  const [correctNumber, ...shownNumbers] = pool

  const turns: BusTurn[] = []
  let cursor = 0
  for (let t = 0; t < TURN_COUNT; t++) {
    const count = turnCounts[t]
    turns.push({ name: names[t], numbers: shownNumbers.slice(cursor, cursor + count) })
    cursor += count
  }

  const decoys = sample(shownNumbers, DECOY_COUNT)
  const options = shuffle([correctNumber, ...decoys])

  return { turns, correctNumber, options }
}
