import { openDB, type IDBPDatabase } from 'idb'
import type { Book, ReadingProgress, UserPreferences } from '#/types/epub'

const DB_NAME = 'readium-library'
const DB_VERSION = 3 // Bumped to add covers store

interface LibraryDB {
  books: Book
  epubBlobs: {
    key: string
    value: {
      bookId: string
      blob: Blob
      addedAt: number
    }
  }
  progress: ReadingProgress
  covers: {
    key: string
    value: {
      bookId: string
      blob: Blob
      mimeType: string
    }
  }
  preferences: UserPreferences
}

let dbInstance: IDBPDatabase<LibraryDB> | null = null

export async function openDatabase(): Promise<IDBPDatabase<LibraryDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<LibraryDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Books store
      if (!db.objectStoreNames.contains('books')) {
        const bookStore = db.createObjectStore('books', { keyPath: 'id' })
        bookStore.createIndex('title', 'title')
        bookStore.createIndex('author', 'author')
        bookStore.createIndex('addedAt', 'addedAt')
      }

      // EPUB blobs store
      if (!db.objectStoreNames.contains('epubBlobs')) {
        const blobStore = db.createObjectStore('epubBlobs', { keyPath: 'bookId' })
        blobStore.createIndex('addedAt', 'addedAt')
      }

      // Progress store
      if (!db.objectStoreNames.contains('progress')) {
        const progressStore = db.createObjectStore('progress', { keyPath: 'bookId' })
        progressStore.createIndex('updatedAt', 'updatedAt')
      }

      // Cover images store
      if (!db.objectStoreNames.contains('covers')) {
        db.createObjectStore('covers', { keyPath: 'bookId' })
      }

      // Preferences store
      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences', { keyPath: 'id' })
      }
    },
  })

  return dbInstance
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}
