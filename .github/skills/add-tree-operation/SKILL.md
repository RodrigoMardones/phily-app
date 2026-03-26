---
name: add-tree-operation
description: "Add new tree manipulation operations like pruning, re-rooting, subtree extraction, node collapsing, or metadata editing. Use when modifying TreeData class or adding tree editing features."
---

# Add Tree Operation

## When to Use
- Adding tree manipulation: prune, re-root, rotate branches, collapse subtrees
- Adding metadata editing: annotations, branch labels, bootstrap values
- Extending TreeData class with new transformations
- Adding undo/redo for tree operations

## Key Files
- [TreeData.js](../../../src/lib/TreeData.js) — Core tree data class (TDA)
- [Tree slice](../../../src/components/store/tree/slice.js) — Tree state and actions
- [SubMenu](../../../src/components/submenu/submenu.js) — Context menu for node editing
- [useSubmenu](../../../src/components/submenu/useSubmenu.js) — Context menu logic
- [Dendrogram](../../../src/components/dendrogram/dendrogram.js) — D3 rendering with event handlers

## Tree Data Structure
```js
{
  name: "root",
  length: "0.1",
  nodeStyle: { radius: 5, stroke: "#000", fill: "#fff" },
  pathStyle: { fill: "none", stroke: "#000", strokeOpacity: 1, strokeWidth: 1 },
  labelStyle: { hidden: false, fontSize: 12, fill: "#000" },
  children: [ /* recursive */ ]
}
```

## Procedure

1. **Define operation**: Add the tree manipulation function in `TreeData.js` or create a new utility
2. **Add Redux action**: Create action in `tree/slice.js` that applies the operation to the tree state
3. **Wire UI trigger**: 
   - For node-specific operations: Add option to SubMenu context menu
   - For global operations: Add control to Dashboard
4. **Handle re-render**: Ensure the operation updates the tree reference so `useMemo` detects the change
5. **Validate result**: Ensure modified tree still passes Zod schema validation
6. **Test**: Load demo data, apply operation, verify rendering

## Constraints
- Tree operations must be immutable (return new tree, don't mutate in place)
- Preserve all style properties when transforming nodes
- Operations must work with both Newick-parsed and JSON-imported trees
- Large trees (1000+ nodes) must not freeze the UI
