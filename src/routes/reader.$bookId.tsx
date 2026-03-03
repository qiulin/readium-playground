import { createFileRoute, useParams } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { useStore } from '@tanstack/react-store'
import { getBook, getEpubBlob } from '#/services/storage/library'
import { getProgress, saveProgress } from '#/services/storage/progress'
import { libraryStore, libraryActions } from '#/stores/library'
import { EpubReader } from '#/components/epub/EpubReader'
import type { Book, DisplayMode, ReadingProgress } from '#/types/epub'

export const Route = createFileRoute('/reader/$bookId')({
  component: ReaderPage,
})

function ReaderPage() {
  const { bookId } = useParams({ from: '/reader/$bookId' })
  const [book, setBook] = useState<Book | null>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const displayMode = useStore(libraryStore, (state) => state.displayMode)

  useEffect(() => {
    const loadBook = async () => {
      try {
        setIsLoading(true)

        const storedBook = await getBook(bookId)
        if (!storedBook) {
          setError('Book not found')
          setIsLoading(false)
          return
        }
        setBook(storedBook)

        // Get blob from session storage (set by library page)
        const blobUrl = sessionStorage.getItem(`epub-${bookId}`)
        if (blobUrl) {
          const response = await fetch(blobUrl)
          const epubBlob = await response.blob()
          setBlob(epubBlob)
        } else {
          // Try to get from IndexedDB
          const epubBlob = await getEpubBlob(bookId)
          if (epubBlob) {
            setBlob(epubBlob)
          } else {
            setError('Book file not found')
          }
        }

        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load book')
        setIsLoading(false)
      }
    }

    loadBook()
  }, [bookId])

  const handleDisplayModeChange = useCallback(
    (mode: DisplayMode) => {
      libraryActions.setDisplayMode(mode)
    },
    []
  )

  const handleProgressChange = useCallback(
    async (percentage: number) => {
      if (!book) return

      const progress: ReadingProgress = {
        bookId: book.id,
        percentage,
        updatedAt: Date.now(),
      }

      await saveProgress(progress)
      libraryActions.setProgress(progress)
    },
    [book]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !book || !blob) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error || 'Failed to load book'}</p>
        <a
          href="/library"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Library
        </a>
      </div>
    )
  }

  return (
    <div className="h-screen">
      <EpubReader
        book={book}
        blob={blob}
        displayMode={displayMode}
        onDisplayModeChange={handleDisplayModeChange}
        onProgressChange={handleProgressChange}
      />
    </div>
  )
}
