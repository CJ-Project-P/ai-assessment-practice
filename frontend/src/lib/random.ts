export function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export function randomInRange(min: number, max: number) {
  return min + randomInt(max - min + 1)
}

/** 원본 배열은 건드리지 않고, 앞에서부터 count개를 무작위로 뽑아 반환한다 (순서도 섞임). */
export function sample<T>(pool: T[], count: number): T[] {
  const copy = [...pool]
  const result: T[] = []
  for (let i = 0; i < count && copy.length > 0; i++) {
    const idx = randomInt(copy.length)
    result.push(copy.splice(idx, 1)[0])
  }
  return result
}

export function shuffle<T>(arr: T[]): T[] {
  return sample(arr, arr.length)
}
