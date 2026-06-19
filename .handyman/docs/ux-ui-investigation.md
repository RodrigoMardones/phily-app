---
title: "Investigación UX/UI — Phily: hallazgos y propuestas de mejora"
feature: investigation_ux_ui_features
status: research
author: leader (Handyman)
date: 2026-06-18
sources:
  - skill: frontend-design
  - skill: vercel-react-best-practices
scope: "Sidebar (Dashboard) + lienzo D3 (Canvas/Dendrogram). Solo investigación, sin cambios de código de producto."
tags: [handyman/docs, ux, ui, performance, accessibility, design]
---

# Investigación UX/UI — Phily

> **Tipo de documento:** investigación (research). No introduce cambios de
> código de producto. Es la base de literatura y la guía priorizada para una
> futura tanda de _features_ de mejora.
>
> **Apoyo de literatura (skills):** `frontend-design` (identidad visual,
> tipografía, estados, escritura de interfaz, piso de accesibilidad) y
> `vercel-react-best-practices` (waterfalls, bundle, re-render, rendering, JS).
> A lo largo del documento se citan principios de la primera y los IDs de regla
> de la segunda (p. ej. `bundle-barrel-imports`).

---

## 1. Resumen ejecutivo

Phily resuelve bien su problema central: subir un archivo Newick/JSON y obtener
un dendrograma interactivo, editable y exportable. La arquitectura (Next.js 15,
React 18, D3 7, Redux Toolkit, Zod) es sólida y la separación
componente → hook → validación → store → render está bien aplicada.

El producto, sin embargo, presenta tres brechas transversales que limitan tanto
la percepción de calidad como el rendimiento:

1. **Identidad visual genérica y sin tipografía propia.** El sitio se lee como
   un _dashboard_ azul estándar. No hay fuente cargada (`next/font` ausente), no
   hay sistema de _tokens_ aplicado (colores en hex incrustados pese a existir un
   tema DaisyUI), y el lienzo —que es el héroe real del producto— no tiene
   estado vacío ni momento de bienvenida.
2. **Piso de accesibilidad incompleto.** Contraste dudoso en varios controles,
   `lang="en"` con interfaz en español, labels no asociados a inputs, menú
   contextual sin soporte de teclado y animaciones SVG infinitas sin respetar
   `prefers-reduced-motion`.
3. **Optimizaciones de rendimiento React/Next subutilizadas o mal aplicadas.**
   Imports de D3 desde el _barrel_ `d3`, ausencia de `next/dynamic` para el
   subárbol pesado, y un patrón `useDeferredValue(value, { timeoutMs })` cuyo
   segundo argumento **no existe en la API estable de React 18** y se ignora
   silenciosamente (la "espera de 2 s" no ocurre).

Ninguna brecha exige reescritura: son mejoras incrementales y de alto retorno.
La Sección 6 propone una dirección visual concreta anclada en el dominio
(filogenia / "árbol de la vida") y la Sección 7 las ordena en un _backlog_
priorizado, listo para convertirse en _features_ del harness.

---

## 2. Metodología y fuentes

- **Inventario del estado actual** leyendo el código real (no supuestos). Cada
  hallazgo cita su archivo de origen.
- **Contraste con literatura:**
  - `frontend-design`: "anclar en el sujeto", el héroe como tesis, la tipografía
    como personalidad, estructura que codifica información, motion deliberado,
    estados vacíos como invitación, escritura de interfaz, y un **piso de
    calidad** (responsive, foco visible, motion reducido respetado).
  - `vercel-react-best-practices`: 70 reglas en 8 categorías priorizadas por
    impacto. Se citan por su ID y prefijo (`async-`, `bundle-`, `server-`,
    `client-`, `rerender-`, `rendering-`, `js-`, `advanced-`).
- **Límite explícito:** documento de investigación. No se modifica código de
  producto; el _green gate_ (`./init.sh`: lint + build) se mantiene.

---

## 3. Mapa del estado actual

### 3.1 Estructura de pantalla

`src/pages/index.js` compone dos paneles a pantalla completa
(`flex h-screen bg-gray-400`):

