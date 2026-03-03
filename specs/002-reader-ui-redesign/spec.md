# Feature Specification: Reader UI Redesign

**Feature Branch**: `002-reader-ui-redesign`
**Created**: 2026-03-03
**Status**: Draft
**Input**: User description: "使用 frontend-design 技能重新设计页面展示样式，使其更符合阅读器的使用体验，并使用 playwright 来验证你的修改"

## Clarifications

### Session 2026-03-03

- Q: Error handling when theme preference cannot be saved → A: Default to light mode, show subtle indicator (non-intrusive toast or icon)
- Q: Accessibility requirements → A: Basic accessibility (keyboard navigation, focus indicators, basic ARIA)
- Q: Typography customization → A: Yes, 3 preset sizes (small, medium, large)
- Q: Explicit out-of-scope declarations → A: No explicit exclusions needed
- Q: Remove unnecessary demo pages and links → A: Add as part of reader UI redesign (remove demo/store pages, clean up navigation)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Immersive Reading Experience (Priority: P1)

As a reader, I want a distraction-free reading interface with comfortable typography and spacing, so I can focus on reading for extended periods without eye strain.

**Why this priority**: Core reading experience is the primary value proposition of an e-reader. Without comfortable reading presentation, users will not use the application.

**Independent Test**: Can be tested by opening any book and verifying that the content displays with appropriate font size, line height, margins, and contrast for comfortable reading.

**Acceptance Scenarios**:

1. **Given** a book is loaded, **When** the reader displays content, **Then** text should have appropriate font size (16-20px base), line height (1.5-1.8), and paragraph margins
2. **Given** a reader is displayed, **When** the user reads for extended periods, **Then** the interface should minimize chrome and distractions
3. **Given** a reader is displayed, **When** content is shown, **Then** background should be soft and non-reflective (off-white or sepia in light mode)

---

### User Story 2 - Reading Theme Customization (Priority: P2)

As a reader, I want to switch between light, dark, and sepia themes, so I can read comfortably in different lighting conditions (bright sunlight, dim room, night).

**Why this priority**: Different lighting conditions require different color schemes. This is a standard e-reader feature that significantly impacts user comfort.

**Independent Test**: Can be tested by toggling themes and verifying background and text colors change appropriately for each mode.

**Acceptance Scenarios**:

1. **Given** the reader is displayed in light mode, **When** user switches to dark mode, **Then** background becomes dark (#1a1a1a) and text becomes light (#e0e0e0)
2. **Given** the reader is displayed in light mode, **When** user switches to sepia mode, **Then** background becomes warm sepia (#f4ecd8) and text becomes dark brown (#5b4636)
3. **Given** a theme is selected, **When** the user returns to the reader, **Then** the selected theme persists

---

### User Story 3 - Improved Navigation Controls (Priority: P3)

As a reader, I want intuitive and unobtrusive navigation controls, so I can easily move between pages without disrupting my reading flow.

**Why this priority**: Navigation is essential but should not compete with content for attention. Controls should be accessible when needed and hidden when not.

**Acceptance Scenarios**:

1. **Given** the reader is open, **When** user clicks/taps near the edges, **Then** page turns (previous on left, next on right)
2. **Given** the reader has navigation controls visible, **When** user is actively reading, **Then** controls auto-hide after 3 seconds of inactivity
3. **Given** controls are hidden, **When** user moves mouse or taps screen, **Then** controls reappear temporarily

---

### User Story 4 - Progress Visibility (Priority: P3)

As a reader, I want to see my reading progress without explicit action, so I can gauge how much content remains.

**Why this priority**: Knowing remaining content helps readers decide whether to continue or take a break.

**Acceptance Scenarios**:

1. **Given** a book is open, **When** user scrolls or turns pages, **Then** a subtle progress indicator shows current position
2. **Given** progress is displayed, **When** user reads, **Then** percentage and chapter information is visible but non-intrusive

---

### User Story 5 - Clean Navigation (Priority: P2)

As a user, I want a minimal navigation with only essential links, so I can quickly access the library and reader without distraction.

**Why this priority**: Demo pages are not part of the core reading experience and should be removed to maintain focus.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** navigation is displayed, **Then** only Library and Reader links are visible (no demo/store links)
2. **Given** demo pages exist, **When** user navigates, **Then** demo routes should return 404 or redirect to Library

---

### Edge Cases

- Theme preference cannot be saved (IndexedDB unavailable): Default to light mode, show subtle indicator
- Reader opened without prior theme preference: Default to light mode

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Reader MUST display content with comfortable typography including appropriate font size, line height, and paragraph spacing
- **FR-002**: Reader MUST support at least three themes: light mode (light background, dark text), dark mode (dark background, light text), and sepia mode (warm background, brown text)
- **FR-003**: Reader MUST allow users to switch between themes via a visible control
- **FR-004**: Reader MUST provide navigation controls (previous/next) that are accessible but can be hidden
- **FR-005**: Reader MUST display reading progress as a percentage and/or visual indicator
- **FR-006**: Reader MUST allow navigation via click/tap on left (previous) and right (next) edge regions
- **FR-007**: Reader MUST minimize visual chrome during active reading to maximize content area
- **FR-008**: Reader MUST persist theme preference for future sessions
- **FR-009**: Reader MUST support basic accessibility including keyboard navigation and focus indicators
- **FR-010**: Reader MUST allow users to choose from 3 font size presets (small, medium, large)
- **FR-011**: System MUST remove demo/store pages and related navigation links
- **FR-012**: System MUST provide clean, minimal navigation with only essential links (Library, Reader)

### Key Entities *(include if feature involves data)*

- **Reading Theme**: User preference defining colors for background, text, and accents
- **Reading Progress**: Current position in the book expressed as percentage and/or location

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can read content without visible interface elements competing for attention (chrome-free reading)
- **SC-002**: Theme switching completes in under 200ms with no visible flicker
- **SC-003**: Navigation via edge tap/click responds within 100ms
- **SC-004**: 100% of readers can successfully switch between all three themes and see appropriate color changes
- **SC-005**: Progress indicator updates accurately within 500ms of page turn/scroll
