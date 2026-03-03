# Data Model: Readium EPUB Reader MVP

## Entities

### Book

```typescript
interface Book {
  id: string;                    // UUID
  title: string;                  // From OPF metadata
  author: string;                // From OPF metadata
  coverUrl?: string;             // Base64 or blob URL
  addedAt: number;               // Timestamp
  fileSize: number;              // Bytes
}
```

### ReadingProgress

```typescript
interface ReadingProgress {
  bookId: string;
  percentage: number;             // 0-100
  epubCfi?: string;              // Format-specific: EPUB CFI
  htmlScrollOffset?: number;     // Format-specific: HTML scroll
  pdfPageNumber?: number;        // Format-specific: PDF page
  updatedAt: number;             // Timestamp
}
```

### Library

```typescript
interface Library {
  books: Book[];
  lastOpenedBookId?: string;
}
```

## Relationships

- **Book** 1:N **ReadingProgress** (one progress per book)
- **Library** 1:N **Book** (collection of books)

## Storage Schema (IndexedDB)

### Stores

1. `books` - Book metadata
2. `epubBlobs` - Raw EPUB file blobs
3. `progress` - Reading progress per book

## State Transitions

```
Library: Empty → Book Added → Book Opened → Reading → Progress Updated
                                ↓
                         Book Removed
```
