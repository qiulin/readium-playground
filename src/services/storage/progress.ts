import { openDatabase } from './db'
import type { ReadingProgress } from '#/types/epub'

export async function saveProgress(progress: ReadingProgress): Promise<void> {
  const db = await openDatabase()
  await db.put('progress', {
    ...progress,
    updatedAt: Date.now(),
  })
}

export async function getProgress(bookId: string): Promise<ReadingProgress | undefined> {
  const db = await openDatabase()
  return db.get('progress', bookId)
}

export async function getAllProgress(): Promise<ReadingProgress[]> {
  const db = await openDatabase()
  return db.getAll('progress')
}
