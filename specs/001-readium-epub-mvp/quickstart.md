# Quickstart: Readium EPUB Reader MVP

## Prerequisites

- Node.js 18+
- pnpm (already in project)

## Installation

```bash
cd D:/Codes/qiulin/readium-playground
pnpm install
```

## Development

```bash
pnpm dev
```

Opens at http://localhost:3000

## Key Commands

- `pnpm dev` - Start dev server
- `pnpm build` - Production build
- `pnpm test` - Run tests

## Architecture Overview

1. **Library View** (`/library`) - Import and browse books
2. **Reader View** (`/reader/:bookId`) - Read EPUB content
3. **Services** - EPUB parsing, IndexedDB storage
4. **TanStack Store** - State management

## Next Steps

Run `/speckit.tasks` to generate implementation tasks.
