import type { Book, EpubMetadata, TocItem } from '#/types/epub'

export async function parseEpub(file: File): Promise<{
  book: Book
  metadata: EpubMetadata
  toc: TocItem[]
  blob: Blob
  coverBlob?: Blob
  coverMimeType?: string
}> {
  // Use epubjs to load and parse the book
  const { Book } = await import('epubjs')

  const book = new Book(file)

  // Wait for book to be ready
  await book.ready

  // Get metadata
  const metadata = await book.loaded.metadata
  const epubMetadata: EpubMetadata = {
    title: metadata.title || file.name.replace('.epub', ''),
    author: metadata.creator || 'Unknown Author',
    language: metadata.language,
    publisher: metadata.publisher,
    description: metadata.description,
  }

  // Get cover as blob
  let coverBlob: Blob | undefined
  let coverMimeType: string | undefined
  try {
    const cover = await book.loaded.cover
    if (cover) {
      // The cover URL is relative, try to fetch it as a blob
      const coverUrl = new URL(cover, URL.createObjectURL(file)).href
      const response = await fetch(coverUrl)
      if (response.ok) {
        const blob = await response.blob()
        coverBlob = blob
        coverMimeType = blob.type || 'image/jpeg'
      }
    }
  } catch {
    // No cover available
  }

  // Get table of contents
  const navigation = await book.loaded.navigation
  const toc: TocItem[] = []

  if (navigation.toc && navigation.toc.length > 0) {
    for (const item of navigation.toc) {
      toc.push({
        label: item.label,
        href: item.href,
        subitems: item.subitems?.length
          ? item.subitems.map((sub) => ({
              label: sub.label,
              href: sub.href,
            }))
          : undefined,
      })
    }
  }

  const bookEntity: Book = {
    id: crypto.randomUUID(),
    title: epubMetadata.title,
    author: epubMetadata.author,
    coverUrl: epubMetadata.coverUrl,
    addedAt: Date.now(),
    fileSize: file.size,
  }

  return {
    book: bookEntity,
    metadata: epubMetadata,
    toc,
    blob: file,
    coverBlob,
    coverMimeType,
  }
}

export function validateEpub(file: File): { valid: boolean; error?: string } {
  // Check file extension
  if (!file.name.toLowerCase().endsWith('.epub')) {
    return { valid: false, error: 'Invalid file type. Please select an EPUB file.' }
  }

  // Check file size (max 100MB)
  if (file.size > 100 * 1024 * 1024) {
    return { valid: false, error: 'File too large. Maximum size is 100MB.' }
  }

  return { valid: true }
}
