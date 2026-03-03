import { useEffect, useRef, useState, useCallback } from 'react'
import type { Book, DisplayMode, TocItem } from '#/types/epub'
import {
  loadEpub,
  renderTo,
  renderScrolled,
  display,
  next,
  prev,
  displayAt,
  onRelocated,
  destroy,
  getToc,
} from '#/services/epub/renderer'
import { TableOfContents } from './TableOfContents'
import { ProgressBar } from './ProgressBar'

interface EpubReaderProps {
  book: Book
  blob: Blob
  displayMode: DisplayMode
  onDisplayModeChange: (mode: DisplayMode) => void
  onProgressChange: (percentage: number) => void
}

export function EpubReader({
  book,
  blob,
  displayMode,
  onDisplayModeChange,
  onProgressChange,
}: EpubReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showToc, setShowToc] = useState(false)
  const [toc, setToc] = useState<TocItem[]>([])
  const [currentLocation, setCurrentLocation] = useState({ href: '', index: 0 })
  const [percentage, setPercentage] = useState(0)

  // Load EPUB
  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        setIsLoading(true)
        setError(null)

        await loadEpub(blob)

        if (!mounted) return

        const tableOfContents = await getToc()
        setToc(tableOfContents)

        if (containerRef.current) {
          const rendition =
            displayMode === 'scrolled'
              ? await renderScrolled(containerRef.current)
              : renderTo(containerRef.current)

          if (rendition) {
            rendition.on('relocated', (location: unknown) => {
              const loc = location as { href: string; start: { index: number; percentage: number } }
              setCurrentLocation({
                href: loc.href,
                index: loc.start?.index || 0,
              })
              setPercentage((loc.start?.percentage || 0) * 100)
              onProgressChange((loc.start?.percentage || 0) * 100)
            })

            await display()
          }
        }

        setIsLoading(false)
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load EPUB')
          setIsLoading(false)
        }
      }
    }

    init()

    return () => {
      mounted = false
      destroy()
    }
  }, [blob, displayMode, onProgressChange])

  const handleNext = useCallback(async () => {
    await next()
  }, [])

  const handlePrev = useCallback(async () => {
    await prev()
  }, [])

  const handleTocSelect = useCallback(async (href: string) => {
    await display(href)
    setShowToc(false)
  }, [])

  const handleDisplayModeToggle = useCallback(() => {
    onDisplayModeChange(displayMode === 'paginated' ? 'scrolled' : 'paginated')
  }, [displayMode, onDisplayModeChange])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
        <button
          onClick={() => setShowToc(!showToc)}
          className="px-3 py-1 text-sm bg-white rounded shadow"
        >
          ☰ TOC
        </button>

        <span className="text-sm truncate max-w-xs">{book.title}</span>

        <button
          onClick={handleDisplayModeToggle}
          className="px-3 py-1 text-sm bg-white rounded shadow"
        >
          {displayMode === 'paginated' ? '📄' : '📜'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* TOC Sidebar */}
        {showToc && (
          <div className="w-64 bg-white border-r overflow-y-auto">
            <TableOfContents items={toc} onSelect={handleTocSelect} />
          </div>
        )}

        {/* Reader */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          )}
          <div ref={containerRef} className="h-full w-full" />
        </div>
      </div>

      {/* Footer / Navigation */}
      <div className="p-2 bg-gray-100 border-t">
        <ProgressBar percentage={percentage} />

        <div className="flex items-center justify-between mt-2">
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-white rounded shadow hover:bg-gray-50"
          >
            ← Previous
          </button>

          <span className="text-sm text-gray-600">
            {Math.round(percentage)}%
          </span>

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-white rounded shadow hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
