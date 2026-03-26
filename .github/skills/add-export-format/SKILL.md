---
name: add-export-format
description: "Add new export formats for dendrograms. Use when implementing PDF export, SVG improvements, Newick export, or batch export features."
---

# Add Export Format

## When to Use
- Adding new export format (PDF, Newick re-export, high-res PNG)
- Improving existing export quality (SVG metadata, resolution options)
- Adding batch export or multi-format download

## Key Files
- [useDownload hook](../../../src/components/dashboard/hooks/useDownload.js) — Export logic for all formats
- [Dashboard](../../../src/components/dashboard/dashboard.js) — Export UI buttons
- [Canvas](../../../src/components/canvas/canvas.js) — SVG element source for exports

## Current Export Flow
1. User clicks download button in dashboard
2. `useDownload` reads the SVG element from the canvas ref
3. For image formats: SVG → Canvas → toBlob → download link
4. For JSON: Redux tree state → JSON.stringify → blob → download link

## Procedure

1. **Add format handler**: Create a new export function in `useDownload.js` following existing pattern
2. **Wire UI**: Add the format option to the download section in `dashboard.js`
3. **Handle conversion**: Implement format-specific conversion (e.g., SVG → PDF using a library)
4. **Filename**: Use the tree name from Redux state for the output filename
5. **Test**: Verify export produces valid output with demo data

## Constraints
- Export must work client-side (no server-side rendering needed)
- Preserve SVG styling in exported output
- Large trees should not block the UI during export
