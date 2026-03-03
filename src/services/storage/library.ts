import { openDatabase } from './db'
import type { Book } from '#/types/epub'

export async function addBook(book: Book, epubBlob: Blob): Promise<void> {
  const db = await openDatabase()

  // Add book metadata
  await db.put('books', book)

  // Add EPUB blob
  await db.put('epubBlobs', {
    bookId: book.id,
    blob: epubBlob,
    addedAt: Date.now(),
  })
}

export async function getBooks(): Promise<Book[]> {
  const db = await openDatabase()
  const books = await db.getAll('books')
  // Sort by added date, newest first
  return books.sort((a, b) => b.addedAt - a.addedAt)
}

export async function getBook(id: string): Promise<Book | undefined> {
  const db = await openDatabase()
  return db.get('books', id)
}

export async function removeBook(id: string): Promise<void> {
  const db = await openDatabase()

  await db.delete('books', id)
  await db.delete('epubBlobs', id)
  await db.delete('progress', id)
}

export async function getEpubBlob(bookId: string): Promise<Blob | undefined> {
  const db = await openDatabase()
  const result = await db.get('epubBlobs', bookId)
  return result?.blob
}

export async function addCover(bookId: string, coverBlob: Blob, mimeType: string): Promise<void> {
  const db = await openDatabase()
  await db.put('covers', {
    bookId,
    blob: coverBlob,
    mimeType,
  })
}

export async function getCover(bookId: string): Promise<string | undefined> {
  const db = await openDatabase()
  const result = await db.get('covers', bookId)
  if (result) {
    return URL.createObjectURL(result.blob)
  }
  return undefined
}
