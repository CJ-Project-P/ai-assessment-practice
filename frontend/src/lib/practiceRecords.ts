import { apiFetch } from '@/lib/api'

export type PracticeRecord = {
  id: string
  gameId: string
  total: number
  correct: number
  createdAt: number
}

type PracticeRecordResponse = {
  id: string
  game_id: string
  total: number
  correct: number
  created_at: string
}

function toPracticeRecord(r: PracticeRecordResponse): PracticeRecord {
  return { id: r.id, gameId: r.game_id, total: r.total, correct: r.correct, createdAt: new Date(r.created_at).getTime() }
}

/** 실전 분량 모드를 한 판 마칠 때마다 호출해서 정확도 기록을 남긴다. */
export async function addPracticeRecord(gameId: string, total: number, correct: number): Promise<void> {
  await apiFetch('/practice-records', {
    method: 'POST',
    body: JSON.stringify({ game_id: gameId, total, correct }),
  })
}

export async function getPracticeRecords(gameId?: string): Promise<PracticeRecord[]> {
  const query = gameId ? `?game_id=${encodeURIComponent(gameId)}` : ''
  const records = await apiFetch<PracticeRecordResponse[]>(`/practice-records${query}`)
  return records.map(toPracticeRecord).sort((a, b) => a.createdAt - b.createdAt)
}

export async function clearPracticeRecords(gameId?: string): Promise<void> {
  const query = gameId ? `?game_id=${encodeURIComponent(gameId)}` : ''
  await apiFetch(`/practice-records${query}`, { method: 'DELETE' })
}
