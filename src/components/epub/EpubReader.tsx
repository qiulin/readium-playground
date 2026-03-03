import { useEffect, useRef, useState, useCallback } from 'react'
import type { Book, DisplayMode, TocItem, Theme, FontSize } from '#/types/epub'
import {
  loadEpub,
  renderTo,
  renderScrolled,
  display,
  next,
  prev,
  destroy,
  getToc,
} from '#/services/epub/renderer'
import { getPreferences, setTheme, setFontSize } from '#/services/storage/preferences'
import { TableOfContents } from './TableOfContents'
import { ProgressBar } from './ProgressBar'
import { Sun, Moon, BookOpen, ArrowLeft } from 'lucide-react'

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
  const [percentage, setPercentage] = useState(0)

  // Theme and font size state
  const [theme, setThemeState] = useState<Theme>('light')
  const [fontSize, setFontSizeState] = useState<FontSize>('medium')
  const [controlsVisible, setControlsVisible] = useState(true)
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load user preferences on mount
  useEffect(() => {
    const loadPrefs = async () => {
      const prefs = await getPreferences()
      setThemeState(prefs.theme)
      setFontSizeState(prefs.fontSize)
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', prefs.theme)
    }
    loadPrefs()
  }, [])

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    const resetControlsTimer = () => {
      setControlsVisible(true)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false)
      }, 3000)
    }

    const handleUserActivity = () => {
      resetControlsTimer()
    }

    // Start the timer on mount
    resetControlsTimer()

    // Listen for user activity
    document.addEventListener('mousemove', handleUserActivity)
    document.addEventListener('click', handleUserActivity)
    document.addEventListener('keydown', handleUserActivity)

    return () => {
      document.removeEventListener('mousemove', handleUserActivity)
      document.removeEventListener('click', handleUserActivity)
      document.removeEventListener('keydown', handleUserActivity)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prev()
      } else if (e.key === 'ArrowRight') {
        next()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

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

  const handleThemeChange = useCallback(async (newTheme: Theme) => {
    setThemeState(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    await setTheme(newTheme)
  }, [])

  const handleFontSizeChange = useCallback(async (newFontSize: FontSize) => {
    setFontSizeState(newFontSize)
    await setFontSize(newFontSize)
  }, [])

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return 'reader-font-small'
      case 'large':
        return 'reader-font-large'
      default:
        return 'reader-font-medium'
    }
  }

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
    <div className="flex flex-col h-full reader-container">
      {/* Header */}
      <div
        className={`flex items-center justify-between p-2 border-b reader-controls ${!controlsVisible ? 'hidden' : ''}`}
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--line)' }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded shadow"
            style={{ backgroundColor: 'var(--surface-strong)', color: 'var(--sea-ink)' }}
            title="Back to Library"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={() => setShowToc(!showToc)}
            className="px-3 py-1 text-sm rounded shadow"
            style={{ backgroundColor: 'var(--surface-strong)', color: 'var(--sea-ink)' }}
          >
            ☰ TOC
          </button>
        </div>

        <span className="text-sm truncate max-w-xs" style={{ color: 'var(--sea-ink)' }}>
          {book.title}
        </span>

        <div className="flex items-center gap-2">
          {/* Theme buttons */}
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-2 rounded shadow ${theme === 'light' ? 'ring-2 ring-blue-500' : ''}`}
            style={{ backgroundColor: 'var(--surface-strong)', color: 'var(--sea-ink)' }}
            title="Light theme"
          >
            <Sun size={16} />
          </button>
          <button
            onClick={() => handleThemeChange('sepia')}
            className={`p-2 rounded shadow ${theme === 'sepia' ? 'ring-2 ring-blue-500' : ''}`}
            style={{ backgroundColor: '#F4ECD8', color: '#5B4636' }}
            title="Sepia theme"
          >
            <BookOpen size={16} />
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-2 rounded shadow ${theme === 'dark' ? 'ring-2 ring-blue-500' : ''}`}
            style={{ backgroundColor: 'var(--surface-strong)', color: 'var(--sea-ink)' }}
            title="Dark theme"
          >
            <Moon size={16} />
          </button>

          {/* Font size buttons */}
          <button
            onClick={() => handleFontSizeChange('small')}
            className={`px-2 py-1 text-sm rounded shadow ${fontSize === 'small' ? 'ring-2 ring-blue-500' : ''}`}
            style={{ backgroundColor: 'var(--surface-strong)', color: 'var(--sea-ink)' }}
            title="Small font"
          >
            A
          </button>
          <button
            onClick={() => handleFontSizeChange('medium')}
            className={`px-2 py-1 text-base rounded shadow ${fontSize === 'medium' ? 'ring-2 ring-blue-500' : ''}`}
            style={{ backgroundColor: 'var(--surface-strong)', color: 'var(--sea-ink)' }}
            title="Medium font"
          >
            A
          </button>
          <button
            onClick={() => handleFontSizeChange('large')}
            className={`px-2 py-1 text-lg rounded shadow ${fontSize === 'large' ? 'ring-2 ring-blue-500' : ''}`}
            style={{ backgroundColor: 'var(--surface-strong)', color: 'var(--sea-ink)' }}
            title="Large font"
          >
            A
          </button>

          <button
            onClick={handleDisplayModeToggle}
            className="px-3 py-1 text-sm rounded shadow"
            style={{ backgroundColor: 'var(--surface-strong)', color: 'var(--sea-ink)' }}
            title="Toggle display mode"
          >
            {displayMode === 'paginated' ? '📄' : '📜'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* TOC Sidebar */}
        {showToc && (
          <div
            className="w-64 border-r overflow-y-auto"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--line)' }}
          >
            <TableOfContents items={toc} onSelect={handleTocSelect} />
          </div>
        )}

        {/* Reader */}
        <div className="flex-1 relative">
          {/* Edge click zones */}
          <div
            className="reader-nav-edge reader-nav-edge-left"
            onClick={handlePrev}
            title="Previous page"
          />
          <div
            className="reader-nav-edge reader-nav-edge-right"
            onClick={handleNext}
            title="Next page"
          />

          {isLoading && (
            <div
              className="absolute inset-0 flex items-center justify-center z-10"
              style={{ backgroundColor: 'var(--bg-base)' }}
            >
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          )}
          <div
            ref={containerRef}
            className={`h-full w-full reader-content ${getFontSizeClass()}`}
            tabIndex={0}
            style={{
              backgroundColor: 'var(--bg-base)',
              color: 'var(--sea-ink)',
            }}
          />
        </div>
      </div>

      {/* Footer / Navigation */}
      <div
        className={`p-2 border-t reader-controls ${!controlsVisible ? 'hidden' : ''}`}
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--line)' }}
      >
        <ProgressBar percentage={percentage} />

        <div className="flex items-center justify-between mt-2">
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded shadow hover:opacity-80"
            style={{ backgroundColor: 'var(--surface-strong)', color: 'var(--sea-ink)' }}
          >
            ← Previous
          </button>

          <span className="text-sm" style={{ color: 'var(--sea-ink-soft)' }}>
            {Math.round(percentage)}%
          </span>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded shadow hover:opacity-80"
            style={{ backgroundColor: 'var(--surface-strong)', color: 'var(--sea-ink)' }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
