export type Mode = 'learn' | 'practice'

/** 실전 분량 모드는 라운드별로 고정값을 쓰고, 학습 모드는 사용자가 지정한 라운드별 값을 쓴다. */
export function roundPair(
  mode: Mode,
  practiceValue: number,
  round1: number | undefined,
  round2: number | undefined,
): [number, number] {
  if (mode === 'practice') return [practiceValue, practiceValue]
  return [round1 ?? 0, round2 ?? 0]
}

/** 라운드 구분 없이 값 하나만 쓰는 게임(마법약 등)용. */
export function singleRoundValue(mode: Mode, practiceValue: number, value: number | undefined): number {
  return mode === 'practice' ? practiceValue : (value ?? 0)
}
