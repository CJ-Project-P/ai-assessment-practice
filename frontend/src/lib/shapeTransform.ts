export type Operation = 'rotate-left' | 'rotate-right' | 'flip-h' | 'flip-v'

/** 2x2 행렬 [a, b, c, d] = [[a, b], [c, d]] */
export type Mat2 = [number, number, number, number]

export const IDENTITY: Mat2 = [1, 0, 0, 1]

/** 45도 회전 시에도 대각선이 정사각형 프레임에 딱 맞도록 도형을 줄이는 배율. */
export const INSCRIBE_SCALE = 1 / Math.SQRT2

function multiply(m1: Mat2, m2: Mat2): Mat2 {
  const [a1, b1, c1, d1] = m1
  const [a2, b2, c2, d2] = m2
  return [a1 * a2 + b1 * c2, a1 * b2 + b1 * d2, c1 * a2 + d1 * c2, c1 * b2 + d1 * d2]
}

function rotate45(direction: 'left' | 'right'): Mat2 {
  // CSS는 y축이 아래로 향하는 좌표계라, 수학적 CCW(+theta)가 화면에선 시계방향으로 보인다.
  // "왼쪽 회전"이 화면상 반시계 방향으로 보이도록 부호를 뒤집는다.
  const theta = (direction === 'left' ? -1 : 1) * (Math.PI / 4)
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)
  return [cos, -sin, sin, cos]
}

const FLIP_H: Mat2 = [-1, 0, 0, 1]
const FLIP_V: Mat2 = [1, 0, 0, -1]

function opMatrix(op: Operation): Mat2 {
  switch (op) {
    case 'rotate-left':
      return rotate45('left')
    case 'rotate-right':
      return rotate45('right')
    case 'flip-h':
      return FLIP_H
    case 'flip-v':
      return FLIP_V
  }
}

/** 새 조작을 기존 누적 변환 위에 적용한다 (조작 순서대로 왼쪽 곱셈). */
export function applyOp(current: Mat2, op: Operation): Mat2 {
  return multiply(opMatrix(op), current)
}

export function applySequence(ops: Operation[]): Mat2 {
  return ops.reduce<Mat2>((acc, op) => applyOp(acc, op), IDENTITY)
}

/** 행렬을 CSS transform 문자열로 변환한다. */
export function matToCssTransform([a, b, c, d]: Mat2): string {
  return `matrix(${a}, ${c}, ${b}, ${d}, 0, 0)`
}

export function matricesEqual(m1: Mat2, m2: Mat2, epsilon = 1e-4): boolean {
  return m1.every((v, i) => Math.abs(v - m2[i]) < epsilon)
}
