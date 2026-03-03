import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useStore } from '@tanstack/react-store'
import { parseEpub } from '#/services/epub/parser'
import { getBooks, addBook, removeBook as removeBookFromStorage, getEpubBlob, addCover, getCover } from '#/services/storage/library'
import { getProgress, saveProgress } from '#/services/storage/progress'
import { libraryStore, libraryActions } from '#/stores/library'
import { FileImporter } from '#/components/epub/FileImporter'
import { BookCard } from '#/components/epub/BookCard'
import type { Book, ReadingProgress } from '#/types/epub'

export const Route = createFileRoute('/library')({
  component: LibraryPage,
})

function LibraryPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgressState] = useState<Record<string, ReadingProgress>>({})
  const [covers, setCovers] = useState<Record<string, string>>({})

  // Subscribe to store
  const books = useStore(libraryStore, (state) => state.books) ?? []

  // Load books on mount
  useEffect(() => {
    const loadBooks = async () => {
      const storedBooks = await getBooks()
      libraryActions.setBooks(storedBooks)

      // Load progress and cover for each book
      const progressMap: Record<string, ReadingProgress> = {}
      const coverMap: Record<string, string> = {}
      for (const book of storedBooks) {
        const p = await getProgress(book.id)
        if (p) progressMap[book.id] = p

        const coverUrl = await getCover(book.id)
        if (coverUrl) coverMap[book.id] = coverUrl
      }
      setProgressState(progressMap)
      setCovers(coverMap)
    }

    loadBooks()
  }, [])

  const handleFileSelected = async (file: File) => {
    setIsLoading(true)

    try {
      const { book, blob, coverBlob, coverMimeType } = await parseEpub(file)
      await addBook(book, blob)
      libraryActions.addBook(book)

      // Save cover if available
      if (coverBlob && coverMimeType) {
        await addCover(book.id, coverBlob, coverMimeType)
        const coverUrl = URL.createObjectURL(coverBlob)
        setCovers((prev) => ({ ...prev, [book.id]: coverUrl }))
      }

      // Initialize progress
      const initialProgress: ReadingProgress = {
        bookId: book.id,
        percentage: 0,
        updatedAt: Date.now(),
      }
      await saveProgress(initialProgress)
      setProgressState((prev) => ({ ...prev, [book.id]: initialProgress }))
    } catch (error) {
      console.error('Failed to import book:', error)
      alert('Failed to import book. Please try another file.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookClick = async (book: Book) => {
    // Save last opened book
    const blob = await getEpubBlob(book.id)
    if (blob) {
      // Store blob URL for reader
      sessionStorage.setItem(`epub-${book.id}`, URL.createObjectURL(blob))
      navigate({ to: '/reader/$bookId', params: { bookId: book.id } })
    }
  }

  const handleRemoveBook = async (bookId: string) => {
    if (confirm('Are you sure you want to remove this book?')) {
      await removeBookFromStorage(bookId)
      libraryActions.removeBook(bookId)
      setProgressState((prev) => {
        const next = { ...prev }
        delete next[bookId]
        return next
      })
    }
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1 className="text-3xl font-bold mb-8">My Library</h1>

      <div className="mb-8">
        <FileImporter onFileSelected={handleFileSelected} isLoading={isLoading} />
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Your library is empty.</p>
          <p className="text-gray-400 text-sm mt-2">
            Import an EPUB file to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              progress={progress[book.id]}
              coverUrl={covers[book.id]}
              onClick={() => handleBookClick(book)}
              onRemove={() => handleRemoveBook(book.id)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
