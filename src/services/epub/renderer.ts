import type { TocItem } from '#/types/epub'

// EPUB.js Book type
type EpubBook = ReturnType<typeof import('epubjs')['Book']>
type EpubRendition = ReturnType<EpubBook['renderTo']>

let currentBook: EpubBook | null = null
let currentRendition: EpubRendition | null = null

export async function loadEpub(blob: Blob): Promise<void> {
  // Clean up previous book
  if (currentBook) {
    currentBook.destroy()
    currentBook = null
  }
  if (currentRendition) {
    currentRendition.destroy()
    currentRendition = null
  }

  const { Book } = await import('epubjs')
  currentBook = new Book(blob)

  await currentBook.ready
}

export function renderTo(
  container: HTMLElement,
  options?: {
    width?: number | string
    height?: number | string
    spread?: 'auto' | 'none' | 'always'
  }
): EpubRendition | null {
  if (!currentBook) return null

  currentRendition = currentBook.renderTo(container, {
    width: '100%',
    height: '100%',
    spread: options?.spread || 'auto',
    flow: 'paginated',
  })

  return currentRendition
}

export async function renderScrolled(container: HTMLElement): Promise<EpubRendition | null> {
  if (!currentBook) return null

  currentRendition = currentBook.renderTo(container, {
    width: '100%',
    height: '100%',
    flow: 'scrolled',
  })

  return currentRendition
}

export async function display(href?: string): Promise<void> {
  if (!currentRendition) return

  if (href) {
    await currentRendition.display(href)
  } else {
    await currentRendition.display()
  }
}

export async function next(): Promise<void> {
  if (!currentRendition) return
  await currentRendition.next()
}

export async function prev(): Promise<void> {
  if (!currentRendition) return
  await currentRendition.prev()
}

export function getCurrentLocation(): { href: string; index: number } | null {
  if (!currentRendition) return null

  const location = currentRendition.location
  if (!location) return null

  return {
    href: location.href,
    index: location.start?.index || 0,
  }
}

export async function getPercentage(): Promise<number> {
  if (!currentRendition) return 0

  const location = currentRendition.location
  if (!location) return 0

  return location.start.percentage || 0
}

export async function displayAt(percentage: number): Promise<void> {
  if (!currentRendition) return

  await currentRendition.display(percentage)
}

export function onRelocated(callback: (location: unknown) => void): () => void {
  if (!currentRendition) return () => {}

  currentRendition.on('relocated', callback)
  return () => {
    currentRendition?.off('relocated', callback)
  }
}

export function destroy(): void {
  if (currentRendition) {
    currentRendition.destroy()
    currentRendition = null
  }
  if (currentBook) {
    currentBook.destroy()
    currentBook = null
  }
}

export async function getToc(): Promise<TocItem[]> {
  if (!currentBook) return []

  const navigation = await currentBook.loaded.navigation
  if (!navigation.toc) return []

  return navigation.toc.map((item) => ({
    label: item.label,
    href: item.href,
    subitems: item.subitems?.map((sub) => ({
      label: sub.label,
      href: sub.href,
    })),
  }))
}

export { currentBook, currentRendition }
