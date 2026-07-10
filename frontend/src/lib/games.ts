export type GameId = 'shape-rotate' | 'potion' | 'shape-sequence' | 'food-memory' | 'bus-memory'

export type Game = {
  id: GameId
  name: string
  description: string
  hasSimulator?: boolean
}

export const games: Game[] = [
  {
    id: 'shape-rotate',
    name: '도형 회전하기',
    description: '도형을 회전·반전시켜 목표 모양으로 만들어요',
    hasSimulator: true,
  },
  {
    id: 'potion',
    name: '마법약 만들기',
    description: '재료를 조합해 규칙을 추론해요',
  },
  {
    id: 'shape-sequence',
    name: '도형 순서 기억하기',
    description: '몇 번째 전 도형과 같은지 기억해요',
  },
  {
    id: 'food-memory',
    name: '음식 기억하기',
    description: '나왔던 메뉴 중 반복해서 등장한 메뉴를 찾아요',
  },
  {
    id: 'bus-memory',
    name: '버스 번호 기억하기',
    description: '한 번도 등장하지 않은 버스 번호를 찾아요',
  },
]

export function getGame(id: string | undefined) {
  return games.find((game) => game.id === id)
}
