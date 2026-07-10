import { apiFetch } from '@/lib/api'

export type WrongAnswerEntry<T = unknown> = {
  id: string
  gameId: string
  mode: 'learn' | 'practice'
  data: T
  createdAt: number
}

type WrongAnswerResponse<T> = {
  id: string
  game_id: string
  mode: 'learn' | 'practice'
  data: T
  created_at: string
}

function toEntry<T>(r: WrongAnswerResponse<T>): WrongAnswerEntry<T> {
  return { id: r.id, gameId: r.game_id, mode: r.mode, data: r.data, createdAt: new Date(r.created_at).getTime() }
}

export async function getWrongAnswers(gameId?: string): Promise<WrongAnswerEntry[]> {
  const query = gameId ? `?game_id=${encodeURIComponent(gameId)}` : ''
  const entries = await apiFetch<WrongAnswerResponse<unknown>[]>(`/wrong-answers${query}`)
  return entries.map(toEntry)
}

export async function addWrongAnswer<T>(gameId: string, mode: 'learn' | 'practice', data: T): Promise<void> {
  await apiFetch('/wrong-answers', {
    method: 'POST',
    body: JSON.stringify({ game_id: gameId, mode, data }),
  })
}

export async function deleteWrongAnswer(id: string): Promise<void> {
  await apiFetch(`/wrong-answers/${id}`, { method: 'DELETE' })
}

export async function clearWrongAnswers(gameId?: string): Promise<void> {
  const query = gameId ? `?game_id=${encodeURIComponent(gameId)}` : ''
  await apiFetch(`/wrong-answers${query}`, { method: 'DELETE' })
}
