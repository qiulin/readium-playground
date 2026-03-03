# Research: Readium EPUB Reader MVP

## Technology Decisions

### EPUB Parsing & Rendering

**Decision**: Use `epubjs` as the core EPUB engine

**Rationale**:
- Modern, maintained EPUB parsing library
- Good TypeScript support
- Supports both paginated and scrolled modes
- Easy to integrate with React

**Alternatives considered**:
- `@readium/js`: Not available in npm registry
- `epub.js` (deprecated): Old version, replaced by epubjs
- Custom implementation: Too complex for MVP

### Storage

**Decision**: IndexedDB via `idb` wrapper library

**Rationale**:
- Native browser API already in use
- `idb` provides Promise-based wrapper
- Sufficient for storing EPUB blobs and metadata

### State Management

**Decision**: TanStack Store (already in project)

**Rationale**:
- Already included in project dependencies
- Simple and lightweight
- Works well with TanStack Start

## Architecture

### Components

1. **EPUB Service** (`src/services/epub/`)
   - Parse EPUB files
   - Extract metadata, spine, TOC
   - Handle resource fetching

2. **Storage Service** (`src/services/storage/`)
   - IndexedDB operations
   - Book library management

3. **Reader Component** (`src/components/reader/`)
   - Content rendering
   - Navigation controls

4. **Library View** (`src/routes/library/`)
   - Book list display
   - Import controls

## Key Dependencies

- `@readium/js`: Core EPUB engine
- `idb`: IndexedDB wrapper
- `react`: Already in project

## Unknowns Resolved

All technical decisions have been made based on the clarifications and existing project setup.
