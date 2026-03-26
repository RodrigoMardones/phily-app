---
name: add-api-route
description: "Add new API routes for tree processing, format conversion, or data services. Use when creating REST endpoints, adding Newick parsing features, or external data integration."
---

# Add API Route

## When to Use
- Creating new API endpoints for tree data processing
- Adding new input format parsers (e.g., NEXUS, PhyloXML)
- Integrating external phylogenetic databases
- Adding server-side tree manipulation

## Key Files
- [API routes](../../../src/pages/api/) — Next.js API directory
- [toJson.js](../../../src/pages/api/toJson.js) — Newick → JSON conversion endpoint
- [example.js](../../../src/pages/api/example.js) — Demo data endpoint
- [TreeData.js](../../../src/lib/TreeData.js) — Core data transformation class

## API Pattern
```js
// src/pages/api/<route>.js
export default async function handler(req, res) {
  try {
    // Validate method
    if (req.method !== 'POST') return res.status(405).end();
    // Process data
    const result = processData(req.body);
    // Return response
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
```

## Procedure

1. **Create route file**: Add `src/pages/api/<name>.js` following the handler pattern
2. **Add validation**: Use Zod schemas for request body validation
3. **Implement logic**: Use or extend `TreeData` class for tree operations
4. **Error handling**: Return structured error responses with status codes
5. **Connect client**: Wire the API call in the appropriate hook using `fetch` or SWR
6. **Test**: Use the HTTP file format (`docs/toJson.http`) or curl

## Constraints
- Body size limit is 15MB (configured in `next.config.mjs`)
- Validate all inputs with Zod before processing
- Return consistent error format: `{ message: string }`
