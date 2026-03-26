---
name: add-visualization
description: "Add new dendrogram visualization types or modify existing D3.js curve renderers. Use when adding tree layouts, curve types, circular views, or new SVG visual elements."
---

# Add Visualization Feature

## When to Use
- Adding a new curve type (e.g., radial, fan, rectangular)
- Modifying D3 tree/cluster layout behavior
- Adding new SVG elements to the dendrogram (annotations, decorations)
- Adding color scales or gradient mappings

## Key Files
- [Dendrogram renderer](../../../src/components/dendrogram/dendrogram.js) — Main D3 rendering logic
- [Curve utilities](../../../src/components/dendrogram/utils.js) — D3 curve generator functions
- [Tree slice](../../../src/components/store/tree/slice.js) — curveType, normalize, angle state
- [Dendrogram form hook](../../../src/components/dashboard/hooks/useDendrogramForm.js) — UI controls for config
- [Canvas](../../../src/components/canvas/canvas.js) — SVG container and zoom wrapper

## Procedure

1. **Define the curve/layout**: Add the new curve generator in `src/components/dendrogram/utils.js`
2. **Register in state**: Add the new type to the `curveType` options in the tree slice if needed
3. **Wire rendering**: Update `dendrogram.js` to handle the new curve type in the D3 rendering pipeline
4. **Add UI control**: Update `useDendrogramForm.js` to expose the new option in the dashboard
5. **Test rendering**: Verify with demo data (`npm run dev` → load demo)

## D3 Rendering Pattern
```js
// In dendrogram.js — rendering follows this pattern:
const svg = d3.select(ref.current);
const root = d3.hierarchy(treeData);
const layout = normalize ? d3.tree() : d3.cluster();
layout.size([height, width]);
layout(root);
// Links (edges) use the curve generator from utils.js
// Nodes are circles, labels are text elements
```

## Constraints
- New visualizations must work within the existing `useMemo` + ref rendering pattern
- Style customization (nodeStyle, pathStyle, labelStyle) must be preserved
- Context menu (SubMenu) must still work for element editing
