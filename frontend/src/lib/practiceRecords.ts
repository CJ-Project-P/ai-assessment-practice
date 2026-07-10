import { getCurrentUsername } from '@/lib/auth'
import { readStorage, writeStorage } from '@/lib/storage'

export type PracticeRecord = {
  id: string
  gameId: string
  username: string | null
  total: number
  correct: number
  createdAt: number
}

const STORAGE_KEY = 'ai-assessment-practice:practice-records'
const STORAGE_VERSION = 1

function getAllRecords(): PracticeRecord[] {
  return readStorage<PracticeRecord[]>(STORAGE_KEY, STORAGE_VERSION, [])
}

/** 실전 분량 모드를 한 판 마칠 때마다 호출해서 정확도 기록을 남긴다. */
export function addPracticeRecord(gameId: string, total: number, correct: number): PracticeRecord {
  const entry: PracticeRecord = {
    id: crypto.randomUUID(),
    gameId,
    username: getCurrentUsername(),
    total,
    correct,
    createdAt: Date.now(),
  }
  const records = getAllRecords()
  records.unshift(entry)
  writeStorage(STORAGE_KEY, STORAGE_VERSION, records)
  return entry
}

/** 현재 로그인한 사용자(비로그인이면 null 사용자) 기준으로, 필요하면 게임별로 필터링해 기록을 가져온다. */
export function getPracticeRecords(gameId?: string): PracticeRecord[] {
  const username = getCurrentUsername()
  return getAllRecords()
    .filter((r) => r.username === username)
    .filter((r) => !gameId || r.gameId === gameId)
    .sort((a, b) => a.createdAt - b.createdAt)
}

export function clearPracticeRecords(gameId?: string) {
  const username = getCurrentUsername()
  const remaining = getAllRecords().filter((r) => {
    if (r.username !== username) return true
    if (gameId && r.gameId !== gameId) return true
    return false
  })
  writeStorage(STORAGE_KEY, STORAGE_VERSION, remaining)
}
