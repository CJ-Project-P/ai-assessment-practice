import { randomInt, sample } from '@/lib/random'

export type Ingredient = 'fern' | 'clover' | 'grass'
export type PotionColor = 'blue' | 'red'
export type PotionRuleTable = Record<string, PotionColor>

export const INGREDIENTS: Ingredient[] = ['fern', 'clover', 'grass']
export const SLOT_COUNT = 4

export type PotionProblem = {
  slots: (Ingredient | null)[]
  combo: Ingredient[]
}

function comboKey(combo: Ingredient[]): string {
  return [...combo].sort().join(',')
}

function allComboKeys(): string[] {
  const keys: string[] = []
  for (let mask = 1; mask < 1 << INGREDIENTS.length; mask++) {
    const combo = INGREDIENTS.filter((_, i) => mask & (1 << i))
    keys.push(comboKey(combo))
  }
  return keys
}

/** 재료 조합마다 파란약/빨간약 중 하나를 무작위로 고정 배정한다 — 이 규칙표가 정답 기준이다. */
export function generateRuleTable(): PotionRuleTable {
  const table: PotionRuleTable = {}
  for (const key of allComboKeys()) {
    table[key] = Math.random() < 0.5 ? 'blue' : 'red'
  }
  return table
}

/** 규칙표 중 일부만 무작위로 골라 정답 색을 뒤집는다 — "패턴별로 같은 정답만 나오다가 갑자기 몇 개는 바뀐다". */
export function mutateRuleTable(table: PotionRuleTable, flipCount = 2): PotionRuleTable {
  const keys = Object.keys(table)
  const toFlip = sample(keys, Math.min(flipCount, keys.length))
  const next = { ...table }
  toFlip.forEach((key) => {
    next[key] = next[key] === 'blue' ? 'red' : 'blue'
  })
  return next
}

/** 재료 1~3개를 무작위로 골라 4칸 중 무작위 위치에 배치한다. */
export function generatePotionProblem(): PotionProblem {
  const subsetSize = 1 + randomInt(INGREDIENTS.length)
  const combo = sample(INGREDIENTS, subsetSize)
  const slotIndices = sample(
    Array.from({ length: SLOT_COUNT }, (_, i) => i),
    combo.length,
  )
  const slots: (Ingredient | null)[] = Array.from({ length: SLOT_COUNT }, () => null)
  combo.forEach((ingredient, i) => {
    slots[slotIndices[i]] = ingredient
  })
  return { slots, combo }
}

export function brewPotion(combo: Ingredient[], table: PotionRuleTable): PotionColor {
  return table[comboKey(combo)] ?? 'red'
}
