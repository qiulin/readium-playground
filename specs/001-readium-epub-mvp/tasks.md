# Tasks: Readium EPUB Reader MVP

**Feature**: 001-readium-epub-mvp | **Generated**: 2026-03-03
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

## Implementation Phases

- **Phase 1**: Setup (project initialization)
- **Phase 2**: Foundational (shared infrastructure)
- **Phase 3**: User Story 1 - Import EPUB (P1)
- **Phase 4**: User Story 2 - Read EPUB Content (P1)
- **Phase 5**: User Story 3 - Navigate Within Book (P2)
- **Phase 6**: User Story 4 - Manage Imported Books (P3)
- **Phase 7**: Polish & Cross-Cutting

## Phase 1: Setup

- [x] T001 Install @readium/js and idb dependencies: `pnpm add @readium/js idb`
- [x] T002 Create TypeScript types in src/types/epub.ts (Book, ReadingProgress, Library interfaces)
- [x] T003 Configure TanStack Router routes in src/router.tsx for /library and /reader/:bookId

## Phase 2: Foundational

- [x] T004 Create IndexedDB service in src/services/storage/db.ts (open, close, schemas)
- [x] T005 Create library storage service in src/services/storage/library.ts (addBook, getBooks, removeBook)
- [x] T006 Create TanStack Store in src/stores/library.ts for state management

## Phase 3: User Story 1 - Import EPUB (P1)

**Independent Test**: Select a local EPUB file and verify it's successfully loaded into the application.

### Implementation

- [x] T007 [P] [US1] Create EPUB parser service in src/services/epub/parser.ts (unzip, parse OPF, extract metadata)
- [x] T008 [P] [US1] Create file import component in src/components/epub/FileImporter.tsx (file picker + drag & drop)
- [x] T009 [US1] Implement import flow in src/routes/library.tsx (handle file selection, parse, save to IndexedDB)
- [x] T010 [US1] Add validation: check for valid EPUB MIME type and structure

## Phase 4: User Story 2 - Read EPUB Content (P1)

**Independent Test**: Open an imported EPUB and verify all content renders correctly.

### Implementation

- [x] T011 [P] [US2] Create EPUB renderer service in src/services/epub/renderer.ts (fetch resources, inject into iframe)
- [x] T012 [P] [US2] Create EpubReader main component in src/components/epub/EpubReader.tsx
- [x] T013 [US2] Implement content rendering with paginated mode in EpubReader.tsx
- [x] T014 [US2] Implement content rendering with scrolled mode in EpubReader.tsx
- [x] T015 [US2] Add display mode toggle (paginated vs scrolled)
- [x] T016 [US2] Create progress tracking service in src/services/storage/progress.ts

## Phase 5: User Story 3 - Navigate Within Book (P2)

**Independent Test**: Verify navigation controls work correctly within an open book.

### Implementation

- [x] T017 [P] [US3] Extract and store Table of Contents in src/services/epub/toc.ts
- [x] T018 [US3] Create TableOfContents component in src/components/epub/TableOfContents.tsx
- [x] T019 [US3] Implement chapter navigation (jump to section)
- [x] T020 [US3] Create ProgressBar component in src/components/epub/ProgressBar.tsx
- [x] T021 [US3] Add next/previous navigation controls

## Phase 6: User Story 4 - Manage Imported Books (P3)

**Independent Test**: Import multiple books and verify they can be managed.

### Implementation

- [x] T022 [P] [US4] Create book card component in src/components/epub/BookCard.tsx
- [x] T023 [US4] Update library route to display all books with covers
- [x] T024 [US4] Implement remove book functionality
- [x] T025 [US4] Add "open at last position" logic when selecting a book

## Phase 7: Polish & Cross-Cutting

- [x] T026 Add loading states and error handling UI
- [x] T027 Add empty state for library (no books yet)
- [x] T028 Test performance against success criteria (<5s import, <2s navigation)

---

## Dependencies

```
Phase 1 (Setup)
  └─ Phase 2 (Foundational)
       ├─ Phase 3 (US1: Import) - BLOCKED by Phase 2
       ├─ Phase 4 (US2: Read)   - BLOCKED by Phase 2 + Phase 3
       ├─ Phase 5 (US3: Navigate) - BLOCKED by Phase 2 + Phase 4
       └─ Phase 6 (US4: Manage)   - BLOCKED by Phase 2 + Phase 3
```

## Parallel Opportunities

- **T002, T003**: Can run in parallel (Setup tasks)
- **T007, T008**: Can run in parallel (US1 implementation)
- **T011, T012**: Can run in parallel (US2 implementation)
- **T017, T018**: Can run in parallel (US3 implementation)
- **T022, T023**: Can run in parallel (US4 implementation)

## MVP Scope

**User Story 1 (Import EPUB)** is the MVP scope. This alone provides value: users can import EPUB files from their local device.

## Summary

| Phase | Description | Tasks |
|-------|-------------|-------|
| 1 | Setup | 3 |
| 2 | Foundational | 3 |
| 3 | US1 - Import | 4 |
| 4 | US2 - Read | 6 |
| 5 | US3 - Navigate | 5 |
| 6 | US4 - Manage | 4 |
| 7 | Polish | 3 |
| **Total** | | **28** |
