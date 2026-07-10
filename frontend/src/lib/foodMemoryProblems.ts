import { sample, shuffle } from '@/lib/random'

const foodModules = import.meta.glob('../assets/food/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const FOOD_NAME_KO: Record<string, string> = {
  chicken: '치킨',
  'doenjang-guk': '된장국',
  donkatsu: '돈까스',
  'egg-fried-rice': '계란볶음밥',
  gimbap: '김밥',
  gopchang: '곱창',
  'grilled-fish': '생선구이',
  hamburger: '햄버거',
  jeon: '전',
  jjajangmyeon: '짜장면',
  jjamppong: '짬뽕',
  jokbal: '족발',
  'kimchi-jjigae': '김치찌개',
  mandu: '만두',
  pizza: '피자',
  sashimi: '회',
  steak: '스테이크',
  sundae: '순대',
  sushi: '초밥',
  suyuk: '수육',
  tangsuyuk: '탕수육',
  tteokbokki: '떡볶이',
  udon: '우동',
}

export type FoodItem = { id: string; name: string; src: string }

export const FOOD_ITEMS: FoodItem[] = Object.entries(foodModules)
  .map(([path, src]) => {
    const id = path.split('/').pop()!.replace(/\.webp$/i, '')
    return { id, name: FOOD_NAME_KO[id] ?? id, src }
  })
  .sort((a, b) => a.id.localeCompare(b.id))

const PERSON_NAMES = [
  '철수', '영희', '민수', '지훈', '수진', '유진', '하늘', '태우',
  '서연', '도윤', '예린', '준서', '가은', '시우', '나윤', '재현',
]

export type Round = 1 | 2

export type FoodTurn = { name: string; items: FoodItem[] }

export type FoodMemoryProblem = {
  turns: FoodTurn[]
  correctItem: FoodItem
  options: FoodItem[]
}

const TURN_COUNT = 3
const OPTION_COUNT = 6

/** round 1은 턴당 3개, round 2는 턴당 4개 음식을 노출한다. */
export function generateFoodProblem(round: Round = 1): FoodMemoryProblem {
  const itemsPerTurn = round === 1 ? 3 : 4
  const names = sample(PERSON_NAMES, TURN_COUNT)
  const repeatTurns = new Set(sample([0, 1, 2], 2))

  const [correctItem] = sample(FOOD_ITEMS, 1)
  const remainingPool = FOOD_ITEMS.filter((item) => item.id !== correctItem.id)

  const usedFillerIds = new Set<string>()
  const seenOnce: FoodItem[] = []
  const turns: FoodTurn[] = []

  for (let t = 0; t < TURN_COUNT; t++) {
    const isRepeatTurn = repeatTurns.has(t)
    const fillerCount = isRepeatTurn ? itemsPerTurn - 1 : itemsPerTurn
    const available = remainingPool.filter((item) => !usedFillerIds.has(item.id))
    const fillers = sample(available, fillerCount)
    fillers.forEach((item) => usedFillerIds.add(item.id))
    seenOnce.push(...fillers)

    const items = isRepeatTurn ? shuffle([correctItem, ...fillers]) : fillers
    turns.push({ name: names[t], items })
  }

  const decoys = sample(seenOnce, Math.min(OPTION_COUNT - 1, seenOnce.length))
  const options = shuffle([correctItem, ...decoys])

  return { turns, correctItem, options }
}
