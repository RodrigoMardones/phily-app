---
description: "Use when working on API routes, data validation, Newick parsing, or tree data transformations. Covers API conventions and data formats."
applyTo: "src/pages/api/**"
---

# API & Data Conventions

## API Routes

- Located in `src/pages/api/`
- `toJson.js`: POST — converts Newick string to tree JSON using TreeData (TDA)
- `example.js`: GET — serves demo dendrogram from `/public/ejemplo9.json`

## TreeData (TDA) Class

- Located in `src/lib/TreeData.js`
- Core data transformation: Newick format → hierarchical JSON tree
- Applies default styles (node, path, label) to each tree node
- Used by the API and client-side upload flow

## Newick Format

Standard phylogenetic tree format: `((A:0.1,B:0.2):0.3,C:0.4);`

## JSON Tree Schema (Zod validated)

```js
{
  name: string,
  length: string,
  nodeStyle?: { radius, stroke, fill },
  pathStyle?: { fill, stroke, strokeOpacity, strokeWidth },
  labelStyle?: { hidden, fontSize, fill },
  children: [] // recursive
}
```

## Validation

- All uploaded JSON is validated with Zod schemas (`dendrogramToJson.js`)
- Recursive validation traverses entire tree structure
- Invalid files trigger error modal via `error` Redux slice
