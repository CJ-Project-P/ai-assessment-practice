import type { ShapeKind } from '@/lib/shapeRotateProblems'
import type { Operation } from '@/lib/shapeTransform'
import { readStorage, writeStorage } from '@/lib/storage'

export type SavedShape = {
  id: string
  kind: ShapeKind
  cells: number[]
  letter: string
  history: Operation[]
  createdAt: number
}

const STORAGE_KEY = 'ai-assessment-practice:saved-shapes'
const STORAGE_VERSION = 1

export function getSavedShapes(): SavedShape[] {
  return readStorage<SavedShape[]>(STORAGE_KEY, STORAGE_VERSION, [])
}

export function saveShape(
  shape: { kind: ShapeKind; cells: Set<number> | number[]; letter?: string },
  history: Operation[],
): SavedShape {
  const entry: SavedShape = {
    id: crypto.randomUUID(),
    kind: shape.kind,
    cells: Array.from(shape.cells),
    letter: shape.letter ?? '',
    history,
    createdAt: Date.now(),
  }
  const shapes = getSavedShapes()
  shapes.unshift(entry)
  writeStorage(STORAGE_KEY, STORAGE_VERSION, shapes)
  return entry
}

export function deleteSavedShape(id: string) {
  const shapes = getSavedShapes().filter((s) => s.id !== id)
  writeStorage(STORAGE_KEY, STORAGE_VERSION, shapes)
}
