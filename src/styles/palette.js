/**
 * Single source of truth for the Phily color palette — the "instrumento de
 * historia natural" direction from the UX/UI investigation (§6, herbarium green).
 *
 * Consumed by:
 *  - `tailwind.config.js` (CommonJS `require`) to build the DaisyUI theme and the
 *    Tailwind `colors` so utilities like `text-ink` / `bg-parchment` / `stroke-signal`
 *    exist.
 *  - JS/SVG that needs raw values for export-safe attributes (e.g. the dendrogram
 *    selection/highlight rings, which are serialized by `XMLSerializer` on export
 *    and therefore cannot rely on CSS classes).
 *
 * Keep every theme color here so contrast can be audited in one place (B1/B2).
 */
const palette = {
  ink: '#1B2A27', // texto y estructura principal
  herbarium: '#498bca', // color de marca / identidad visual
  lichen: '#6DA2D4', // secundario / apoyo
  parchment: '#F3EFE4', // "papel" del lienzo y vacíos
  oxide: '#B5651D', //  acento cálido / contraste con el azul
  signal: '#2D6A9F', // foco / estado interactivo accesible
};

module.exports = palette;
