# Architecture

This document defines what good work means in the Phily repo. Reviewers evaluate
code against it.

## Stack

- **Framework:** Next.js 15 (Pages Router, SSG/SSR).
- **UI:** React 18, Tailwind CSS 3, DaisyUI 4 / react-daisyui.
- **Visualization:** D3.js 7 (cluster/tree layouts, SVG, zoom).
- **State:** Redux Toolkit — slices for `tree`, `file`, `error`, `dashboard`, `submenu`, `selection`.
- **Validation:** Zod schemas on all file inputs.
- **Sharing:** LZ-String compression for URL-encoded trees.
- **Runtime:** Node.js (dev), Bun (Docker image).

## Principles

1. **Layering.** UI components in `src/components/**`; reusable logic in co-located
   `hooks/` folders; tree domain logic in `src/lib/TreeData.js`; pages and API
   routes in `src/pages/**`. Keep D3 rendering isolated in `src/components/dendrogram/`.
2. **Hooks pattern.** Business logic lives in custom hooks (`useUpload`, `useStyle`,
   `useDownload`, `useDendrogramForm`, ...), not inline in components.
3. **Redux slices.** One slice per domain at `src/components/store/<domain>/slice.js`.
   Preserve the RESET action pattern. Immutable/serializable checks are intentionally
   disabled because D3 objects are not serializable — do not re-enable them blindly.
4. **Validation at the boundary.** Every uploaded/parsed file passes a Zod schema before
   it reaches Redux or D3.
5. **Explicit errors.** Failures surface through the `error` slice and the error modal,
   not silent catches.
6. **Path alias.** Import via `@/*` → `./src/*`.

## Data Flow

User input → component → custom hook → Zod validation → Redux dispatch →
selector → D3 render (SVG). Export reverses the tail: SVG extraction → format
conversion → download blob. Sharing: tree JSON → LZ-String → URL param → decompress.

## Dependency Policy

- Do not add dependencies without a stated reason. Prefer the existing stack
  (D3, Redux Toolkit, Zod, DaisyUI) before introducing new libraries.

## What Not To Do

- Do not break the D3 rendering pipeline (`useMemo` + `ref` pattern).
- Do not mutate tree topology inside styling code paths.
- Do not bypass Zod validation on file inputs.
- Do not introduce XSS via unsanitized SVG/string injection.
- Do not hardcode theme colors; use the DaisyUI custom theme.
