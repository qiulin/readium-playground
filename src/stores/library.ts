import { createStore } from '@tanstack/react-store'
import type { Book, ReadingProgress, DisplayMode } from '#/types/epub'

interface LibraryState {
  books: Book[]
  currentBookId: string | null
  progress: Record<string, ReadingProgress>
  displayMode: DisplayMode
  isLoading: boolean
  error: string | null
}

const defaultState: LibraryState = {
  books: [],
  currentBookId: null,
  progress: {},
  displayMode: 'paginated',
  isLoading: false,
  error: null,
}

export const libraryStore = createStore<LibraryState>({
  name: 'library-store',
  defaultState,
})

export const libraryActions = {
  setBooks(books: Book[]) {
    libraryStore.setState({ books })
  },

  addBook(book: Book) {
    libraryStore.setState((state) => ({
      books: [book, ...state.books],
    }))
  },

  removeBook(bookId: string) {
    libraryStore.setState((state) => ({
      books: state.books.filter((b) => b.id !== bookId),
      currentBookId: state.currentBookId === bookId ? null : state.currentBookId,
    }))
  },

  setCurrentBook(bookId: string | null) {
    libraryStore.setState({ currentBookId: bookId })
  },

  setProgress(progress: ReadingProgress) {
    libraryStore.setState((state) => ({
      progress: {
        ...state.progress,
        [progress.bookId]: progress,
      },
    }))
  },

  setDisplayMode(mode: DisplayMode) {
    libraryStore.setState({ displayMode: mode })
  },

  setLoading(isLoading: boolean) {
    libraryStore.setState({ isLoading })
  },

  setError(error: string | null) {
    libraryStore.setState({ error })
  },

  clearError() {
    libraryStore.setState({ error: null })
  },
}
