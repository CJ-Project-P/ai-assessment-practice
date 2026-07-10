/**
 * localStorage 값을 { version, data } 형태로 감싼다.
 * 버전이 다르면(과거 미버전 데이터 포함) 조용히 fallback을 반환한다 —
 * 지금 규모에서는 필드 단위 마이그레이션 대신 스키마가 바뀌면 버전을 올려 초기화하는 쪽을 택한다.
 */
export function readStorage<T>(key: string, version: number, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as { version?: number; data?: T }
    if (parsed.version !== version || parsed.data === undefined) return fallback
    return parsed.data
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, version: number, data: T) {
  localStorage.setItem(key, JSON.stringify({ version, data }))
}
