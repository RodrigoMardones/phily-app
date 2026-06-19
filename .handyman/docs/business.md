# Business

Phily is an open-source web app for visualizing and editing phylogenetic
dendrograms. Users upload a tree file, customize the rendering interactively,
and export or share the result.

## Domain

Phylogenetics studies evolutionary relationships between biological entities
(species, genes, samples). These relationships are encoded as trees, most
commonly in the **Newick** text format (`.nwk`) or as JSON. Researchers and
students need a fast, no-install way to turn those files into readable,
publication-friendly diagrams without writing code.

Phily solves the "I have a Newick file, now what?" problem: it parses the tree,
renders it as an interactive D3 dendrogram, and lets the user restyle, edit, and
export it from the browser.

## Stakeholders

- **Researchers / bioinformaticians** — upload real trees, tweak styling, export figures.
- **Students / educators** — explore example datasets to learn tree structure.
- **Anyone sharing a tree** — generate a URL-encoded link so others can open the same view.

## Use Cases

- **Upload & visualize**
  - **Actor:** any user.
  - **Goal:** see a `.nwk` or `.json` tree rendered as a dendrogram.
  - **Flow:** select file → FileReader → Zod validation → parse (Newick or JSON) → Redux dispatch → D3 render.
  - **Rules:** invalid files are rejected with an error modal; never render unvalidated input.

- **Style the dendrogram**
  - **Actor:** any user.
  - **Goal:** adjust colors, curve type, sizing, labels.
  - **Flow:** dashboard input → `useStyle` hook → dispatch `setStyle` → debounced (~2s) re-render.
  - **Rules:** styling changes never mutate tree topology.

- **Edit elements**
  - **Actor:** any user.
  - **Goal:** modify a specific node, label, or edge.
  - **Flow:** right-click element → SubMenu → apply change → update tree → re-render.

- **Export**
  - **Actor:** any user.
  - **Goal:** save the figure as PNG / JPG / SVG / JSON.
  - **Flow:** choose format → extract SVG → convert → download blob.

- **Share via URL**
  - **Actor:** any user.
  - **Goal:** send a link that reopens the exact tree.
  - **Flow:** tree JSON → LZ-String compress → URL param → decompress on load.

## Out Of Scope

- Tree inference / phylogenetic analysis (Phily visualizes, it does not compute trees).
- Persistent server-side storage of user trees or accounts.
- Multi-user real-time collaboration.

## Glossary

- **Newick** — parenthetical text format encoding a tree with branch lengths.
- **Dendrogram** — tree diagram showing hierarchical relationships.
- **Node / Leaf** — internal branch point / terminal taxon.
- **Edge / Branch** — link between nodes, often carrying a length.
- **TreeData (TDA)** — the `src/lib/TreeData.js` class that holds and transforms tree state.