```
┌───────────────────────────────────────────────────────────┐
│  Dashboard (sidebar, bg-primary #498BCA)  │  Canvas (white) │
│  ─ logo + "Phily"                         │   ┌───────────┐ │
│  ─ Generar Árbol (upload + cargar)        │   │  zoom +/- │ │
│  ─ Buscar Nodo (NodeFinder)               │   │           │ │
│  ─ Visualización (lateral / circular)     │   │  D3 SVG   │ │
│  ─ Profundidad / Ángulo                   │   │ dendrogram│ │
│  ─ Diseño general (enlaces/nodos/etiq.)   │   │           │ │
│  ─ Selección múltiple (condicional)       │   └───────────┘ │
│  ─ Exportar (png/svg/jpeg/json)           │                 │
│  ─ Footer                                 │                 │
└───────────────────────────────────────────────────────────┘
```

| Zona | Componente | Archivo |
|------|------------|---------|
| Sidebar | `Dashboard` | `src/components/dashboard/dashboard.js` |
| Lienzo | `Canvas` | `src/components/canvas/canvas.js` |
| Render D3 | `Dendrogram` | `src/components/dendrogram/dendrogram.js` |
| Geometría D3 | `utils.js` | `src/components/dendrogram/utils.js` |
| Menú contextual | `SubMenu` | `src/components/submenu/submenu.js` |
| Edición múltiple | `SelectionPanel` | `src/components/selection/selection.js` |
| Búsqueda | `NodeFinder` | `src/components/nodefinder/nodefinder.js` |
| Error | `Error` | `src/components/error/error.js` |
| Shell | `App` / `Document` | `src/pages/_app.js`, `src/pages/_document.js` |
| Tema | DaisyUI `mytheme` | `tailwind.config.js` |

### 3.2 Observaciones de base

- **Sin tipografía propia:** `src/pages/_document.js` tiene `<Head />` vacío y
  `src/styles/globals.css` solo declara las tres directivas `@tailwind`. No se
  usa `next/font`. Se hereda el _stack_ por defecto de Tailwind.
