# Readium Playground

A demo project for exploring and testing [Readium](https://readium.org/) implementations.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 to view the application.

## Building For Production

```bash
pnpm build
```

## Tech Stack

- [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- [TanStack Router](https://tanstack.com/router) - Type-safe routing
- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Available Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm test       # Run tests with Vitest
pnpm format     # Format code with Biome
pnpm lint       # Lint code with Biome
pnpm check      # Run all Biome checks
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── routes/           # Page routes (file-based routing)
├── lib/              # Utilities and stores
├── router.tsx        # Router configuration
├── styles.css        # Global styles
└── env.ts            # Environment variables
```
