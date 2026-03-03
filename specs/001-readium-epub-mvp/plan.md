# Implementation Plan: Readium EPUB Reader MVP

**Branch**: `001-readium-epub-mvp` | **Date**: 2026-03-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-readium-epub-mvp/spec.md`

## Summary

Build a web-based EPUB reader MVP using TanStack Start that allows users to import EPUB files from local storage, read them with pagination/scrolling modes, navigate via table of contents, and track reading progress. Storage uses IndexedDB; EPUB parsing via Readium.

## Technical Context

**Language/Version**: TypeScript 5.7
**Primary Dependencies**: TanStack Start, React 19, epubjs, idb
**Storage**: IndexedDB (via idb wrapper)
**Testing**: Vitest
**Target Platform**: Web (browser-based)
**Project Type**: Web Application (SPA)
**Performance Goals**: Import <5s, Navigation <2s
**Constraints**: No NextJS, TanStack Start only
**Scale/Scope**: Single user, local-first

## Constitution Check

*No constitution file present - proceeding with standard practices*

## Project Structure

### Source Code (repository root)

```text
src/
├── components/
│   ├── epub/
│   │   ├── EpubReader.tsx      # Main reader component
│   │   ├── TableOfContents.tsx # TOC navigation
│   │   └── ProgressBar.tsx     # Reading progress
│   └── ui/
├── services/
│   ├── epub/
│   │   ├── parser.ts          # EPUB parsing
│   │   └── renderer.ts        # Content rendering
│   └── storage/
│       ├── db.ts              # IndexedDB setup
│       └── library.ts         # Book management
├── routes/
│   ├── library.tsx            # Book library view
│   └── reader.tsx            # Reader view
├── stores/
│   └── library.ts            # TanStack Store
└── types/
    └── epub.ts               # TypeScript types

tests/
├── unit/
└── integration/
```

### Contracts

No external API contracts - this is a local-first application.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations.

## Phase 0: Research

Research complete. See [research.md](./research.md).

## Phase 1: Design

Design complete. See [data-model.md](./data-model.md).
