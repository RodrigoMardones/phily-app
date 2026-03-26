---
description: "Use when working on the Phily phylogenetic tree visualization app. Covers project architecture, tech stack, conventions, and data flow patterns."
applyTo: "**"
---

# Phily - Phylogenetic Tree Visualization App

## Overview

Phily is an open-source web app for visualizing and editing phylogenetic dendrograms. Users upload Newick (.nwk) or JSON files and interactively customize the resulting tree visualization.

## Tech Stack

- **Framework**: Next.js 15 (Pages Router, SSG/SSR)
- **UI**: React 18, Tailwind CSS 3, DaisyUI 4
- **Visualization**: D3.js 7 (dendrograms, SVG rendering, zoom)
- **State**: Redux Toolkit (5 slices: tree, file, error, dashboard, submenu)
- **Validation**: Zod schemas
- **Sharing**: LZ-String compression for URL-encoded trees
- **Runtime**: Bun (Docker), Node.js (dev)

## Architecture

```
src/
├── components/       # UI components with co-located hooks
│   ├── canvas/       # SVG canvas + zoom controls
│   ├── dashboard/    # Left sidebar: upload, style, config
│   │   ├── hooks/    # useUpload, useDownload, useStyle, useDendrogramForm, etc.
│   │   └── validators/  # Zod validation schemas
│   ├── dendrogram/   # D3-based tree rendering
│   ├── store/        # Redux store + slices (tree, file, error, dashboard, submenu)
│   ├── submenu/      # Right-click context menu for element editing
│   ├── error/        # Error modal
│   └── icons/        # SVG icon components
├── lib/              # TreeData class (TDA), demo datasets
├── pages/            # Next.js pages + API routes
│   ├── api/          # toJson (Newick→JSON), example (demo data)
│   └── dendrogram/   # URL-shared tree views
└── styles/           # Global Tailwind CSS
```

## Conventions

- **Hooks pattern**: Business logic extracted into custom hooks per component (`hooks/` subdirectory)
- **Redux slices**: One file per slice in `src/components/store/<domain>/slice.js`
- **Immutable/Serializable checks**: Disabled in Redux store (D3 objects are not serializable)
- **Path alias**: `@/*` → `./src/*`
- **Styles**: Tailwind utility classes inline; DaisyUI components for cards, buttons, modals
- **Custom theme**: primary `#498BCA`, secondary `#4CBFB7`, base `#ffffe3`, error `#DE6F81`

## Data Flow

1. **Upload**: File → FileReader → Zod validation → Parse (Newick or JSON) → Redux dispatch → Render
2. **Style changes**: Input → useStyle hook → Dispatch `setStyle` → Deferred update (2s debounce) → Re-render
3. **Element editing**: Right-click → SubMenu → modify node/label/edge → Update tree → Re-render
4. **Export**: Select format (PNG/JPG/SVG/JSON) → Extract SVG → Convert → Download blob
5. **URL sharing**: Tree JSON → LZ-String compress → URL param → Decompress on load

## Build & Run

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint
docker-compose up -d --build  # Docker deployment
```

## Security

- CSP headers via `next-secure-headers`
- Frame guard: deny
- Terser strips console.log in production
- Zod validation on all file inputs
