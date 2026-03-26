---
name: add-ui-component
description: "Add new UI components to the Phily dashboard or canvas. Use when creating new panels, controls, modals, input forms, or interactive elements using React, Tailwind, and DaisyUI."
---

# Add UI Component

## When to Use
- Adding new dashboard controls (search, filter, sort panels)
- Creating new modals or dialogs
- Adding toolbar buttons or icon actions
- Building new interactive panels (legend, metadata viewer, comparison view)

## Key Files
- [Dashboard](../../../src/components/dashboard/dashboard.js) — Main control panel
- [Canvas](../../../src/components/canvas/canvas.js) — Visualization area
- [Icons directory](../../../src/components/icons/) — SVG icon components
- [Store](../../../src/components/store/store.js) — Redux store configuration
- [Global styles](../../../src/styles/globals.css) — Tailwind base styles

## Component Pattern
```
src/components/<name>/
├── <name>.js        # Component JSX
└── hooks/
    └── use<Name>.js # Business logic hook
```

## Procedure

1. **Create component folder**: `src/components/<name>/`
2. **Create component file**: `<name>.js` with Tailwind + DaisyUI classes
3. **Extract logic**: Create `hooks/use<Name>.js` for state/dispatch logic
4. **Add Redux slice** (if new state needed): `src/components/store/<name>/slice.js`
   - Include initial state, reducers, and RESET handler
   - Register in `store.js`
5. **Wire into page**: Import in the target page or parent component
6. **Test**: `npm run dev` and verify rendering

## DaisyUI Component Usage
```jsx
// Buttons
<button className="btn btn-primary">Action</button>

// Cards
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">Content</div>
</div>

// Modals
<dialog className="modal">
  <div className="modal-box">Content</div>
</dialog>
```

## Theme Colors
| Token | Hex | Usage |
|-------|-----|-------|
| primary | `#498BCA` | Main actions |
| secondary | `#4CBFB7` | Secondary elements |
| base-100 | `#ffffe3` | Background |
| error | `#DE6F81` | Error states |

## Constraints
- Follow the hooks extraction pattern — no business logic in component JSX
- Use DaisyUI classes for consistent styling
- Add RESET handling if creating new Redux slices
- Icons go in `src/components/icons/` as separate components
