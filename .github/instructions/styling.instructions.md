---
description: "Use when modifying styles, Tailwind configuration, DaisyUI theme, or CSS. Covers theming and styling approach."
applyTo: ["src/styles/**", "tailwind.config.js"]
---

# Styling Conventions

## Approach

- Tailwind CSS utility classes inline on JSX elements
- DaisyUI components: cards, buttons, modals, inputs
- Custom scrollbar via `tailwind-scrollbar` plugin

## Theme (mytheme)

| Token | Value | Usage |
|-------|-------|-------|
| primary | `#498BCA` | Main actions, links |
| secondary | `#4CBFB7` | Secondary elements |
| accent | `#4CBFB7` | Highlights |
| base-100 | `#ffffe3` | Background |
| error | `#DE6F81` | Error states |

## SVG Styling

- Nodes: `<circle>` with configurable radius, fill, stroke
- Labels: `<text>` with fontSize and fill color
- Edges: `<path>` with stroke, strokeWidth, strokeOpacity
- Global styles apply to all elements; per-element overrides via context menu
