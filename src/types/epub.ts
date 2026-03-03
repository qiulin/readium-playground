// EPUB Reader Types

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  addedAt: number;
  fileSize: number;
}

export interface ReadingProgress {
  bookId: string;
  percentage: number;
  epubCfi?: string;
  htmlScrollOffset?: number;
  pdfPageNumber?: number;
  updatedAt: number;
}

export interface Library {
  books: Book[];
  lastOpenedBookId?: string;
}

export interface TocItem {
  label: string;
  href: string;
  subitems?: TocItem[];
}

export interface EpubMetadata {
  title: string;
  author: string;
  language?: string;
  publisher?: string;
  description?: string;
  coverUrl?: string;
}

export type DisplayMode = 'paginated' | 'scrolled';

// User Preferences for reader settings
export type Theme = 'light' | 'dark' | 'sepia';
export type FontSize = 'small' | 'medium' | 'large';

export interface UserPreferences {
  id: string;
  theme: Theme;
  fontSize: FontSize;
}