- **Tema definido pero evitado:** `tailwind.config.js` declara `mytheme`
  (`primary #498BCA`, `secondary/accent #4CBFB7`, etc.), pero la UI incrusta hex
  literales: `bg-[#38638B]`, `bg-[#6DA2D4]`, `bg-[#FAEECC]`, `stroke="#498BCA"`,
  `#E6A817`. Esto contradice explícitamente `docs/architecture.md` ("Do not
  hardcode theme colors; use the DaisyUI custom theme").
- **Casi todo el sidebar está `disabled` hasta cargar archivo**
  (`disabled={!fileName}`), por lo que la primera impresión es un muro de
  controles inertes.

---

## 4. Hallazgos por tema

> Severidad: **S1** (alto impacto / corregir pronto) · **S2** (medio) ·
> **S3** (pulido). Cada hallazgo enlaza con su evidencia y su literatura.

### A. Identidad visual y tipografía — `frontend-design`

- **A1 · S1 · No hay personalidad tipográfica.** El _skill_ es explícito: "la
  tipografía carga la personalidad de la página… que sea una parte memorable, no
  un vehículo neutro". Hoy no hay ni una fuente cargada. _Oportunidad doble:_ es
  además una mejora de rendimiento (ver F1, fuente self-hosted con `next/font`,
  cero CLS).
- **A2 · S2 · El héroe no es una tesis.** En `frontend-design`, el héroe debe
  abrir con "lo más característico del mundo del sujeto". Aquí el mundo es el
  **árbol filogenético**, pero al entrar sin archivo el lienzo es un `Card`
  blanco vacío (`src/components/canvas/canvas.js`). Se desperdicia el elemento
  más distintivo del producto.
- **A3 · S2 · Estructura que no codifica información.** Todas las secciones del
  sidebar usan el mismo peso (`Card.Title … text-md`), sin jerarquía ni
  agrupación visual real. El _skill_ pide que "los dispositivos estructurales
  codifiquen algo verdadero del contenido".

### B. Sistema de color y consistencia

- **B1 · S1 · Hex incrustados en vez de _tokens_.** Mismo color azul expresado
  como `#498BCA` (tema), `#6DA2D4` (`primary-light`, además sin `#` en el tema) y
  `#38638B` (no existe en el tema). Imposible re-tematizar o auditar contraste de
  forma central. Viola `docs/architecture.md` y `docs/conventions.md`.
- **B2 · S3 · `neutral` y `primary-light` sin `#` en `tailwind.config.js`**
  (`neutral: 'FAEECC'`, `'primary-light': '6DA2D4'`): valores probablemente
  inválidos como color → el _token_ no funciona y se recurre al hex literal.

### C. Accesibilidad (WCAG) — piso de `frontend-design`

- **C1 · S1 · `lang` incorrecto.** `src/pages/_document.js` declara
  `<Html lang="en">` pero la interfaz está en español (WCAG 3.1.1). Debe ser
  `es` (o i18n real).
- **C2 · S1 · Contraste insuficiente (probable).** Casos a auditar:
  - Etiqueta de archivo: `bg-[#FAEECC]` (crema) con `text-[#000000] text-opacity-40`
    (negro al 40 %) → contraste muy bajo, falla AA para texto
    (`src/components/dashboard/dashboard.js`).
  - Texto blanco sobre botón no seleccionado `#6DA2D4` (~2.4:1) y sobre
    `accent/secondary #4CBFB7` (~2.0:1) → por debajo del 4.5:1 requerido.
  - (Aproximaciones: verificar con un medidor antes de fijar valores.)
- **C3 · S1 · Animaciones sin `prefers-reduced-motion`.** El nodo resaltado pinta
  anillos con `<animate … repeatCount="indefinite">`
  (`src/components/dendrogram/dendrogram.js`), sin _guard_ de motion reducido
  (WCAG 2.3.3; `frontend-design`: "reduced motion respected").
- **C4 · S2 · Labels no asociados.** Inputs de color/número usan `<label>`
  adyacentes sin `htmlFor`/`id` (dashboard, selection, submenu). Un lector de
  pantalla no vincula etiqueta y control.
- **C5 · S2 · Controles solo-icono sin nombre accesible.** Botones de zoom
  (`#zoomIn`/`#zoomOut` en `canvas.js`) y el botón de _burger_ (logo en
  `dashboard.js`) carecen de `aria-label`.
- **C6 · S2 · Menú contextual no accesible.** `SubMenu` es un `div` posicionado
  con `hidden={toggled}`: sin `role="menu"`, sin foco, sin cierre con `Escape`,
  sin _focus trap_ (`src/components/submenu/submenu.js`).
- **C7 · S3 · Modal de error.** `Error` usa `<dialog open>` nativo
  (`src/components/error/error.js`); conviene verificar foco inicial y cierre con
  teclado, y mejorar el copy (ver H2).

### D. Jerarquía de información y disclosure progresivo

- **D1 · S2 · Muro de controles deshabilitados.** Antes de cargar archivo, todo
  el panel de estilo/exportación está `disabled`. `frontend-design` favorece
  revelar progresivamente: mostrar primero "subir / probar ejemplo" y atenuar (o
  colapsar) el resto hasta que exista un árbol.
- **D2 · S2 · Sidebar como columna larga y plana.** Conviene agrupar en secciones
  colapsables (Visualización · Diseño · Selección · Exportar) para reducir carga
  cognitiva, sobre todo cuando aparece el panel de "Selección múltiple".

### E. Estados (vacío, carga, feedback)

- **E1 · S1 · Sin estado vacío.** El lienzo vacío no orienta. `frontend-design`:
  "una pantalla vacía es una invitación a actuar". Phily **ya tiene datasets de
  ejemplo** (`public/ejemplo.json`, `examples/*.nwk`) y rutas `/demo`: el estado
  vacío debería ofrecer "probar con un ejemplo" + soltar archivo.
- **E2 · S2 · Sin indicador de carga.** Subir → parsear → render no muestra
  _feedback_; árboles grandes pueden tardar. Aplica
  `rendering-usetransition-loading` (estado de carga vía `useTransition`).
- **E3 · S3 · Exportación.** El `<select>` usa `<option>png</option>` sin `value`
  y hay un comentario que cuestiona cómo cablearlo
  (`src/components/dashboard/dashboard.js`). Revisar el flujo de descarga.

### F. Rendimiento React / Next — `vercel-react-best-practices`

- **F1 · S1 · `bundle` — Fuente y assets.** Cargar la tipografía con `next/font`
  (self-hosted, sin CSS externo bloqueante, cero CLS). Encaja con
  `server-hoist-static-io` (izar I/O estático).
- **F2 · S1 · `bundle-barrel-imports`.** D3 se importa del _barrel_:
  - `src/components/dendrogram/dendrogram.js`: `import { hierarchy, ascending } from 'd3'`.
  - `src/components/dendrogram/utils.js`: `import { link, cluster, tree, curveStep, curveBumpX, curveLinear, linkRadial } from 'd3'`.
  Importar desde submódulos (`d3-hierarchy`, `d3-array`, `d3-shape`) reduce el
  bundle y mejora el _tree-shaking_.
- **F3 · S1 · `rerender-use-deferred-value` mal aplicado.**
  `useStyle.js` y `useDendrogramForm.js` usan
  `useDeferredValue(value, { timeoutMs: … })`. **El segundo argumento no
  pertenece a la API estable de React 18** (`useDeferredValue(value)` recibe un
  solo argumento) y se ignora: la "espera" de 2 s / 1 s / 100 s **no ocurre**.
  Hay que decidir explícitamente entre `useDeferredValue` (sin _timeout_) o un
  _debounce_ real para inputs de color/rango.
- **F4 · S2 · `bundle-dynamic-imports`.** `Canvas`/`Dendrogram` (D3, pesado) se
  importan estáticamente en `index.js`. Cargarlos con `next/dynamic`
  (`ssr: false`) aligera el primer JS y permite un _placeholder_ de carga.
- **F5 · S2 · `rerender-memo` / `rendering-content-visibility`.** `Dendrogram`
  recorre `nodes`/`links` completos en cada cambio de estilo; no está envuelto en
  `React.memo`. Para árboles grandes conviene memoizar el subárbol y considerar
  `content-visibility` en listas largas (panel de etiquetas, datalist).
- **F6 · S3 · `rendering-svg-precision`.** Las coordenadas D3 son flotantes de
  precisión completa (`utils.js`), inflando el SVG serializado (afecta DOM y
  exportación). Redondear a 2–3 decimales.
- **F7 · S3 · `js-` varios.** `linkStep` usa `var` y asignación dentro de la
  condición; el `selectedSet` (Set) ya aplica bien `js-set-map-lookups`. Mantener
  ese patrón y limpiar el resto.
- **F8 · S3 · Dependencia `swr` aparentemente sin uso** en el flujo local de
  archivos (`package.json`): confirmar y, si no se usa, retirar (`bundle`).

### G. Responsividad / móvil

- **G1 · S2 · Layout no reflueye.** El _shell_ es `flex h-screen` con sidebar +
  `Canvas w-5/6` lado a lado; en pantallas pequeñas ambos quedan comprimidos. Hay
  utilidades `md:flex-row sm:flex-col` dentro de filas, pero el nivel superior no
  cambia a una sola columna (sidebar como _drawer_) en móvil.

### H. Escritura de interfaz (microcopy) — `frontend-design`

- **H1 · S3 · Inconsistencia de mayúsculas/voz.** Mezcla de _sentence case_ y
  minúsculas: "cargar", "escalon", "suave", "inclinado", "descargar", junto a
  títulos "Generar Árbol", "Buscar Nodo". Unificar a _sentence case_, voz activa
  y vocabulario consistente. Faltan tildes ("escalon" → "escalón").
- **H2 · S2 · Errores genéricos.** "Error inesperado" no explica qué pasó ni cómo
  resolverlo (`src/components/error/error.js`). El _skill_: "los errores no se
  disculpan ni son vagos; explican qué falló y cómo arreglarlo". Mensajes por
  caso (formato Newick inválido, JSON no conforme a Zod, archivo vacío).
- **H3 · S3 · Meta/SEO con erratas.** En `src/pages/_app.js`: "Philogenetic"
  (→ Phylogenetic), "comunity" (→ community), `twitter:tile` (→ `twitter:title`).

---

## 5. Mapa de severidad (resumen)

| Tema | S1 | S2 | S3 |
|------|----|----|----|
| A. Identidad / tipografía | A1 | A2, A3 | — |
| B. Color / tokens | B1 | — | B2 |
| C. Accesibilidad | C1, C2, C3 | C4, C5, C6 | C7 |
| D. Jerarquía / disclosure | — | D1, D2 | — |
| E. Estados | E1 | E2 | E3 |
| F. Rendimiento | F1, F2, F3 | F4, F5 | F6, F7, F8 |
| G. Responsividad | — | G1 | — |
| H. Escritura | — | H2 | H1, H3 |

---

## 6. Propuesta de dirección visual (método de dos pasadas)

> `frontend-design` exige evitar los tres _looks_ por defecto de la IA
> (crema + serif + terracota; casi-negro + acento ácido; _broadsheet_ de filetes)
> y **anclar en el sujeto**. El sujeto de Phily es la **filogenia / el árbol de la
> vida**: ilustración naturalista, herbario, láminas científicas, ramificación.

### Concepto

**"Instrumento de historia natural".** La sidebar es el _panel del instrumento_;
el lienzo es el _espécimen sobre la lámina_. El árbol es el héroe.

**Riesgo deliberado (y su justificación):** anclar la identidad en un **verde
herbario/clorofila** como color primario (no en el azul SaaS actual ni en el
crema-serif por defecto). Es un riesgo porque aleja a Phily de la convención de
_dashboard_, pero se justifica: el verde evoca tejido vivo y el mundo botánico de
la filogenia, y diferencia el producto de cualquier visor genérico. El crema se
reserva **solo** como "papel" del lienzo (no como fondo dominante), para no caer
en el _look_ por defecto #1.

### Tokens (borrador a validar por contraste)

- **Color (4–6 nombrados):**
  - `ink` `#1B2A27` — texto y estructura principal.
  - `herbarium` `#3A5A40` — primario (vivo, vegetal).
  - `lichen` `#9DB17C` — secundario / apoyo.
  - `parchment` `#F3EFE4` — "papel" del lienzo y vacíos (uso acotado).
  - `oxide` `#B5651D` — acento cálido para selección/resaltado (sustituye al
    `#E6A817` actual de forma tokenizada).
  - `signal` `#2D6A9F` — foco/estado interactivo accesible.
  - _Todos como tokens DaisyUI + variables CSS; cero hex incrustados._
- **Tipografía (≥ 2 roles):**
  - _Display_ (wordmark + títulos, con moderación): una serif de carácter
    científico-editorial con tamaños ópticos (p. ej. **Fraunces** o
    **Newsreader**) — evoca lámina naturalista sin ser la serif "default".
  - _Body / UI_: una sans humanista legible (p. ej. **Public Sans** o
    **IBM Plex Sans**), no el _default_ de sistema.
  - _Datos / utilitaria_: una monoespaciada (p. ej. **IBM Plex Mono**) para
    campos numéricos (longitud de rama, coordenadas, conteo de taxones): alinea
    cifras y refuerza el carácter de instrumento.
  - Servidas con `next/font` (self-hosted) → resuelve A1 **y** F1.
- **Layout:** dos paneles (se conserva), con _disclosure_ progresivo en la
  sidebar y un **estado vacío-héroe** en el lienzo.
- **Firma (el único elemento memorable):** un **motivo de ramificación
  "árbol de la vida"** que sí codifica jerarquía: en el estado vacío, una rama
  que "crece" con una sola animación orquestada (respetando
  `prefers-reduced-motion`); como divisores de sección, glifos de rama en lugar
  del `divider` plano. Todo lo demás permanece tranquilo y disciplinado
  (principio de "gastar la audacia en un solo lugar").

### Revisión anti-_default_

- ¿Es el crema+serif por defecto? **No**: el primario es verde herbario; el crema
  queda relegado a "papel" del lienzo.
- ¿Numeritos 01/02/03 decorativos? **No**: la estructura usa ramificación, que sí
  representa jerarquía real del dominio.
- ¿Motion disperso? **No**: un único momento orquestado (crecer la rama) + foco/
  hover discretos, con motion reducido respetado.

---

## 7. Backlog priorizado (candidatos a _features_)

> Orden sugerido por impacto/esfuerzo. Cada ítem puede convertirse en una
> _feature_ del harness con criterios de aceptación verificables. **Este
> documento es solo investigación**; la implementación es trabajo posterior.

### P0 — Piso de calidad y correcciones de bajo costo

1. **Accesibilidad base:** `lang="es"`; `aria-label` en zoom y _burger_; asociar
   labels↔inputs; `Escape`/foco en `SubMenu`. _(C1, C4, C5, C6)_
2. **Respetar `prefers-reduced-motion`** en los anillos animados del nodo
   resaltado. _(C3)_
3. **Arreglar `useDeferredValue`:** quitar el `{ timeoutMs }` inexistente y
   decidir `useDeferredValue` vs _debounce_ real para color/rango. _(F3)_
4. **Microcopy y meta:** unificar _sentence case_/tildes; corregir erratas de
   meta; mensajes de error por caso. _(H1, H2, H3)_

### P1 — Identidad y percepción de calidad

5. **Tipografía con `next/font`** (display + body + mono). _(A1, F1)_
6. **Tokenizar el color:** corregir `tailwind.config.js` (`#` faltantes), eliminar
   hex incrustados, aplicar la paleta de la Sección 6. _(B1, B2)_
7. **Estado vacío-héroe** en el lienzo con "probar un ejemplo" + soltar archivo,
   usando los datasets ya existentes. _(A2, E1)_
8. **Disclosure progresivo** en la sidebar (secciones colapsables; atenuar lo
   deshabilitado). _(A3, D1, D2)_

### P2 — Rendimiento y robustez

9. **Imports D3 por submódulo** + `React.memo`/`content-visibility` en el render
   pesado + precisión SVG. _(F2, F5, F6)_
10. **`next/dynamic`** para `Canvas`/`Dendrogram` con _placeholder_ de carga +
    `useTransition` en el parseo/render. _(F4, E2)_
11. **Responsividad móvil:** sidebar como _drawer_ y reflujo a una columna.
    _(G1)_
12. **Higiene de dependencias:** confirmar/retirar `swr` si no se usa. _(F8)_

---

## 8. Riesgos y consideraciones

- **No re-habilitar** los checks serializables de Redux al tocar estilos: los
  objetos D3 no son serializables (`docs/architecture.md`).
- **No mutar la topología** del árbol desde rutas de estilo.
- **Mantener Zod** en el borde de cada archivo subido; no introducir XSS al
  inyectar SVG/strings.
- **Política de dependencias:** preferir el _stack_ actual; cualquier fuente o
  librería nueva debe justificarse (las fuentes vía `next/font` no añaden
  dependencia de runtime).
- **Contraste:** los valores de la Sección 6 son borrador; validar cada par
  texto/fondo con un medidor antes de fijarlos.

---

## 9. Apéndice — Índice de literatura aplicada

### `frontend-design`

| Principio | Hallazgos |
|-----------|-----------|
| Anclar en el sujeto / héroe como tesis | A2, E1, §6 |
| Tipografía como personalidad | A1, §6 |
| Estructura que codifica información | A3, D2, §6 (firma) |
| Estados vacíos como invitación | E1 |
| Escritura de interfaz | H1, H2, H3 |
| Piso de calidad (responsive, foco, motion) | C1–C7, G1 |
| Gastar la audacia en un solo lugar | §6 (firma) |

### `vercel-react-best-practices`

| Regla (ID) | Hallazgo |
|------------|----------|
| `bundle-barrel-imports` | F2 |
| `bundle-dynamic-imports` | F4 |
| `server-hoist-static-io` | F1 |
| `rerender-use-deferred-value` | F3 |
| `rerender-memo` | F5 |
| `rendering-content-visibility` | F5 |
| `rendering-svg-precision` | F6 |
| `rendering-usetransition-loading` | E2 |
| `js-set-map-lookups` (ya OK) | F7 |

---

## 10. Verificación de esta investigación

- **Naturaleza:** documento (sin cambios de código de producto).
- **Green gate:** `./init.sh` (lint + build) debe permanecer verde; este archivo
  vive en `.handyman/docs/` (capa de docs versionada del harness).
- **Post-feature (docs del harness):** si se implementan P0–P2, actualizar
  `docs/architecture.md` (tokens/`next/font`), `docs/conventions.md` (regla de no
  incrustar hex; importar D3 por submódulo) y `docs/business.md` (estado vacío /
  ejemplos como onboarding).
