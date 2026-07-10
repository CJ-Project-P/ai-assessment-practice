import { supabase } from '@/lib/supabaseClient'
import { ko } from '@/i18n'

export type AuthUser = {
  id: string
  email: string
}

const ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': ko.auth.invalidCredentials,
  'User already registered': ko.auth.emailTaken,
  'Email not confirmed': ko.auth.emailNotConfirmed,
  'Password should be at least 6 characters.': ko.auth.passwordTooShort,
}

function translateError(message: string): string {
  return ERROR_MESSAGES[message] ?? message
}

function toAuthUser(user: { id: string; email?: string | null } | null | undefined): AuthUser | null {
  if (!user || !user.email) return null
  return { id: user.id, email: user.email }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data } = await supabase.auth.getUser()
  return toAuthUser(data.user)
}

/** 로그인 상태가 바뀔 때마다 callback을 호출한다. 구독 해제 함수를 반환한다. */
export function onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(toAuthUser(session?.user))
  })
  return () => subscription.unsubscribe()
}

export async function signUp(
  email: string,
  password: string,
): Promise<{ ok: true; needsEmailConfirmation: boolean } | { ok: false; error: string }> {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { ok: false, error: translateError(error.message) }
  return { ok: true, needsEmailConfirmation: !data.session }
}

export async function logIn(email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, error: translateError(error.message) }
  return { ok: true }
}

export async function logOut(): Promise<void> {
  await supabase.auth.signOut()
}
