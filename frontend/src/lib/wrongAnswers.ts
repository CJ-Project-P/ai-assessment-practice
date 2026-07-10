import { readStorage, writeStorage } from '@/lib/storage'

export type WrongAnswerEntry<T = unknown> = {
  id: string
  gameId: string
  mode: 'learn' | 'practice'
  data: T
  createdAt: number
}

const STORAGE_KEY = 'ai-assessment-practice:wrong-answers'
const STORAGE_VERSION = 1

function getAllEntries(): WrongAnswerEntry[] {
  return readStorage<WrongAnswerEntry[]>(STORAGE_KEY, STORAGE_VERSION, [])
}

export function getWrongAnswers(gameId?: string): WrongAnswerEntry[] {
  const all = getAllEntries()
  return gameId ? all.filter((entry) => entry.gameId === gameId) : all
}

export function addWrongAnswer<T>(gameId: string, mode: 'learn' | 'practice', data: T): WrongAnswerEntry<T> {
  const full: WrongAnswerEntry<T> = { id: crypto.randomUUID(), gameId, mode, data, createdAt: Date.now() }
  const all = getAllEntries()
  all.unshift(full as WrongAnswerEntry)
  writeStorage(STORAGE_KEY, STORAGE_VERSION, all)
  return full
}

export function deleteWrongAnswer(id: string) {
  const all = getAllEntries().filter((entry) => entry.id !== id)
  writeStorage(STORAGE_KEY, STORAGE_VERSION, all)
}

export function clearWrongAnswers(gameId?: string) {
  if (!gameId) {
    writeStorage(STORAGE_KEY, STORAGE_VERSION, [])
    return
  }
  const remaining = getAllEntries().filter((entry) => entry.gameId !== gameId)
  writeStorage(STORAGE_KEY, STORAGE_VERSION, remaining)
}
