/**
 * 백엔드가 아직 없어서 프론트에서만 도는 임시 로그인 스텁이다.
 * localStorage에 아이디/비밀번호를 평문으로 저장하므로 실제 인증으로 취급하면 안 되고,
 * 나중에 서버 API(회원가입/로그인/세션)로 반드시 교체해야 한다.
 */
import { readStorage, writeStorage } from '@/lib/storage'
import { ko } from '@/i18n'

export type StoredUser = { username: string; password: string }

const USERS_KEY = 'ai-assessment-practice:users'
const USERS_VERSION = 1
const SESSION_KEY = 'ai-assessment-practice:current-user'

function getUsers(): StoredUser[] {
  return readStorage<StoredUser[]>(USERS_KEY, USERS_VERSION, [])
}

function saveUsers(users: StoredUser[]) {
  writeStorage(USERS_KEY, USERS_VERSION, users)
}

export function getCurrentUsername(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function signUp(username: string, password: string): { ok: true } | { ok: false; error: string } {
  const trimmed = username.trim()
  if (!trimmed || !password) return { ok: false, error: ko.auth.missingFields }
  const users = getUsers()
  if (users.some((u) => u.username === trimmed)) {
    return { ok: false, error: ko.auth.usernameTaken }
  }
  users.push({ username: trimmed, password })
  saveUsers(users)
  localStorage.setItem(SESSION_KEY, trimmed)
  return { ok: true }
}

export function logIn(username: string, password: string): { ok: true } | { ok: false; error: string } {
  const trimmed = username.trim()
  const users = getUsers()
  const user = users.find((u) => u.username === trimmed)
  if (!user || user.password !== password) {
    return { ok: false, error: ko.auth.invalidCredentials }
  }
  localStorage.setItem(SESSION_KEY, trimmed)
  return { ok: true }
}

export function logOut() {
  localStorage.removeItem(SESSION_KEY)
}
