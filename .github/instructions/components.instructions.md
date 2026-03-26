---
description: "Use when creating or modifying React components, hooks, or Redux slices. Covers component patterns, hook conventions, and state management."
applyTo: "src/components/**"
---

# Component & Hook Conventions

## Component Structure

- Each component lives in its own folder: `src/components/<name>/<name>.js`
- Business logic goes in co-located `hooks/` directory
- Validators go in `validators/` directory (Zod schemas)

## Hook Patterns

- One hook per concern (upload, download, style, form, etc.)
- Hooks dispatch Redux actions and return UI state/handlers
- Use `useDeferredValue` for performance-critical updates (style changes)
- Export hooks from `hooks/index.js` barrel files when multiple hooks exist

## Redux Slices

- Location: `src/components/store/<domain>/slice.js`
- Use `createSlice` from Redux Toolkit
- Export individual actions and the reducer
- Reset pattern: every slice handles a `RESET` action type

## State Shape

| Slice | Key State |
|-------|-----------|
| tree | name, normalize, curveType, angle, width, height, globalStyles, tree |
| file | name, content, extension |
| error | message, open |
| dashboard | isHamburgerMenuActive |
| submenu | pointerX, pointerY, component, typeElement, toggled |

## D3 Integration

- D3 renders inside `useMemo` to avoid unnecessary re-renders
- D3 selections manipulate SVG DOM directly within React refs
- Event handlers (right-click context menu) bridge D3 events to Redux dispatches
