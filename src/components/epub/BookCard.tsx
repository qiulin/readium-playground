import type { Book, ReadingProgress } from '#/types/epub'

interface BookCardProps {
  book: Book
  progress?: ReadingProgress
  onClick: () => void
  onRemove: () => void
}

export function BookCard({ book, progress, onClick, onRemove }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div
        className="aspect-[2/3] bg-gray-200 relative"
        onClick={onClick}
      >
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">📖</span>
          </div>
        )}

        {/* Remove button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          title="Remove book"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-3" onClick={onClick}>
        <h3 className="font-semibold text-gray-800 truncate" title={book.title}>
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 truncate" title={book.author}>
          {book.author}
        </p>

        {progress && (
          <div className="mt-2">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(progress.percentage)}% complete
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
