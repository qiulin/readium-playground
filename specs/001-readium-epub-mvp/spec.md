# Feature Specification: Readium EPUB Reader MVP

**Feature Branch**: `001-readium-epub-mvp`
**Created**: 2026-03-03
**Status**: Draft
**Input**: User description: "实现一个 readium MVP，从本地导入 EPUB 文档，然后显示文档，参考 https://github.com/edrlab/thorium-web/tree/develop/docs/packages"

## Clarifications

### Session 2026-03-03

- Q: What platform should this EPUB reader run on? → A: Web App (browser-based)
- Q: How should reading progress be tracked (considering future HTML/PDF support)? → A: Percentage + format-specific data (generic percentage + CFI for EPUB, scroll offset for HTML, page number for PDF)
- Q: How should library and progress be persisted? → A: IndexedDB (Web API, 50MB+ storage)
- Q: How should EPUB content be displayed? → A: Both modes (paginated and scrolled, user-selectable)
- Q: How should users import EPUB files? → A: Both file picker and drag & drop
- Q: How should imported EPUB files be stored internally? → A: Single File (Blob reference) - extracted on demand
- Q: What framework should be used? → A: TanStack Start (no NextJS)

## User Scenarios & Testing

### User Story 1 - Import EPUB File (Priority: P1)

As a user, I want to import an EPUB file from my local device so that I can read it in the application.

**Why this priority**: Without the ability to import EPUB files, the application has no content to display. This is the foundational feature that enables all other functionality.

**Independent Test**: Can be tested by selecting a local EPUB file and verifying it is successfully loaded into the application.

**Acceptance Scenarios**:

1. **Given** the application is open, **When** I select a valid EPUB file from my device, **Then** the file is successfully imported and ready to read
2. **Given** the application is open, **When** I select a file that is not in EPUB format, **Then** the system displays an error message indicating invalid file type
3. **Given** the application is open, **When** I select a corrupted or invalid EPUB file, **Then** the system displays an appropriate error message

---

### User Story 2 - Read EPUB Content (Priority: P1)

As a user, I want to read the content of an imported EPUB book so that I can consume the text and media within.

**Why this priority**: Reading is the core purpose of an ebook reader. Without display functionality, the import feature has no value.

**Independent Test**: Can be tested by opening an imported EPUB and verifying all content renders correctly.

**Acceptance Scenarios**:

1. **Given** an EPUB file has been imported, **When** I open the book, **Then** the cover and title are displayed
2. **Given** an EPUB file has been imported, **When** I navigate through pages, **Then** text content displays correctly with proper formatting
3. **Given** an EPUB file has been imported, **When** I scroll through the content, **Then** images and embedded media render properly
4. **Given** an EPUB file has been imported, **When** I close and reopen the book, **Then** my reading position is preserved

---

### User Story 3 - Navigate Within Book (Priority: P2)

As a user, I want to navigate within the EPUB book so that I can find and access specific content.

**Why this priority**: Users need to move between chapters, search for content, and track their reading progress.

**Independent Test**: Can be tested by verifying navigation controls work correctly within an open book.

**Acceptance Scenarios**:

1. **Given** an EPUB is open, **When** I access the table of contents, **Then** all chapters and sections are listed
2. **Given** an EPUB is open, **When** I tap on a chapter in the table of contents, **Then** the reader jumps to that section
3. **Given** an EPUB is open, **When** I use next/previous controls, **Then** I can move between pages or sections
4. **Given** an EPUB is open, **When** I view the progress indicator, **Then** I can see my current position in the book

---

### User Story 4 - Manage Imported Books (Priority: P3)

As a user, I want to manage my imported books so that I can organize my reading library.

**Why this priority**: Users accumulate multiple books and need to organize and access them efficiently.

**Independent Test**: Can be tested by importing multiple books and verifying they can be managed.

**Acceptance Scenarios**:

1. **Given** multiple books have been imported, **When** I view my library, **Then** all imported books are listed with cover and title
2. **Given** a book is in my library, **When** I select it, **Then** the book opens at my last reading position
3. **Given** a book is in my library, **When** I choose to remove it, **Then** the book is deleted from the library

---

### Edge Cases

- What happens when the EPUB file is extremely large (over 100MB)?
- How does the system handle EPUB files with DRM or encryption?
- What happens when device storage is full during import?
- How are EPUB files with non-Latin character encodings handled?
- What happens when the EPUB has malformed or missing required files (OPF, NCX)?

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow users to select EPUB files from local device storage
- **FR-002**: System MUST validate that selected files are valid EPUB format
- **FR-003**: System MUST parse EPUB package structure (OPF, manifest, spine)
- **FR-004**: System MUST render EPUB content (XHTML, CSS, images) for reading
- **FR-005**: System MUST provide navigation controls (next/previous page or section)
- **FR-006**: System MUST display table of contents extracted from EPUB
- **FR-007**: System MUST allow users to jump to specific chapters from table of contents
- **FR-008**: System MUST persist reading progress (current position in book)
- **FR-009**: System MUST display book metadata (title, author, cover) in library view
- **FR-010**: System MUST maintain a library of imported books
- **FR-011**: System MUST allow users to remove books from library
- **FR-012**: System MUST display appropriate error messages for invalid or corrupted EPUB files

### Key Entities

- **EPUB Document**: Represents a complete EPUB book file, including metadata, manifest resources, and reading order
- **Library**: Collection of imported EPUB documents available to the user
- **Reading Session**: Tracks user's current position and progress within a specific book
- **Table of Contents**: Hierarchical navigation structure extracted from EPUB spine/NCX

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can successfully import a valid EPUB file within 5 seconds of selection
- **SC-002**: 95% of standard EPUB files render content correctly without errors
- **SC-003**: Users can navigate to any chapter from the table of contents in under 2 seconds
- **SC-004**: Reading position is preserved and restored when reopening a book
- **SC-005**: Users can successfully complete the core reading flow (import → read → navigate) with a single EPUB file
