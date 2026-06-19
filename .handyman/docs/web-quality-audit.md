---
title: "Auditoría de calidad web — Phily: extensión de la investigación UX/UI"
feature: investigation_ux_ui_features_new_tools
status: research
author: leader (Handyman)
date: 2026-06-18
extends: "[[ux-ui-investigation]]"
sources:
  - skill: web-quality-audit
  - skill: accessibility
  - skill: core-web-vitals
  - skill: seo
  - skill: best-practices
scope: "App completa (shell, páginas, config de despliegue). Solo investigación, sin cambios de código de producto."
tags: [handyman/docs, web-quality, performance, accessibility, seo, security, cwv]
---

# Auditoría de calidad web — Phily

> **Tipo de documento:** investigación (research). **Complementa**
> `[[ux-ui-investigation]]` (que usó `frontend-design` + `vercel-react-best-practices`)
> y la tanda **P0 ya implementada** (`[[backlog/impl_ux_p0_quality_floor]]`). No
> introduce cambios de código de producto.
>
> **Apoyo de literatura (skills nuevas):** `web-quality-audit` (marco Lighthouse:
> Performance / Accessibility / SEO / Best Practices), `core-web-vitals`
> (LCP/INP/CLS), `accessibility` (WCAG 2.2), `seo` (técnico + on-page + datos
> estructurados) y `best-practices` (seguridad, cabeceras, compatibilidad).
>
> **Nomenclatura:** los hallazgos nuevos llevan prefijo `WQ-` para no chocar con
> los IDs `A–H` del documento original. Cada uno indica **severidad** (estilo
> Lighthouse: _Critical_/_High_/_Medium_/_Low_) y la skill de respaldo.

---

## 1. Resumen ejecutivo

La investigación original cubrió identidad visual, tipografía, accesibilidad de
controles y rendimiento React/Next. Las cinco skills nuevas miran Phily con el
lente de **Lighthouse** y añaden tres frentes poco tratados hasta ahora:

1. **SEO técnico casi ausente.** No hay `robots.txt`, `sitemap.xml`, `canonical`
   ni datos estructurados; el `<title>` es solo "Phily"; la página principal **no
   tiene `<h1>`**. El original solo había corregido erratas de _meta_ (H3).
2. **Cabeceras de seguridad mejorables.** `next.config.mjs` ya define una CSP
   (bien), pero emite `X-XSS-Protection` (cabecera **desaconsejada** por
   `best-practices`), incluye `'unsafe-inline'` en `default-src` y no envía HSTS.
3. **Core Web Vitals sin red de seguridad.** El parseo Newick y la reconstrucción
   D3 son **síncronos en el hilo principal** (riesgo de INP), y la futura
   tipografía `next/font` (P1) puede **introducir CLS** si no se vigila.

La buena noticia: **P0 ya resolvió** el grueso del piso de accesibilidad operable
(idioma, nombres accesibles, labels, foco/Escape del menú, _reduced motion_), y la
API `toJson` está **bien blindada**. Esta auditoría confirma esas decisiones y
ordena lo que falta en un _backlog_ nuevo y **sin solapamiento** con la Sección 7
del documento original (§6 de este informe).

---

## 2. Qué validó / cerró P0 (no re-trabajar)

Las skills nuevas **reafirman** las correcciones ya entregadas; no hay que repetirlas.

| Área (skill) | P0 entregado | Veredicto de la skill |
|---|---|---|
| `lang` correcto (a11y _Understandable_) | `<Html lang="es">` (`_document.js`) | ✅ cumple WCAG 3.1.1 |
| Nombres accesibles (a11y _Perceivable/Robust_) | `aria-label` en zoom y _burger_ | ✅ patrón "icon button" correcto |
| Labels asociados (a11y _Understandable_) | `htmlFor`/`id` en dashboard/selection/submenu | ✅ "labels and instructions" |
| Teclado (a11y _Operable_) | `Escape` + foco al abrir `SubMenu` | ✅ sin _keyboard trap_ |
| Motion (a11y / CWV) | guard `prefers-reduced-motion` | ✅ WCAG 2.3.3 |
| Re-render (CWV INP) | `useDeferredValue` corregido | ✅ alinea con "defer expensive renders" |
| Meta/microcopy (SEO/escritura) | erratas SEO + _sentence case_ + errores por caso | ✅ base correcta (pero el `<title>` sigue siendo genérico → WQ-S2) |

---

## 3. Resultados de la auditoría (por categoría Lighthouse)

### 3.1 Performance / Core Web Vitals — `core-web-vitals`, `web-quality-audit`

- **WQ-P1 · High · INP — trabajo síncrono en el hilo principal.** `parseStringToTree`
  (`src/lib/TreeData.js`) y la reconstrucción D3 (`hierarchy` + `dendrogramGenerator`
  en `src/components/dendrogram/dendrogram.js`) corren de forma síncrona; con árboles
  grandes bloquean la interacción. `core-web-vitals` recomienda **trocear y ceder**
  (`scheduler.yield()` / chunking) o un **Web Worker** para el parseo, y envolver el
  render con `useTransition`. _(Extiende E2/F5; P0 con `useDeferredValue` ya mitiga la
  parte de inputs.)_
- **WQ-P2 · Medium · LCP — héroe renderizado en cliente.** El lienzo D3 (el héroe)
  se monta solo cuando hay archivo (`name && <Dendrogram>` en `canvas.js`); sin
  archivo, el LCP es el _wordmark_ de texto. Al implementar el **estado vacío-héroe**
  (original A2/E1, P1 #7) y `next/font` (P1 #5), asegurar que el elemento LCP esté en
  el HTML inicial y no detrás de JS pesado.
- **WQ-P3 · Medium · CLS — riesgo introducido por P1.** Hoy **no hay fuente web**
  (sin FOUT) y el logo `Image` lleva `width/height` (sin _shift_). Pero `next/font`
  (P1 #5) puede **introducir CLS** si no se aprovechan las métricas de _fallback_
  automáticas. `core-web-vitals`: `font-display: optional` o `size-adjust`/overrides;
  `next/font` ya lo hace, pero **verificar CLS < 0.1** tras el cambio y reservar
  espacio en el estado vacío.
- **WQ-P4 · Low · LCP de navegación — Speculation Rules.** Prerenderizar rutas
  probables (`/demo`, `/dendrogram`) al _hover_ (`eagerness: "moderate"`) colapsa el
  LCP percibido de la siguiente navegación. Mejora progresiva (solo Chromium).
- **WQ-P5 · Low · Config.** `next.config.mjs` usa `images.domains` (**deprecado** en
  Next 15 → `images.remotePatterns`); `swr` parece **sin uso** (reafirma F8).

### 3.2 Accessibility (WCAG 2.2) — `accessibility`

> Las skill reafirma C1–C7 del original; abajo solo lo **nuevo o más fino**.

- **WQ-A1 · High · 1.4.3 Contraste (reafirma C2).** Umbrales concretos: etiqueta de
  archivo `bg-[#FAEECC]` + `text-[#000000] text-opacity-40` (~negro al 40 %) y texto
  blanco sobre botones `#6DA2D4`/`#4CBFB7` quedan **bajo 4.5:1**. Resolver **al
  tokenizar** (P1 #6), validando cada par con un medidor.
- **WQ-A2 · Medium · 2.4.1 _Skip link_.** No hay "Saltar al contenido". `index.js`
  pone primero la sidebar; un usuario de teclado tabula por todos los controles
  antes de llegar al lienzo. Añadir un _skip link_ al `<main>`. **Nuevo.**
- **WQ-A3 · Medium · 2.4.7 / 2.4.11 Apariencia de foco (WCAG 2.2).**
  `src/styles/globals.css` solo tiene las tres directivas `@tailwind`; sin estrategia
  global de `:focus-visible`. Varios botones (`bg-transparent`, solo icono) pueden
  quedar **sin foco visible**. Añadir un anillo de foco (≥ 3:1). **Nuevo.**
- **WQ-A4 · Medium · 1.3.1 / 2.4.6 Encabezados (también SEO).** `src/pages/index.js`
  **no tiene `<h1>`** ("Phily" es un `Card.Title`); `error.js` salta a `<h3>`. Sin
  esquema de documento para lectores de pantalla. Añadir un `<h1>` único (puede ser
  _visually-hidden_) y jerarquía coherente. **Nuevo.**
- **WQ-A5 · Low · 4.1.2 SVG decorativos.** Los iconos (`src/components/icons/*.js`,
  p. ej. `zoomAdd.js`) no marcan `aria-hidden="true"`. Como P0 ya da nombre por
  `aria-label` en el botón, el impacto es bajo, pero conviene ocultarlos. **Nuevo.**
- **WQ-A6 · Low · 2.5.8 Tamaño de objetivo (WCAG 2.2).** Los controles de zoom/_burger_
  son iconos ~24px; verificar área de toque ≥ 24×24 px CSS. **Nuevo.**
- **WQ-A7 · Low · 3.3.1 Identificación de error.** Los errores de carga salen en el
  modal (P0 mejoró el _copy_), pero el `input` de archivo no se asocia al error vía
  `aria-invalid`/`aria-describedby`. Menor en un flujo de un solo input. **Nuevo (fino).**
- **WQ-A8 · Low · Diálogo.** `error.js` usa `<dialog open>` nativo (no `showModal()`):
  queda **no modal**, sin _top-layer_ ni _focus trap_ automático. `accessibility`: el
  `<dialog>` solo atrapa el foco si se abre con `showModal()`. Evaluar el cambio
  (extiende C7).

### 3.3 SEO — `seo`

> Frente casi sin cubrir por el original (que solo tocó erratas de _meta_, H3).

- **WQ-S1 · High · _Crawlability_.** No existen `public/robots.txt` ni `sitemap.xml`.
  Añadir ambos (con Pages Router, `sitemap.xml` estático o generado). **Nuevo.**
- **WQ-S2 · High · `<title>` on-page.** `src/pages/_app.js` declara `<title>Phily</title>`:
  no descriptivo, sin _keywords_, igual en todas las rutas. Objetivo 50–60 caracteres
  (p. ej. "Phily — Visor y editor de dendrogramas filogenéticos") y **títulos por
  ruta** (`/demo`, `/dendrogram`). **Nuevo.**
- **WQ-S3 · Medium · Datos estructurados.** No hay JSON-LD. Añadir
  `WebApplication`/`SoftwareApplication` (nombre, descripción, `applicationCategory`,
  `offers` gratis, URL) para _rich results_. **Nuevo.**
- **WQ-S4 · Medium · Canonical.** Sin `rel="canonical"`. Añadir canónica
  auto-referenciada por página. **Nuevo.**
- **WQ-S5 · Medium · `<h1>` único.** Coincide con WQ-A4 (SEO + a11y).
- **WQ-S6 · Low · Contenido para _crawlers_.** La herramienta es client-side; el HTML
  inicial es pobre en texto. Aportar _copy_ descriptivo en el HTML inicial (encaja con
  el estado vacío-héroe, P1 #7). **Nuevo.**
- **WQ-S7 · Low · Manifest/PWA.** Sin `manifest.json`/`theme-color` (opcional). **Nuevo.**

### 3.4 Best Practices — `best-practices`

- **WQ-B1 · High · Cabecera obsoleta.** `next.config.mjs` define
  `xssProtection: 'sanitize'` → emite `X-XSS-Protection`. `best-practices` indica
  **no enviar** esa cabecera (el _auditor_ legacy se eliminó de Chromium y puede
  introducir fallos). Quitarla y apoyarse en la CSP. **Nuevo.**
- **WQ-B2 · High · CSP con `'unsafe-inline'` en `default-src`.** `defaultSrc:
  ['self', 'unsafe-inline']` cascada a las _fetch directives_ no declaradas. En prod
  `scriptSrc` ya está ajustado (sin `unsafe-inline`/`eval` — bien); falta **sacar
  `'unsafe-inline'` de `default-src`** y revisar que las claves se emitan entre
  comillas (`'self'`). **Nuevo.**
- **WQ-B3 · Medium · HSTS.** No se envía `Strict-Transport-Security`.
  `next-secure-headers` (`forceHTTPSRedirect`) puede añadir HSTS; el `nginx/http.conf`
  solo escucha en `:80` (sin TLS/HSTS en el borde). Añadir HSTS cuando se termine
  HTTPS (también señal de confianza SEO). **Nuevo.**
- **WQ-B4 · Low · Cabeceras restantes.** Sin `Permissions-Policy`; confirmar que
  `X-Content-Type-Options: nosniff` se emite. **Nuevo.**
- **WQ-B5 · Medium · Lint fuera del build.** `next.config.mjs` tiene
  `eslint.ignoreDuringBuilds: true` → `next build` **no** corre ESLint. El verificador
  ya ejecuta `npm run lint` aparte (sigue protegido), pero **documentarlo** para que
  un CI que solo haga `build` no pierda cobertura de lint (`[[verification]]`). **Nuevo.**
- **WQ-B6 · Low · Higiene de dependencias.** `npm audit`; retirar `swr` si no se usa
  (reafirma F8); migrar `images.domains` → `remotePatterns` (WQ-P5).
- **WQ-B7 · ✅ Positivo.** `src/pages/api/toJson.js` está **bien blindado**: allowlist
  de método (`POST`), validación de tipo, tope de 1 MB y `catch` con mensaje genérico.
  Mantener este patrón; Zod en el borde de archivos sigue intacto (architecture).
- **WQ-B8 · Low · Superficie XSS.** Los nombres de nodo se pintan como `<text>` SVG vía
  React (auto-escapado — seguro). En rutas de exportación/serialización, evitar
  `innerHTML`; si se inyecta SVG como string, sanear (Trusted Types/DOMPurify, per
  `best-practices`). Reafirma "no XSS vía SVG/string" de `architecture.md`.

---

## 4. Mapa de severidad (resumen estilo Lighthouse)

| Categoría | Critical | High | Medium | Low |
|---|---|---|---|---|
| Performance / CWV | — | WQ-P1 | WQ-P2, WQ-P3 | WQ-P4, WQ-P5 |
| Accessibility | — | WQ-A1 | WQ-A2, WQ-A3, WQ-A4 | WQ-A5, WQ-A6, WQ-A7, WQ-A8 |
| SEO | — | WQ-S1, WQ-S2 | WQ-S3, WQ-S4, WQ-S5 | WQ-S6, WQ-S7 |
| Best Practices | — | WQ-B1, WQ-B2 | WQ-B3, WQ-B5 | WQ-B4, WQ-B6, WQ-B8 |

**Conteo:** 0 Critical · 6 High · 8 Medium · 9 Low · 1 positivo (WQ-B7).
Sin _Critical_: no hay vulnerabilidades abiertas ni fallos totales; la CSP y la API
ya dan una base razonable.

---

## 5. Resumen por categoría (formato `web-quality-audit`)

- **Performance / CWV:** 5 hallazgos (0 críticos). Prioridad: sacar el parseo/render
  del hilo principal (WQ-P1) y blindar CLS antes de añadir `next/font` (WQ-P3).
- **Accessibility:** 8 hallazgos (0 críticos), sobre una base P0 ya sólida. Prioridad:
  contraste al tokenizar (WQ-A1), `skip link` + foco visible (WQ-A2/A3) y `<h1>` (WQ-A4).
- **SEO:** 7 hallazgos. Prioridad: `robots.txt`/`sitemap.xml` (WQ-S1) y `<title>`
  descriptivo por ruta (WQ-S2); luego JSON-LD y canonical.
- **Best Practices:** 8 hallazgos + 1 positivo. Prioridad: quitar `X-XSS-Protection`
  (WQ-B1) y limpiar `default-src` (WQ-B2); documentar lint-fuera-de-build (WQ-B5).

---

## 6. Backlog nuevo (candidatos a _features_, sin solapar con §7)

> Complementa el _backlog_ P0–P2 de `[[ux-ui-investigation]]` (P0 ya cerrado). Estos
> ítems son **nuevos**; donde tocan algo planificado, se indica el cruce.

### Q0 — Ganancias rápidas, ronda 2 (bajo costo / alta confianza)

1. **Endurecer cabeceras:** quitar `xssProtection` (X-XSS-Protection) y sacar
   `'unsafe-inline'` de `default-src` en `next.config.mjs`. _(WQ-B1, WQ-B2)_
2. **SEO _crawlability_:** añadir `public/robots.txt` + `sitemap.xml`. _(WQ-S1)_
3. **`<title>` descriptivo por ruta** (+ canonical opcional). _(WQ-S2, WQ-S4)_
4. **`<h1>` único + jerarquía** en la página principal (h1 _visually-hidden_ válido).
   _(WQ-A4 / WQ-S5)_
5. **_Skip link_ + `:focus-visible`** global en `globals.css`. _(WQ-A2, WQ-A3)_
6. **`aria-hidden` en SVG decorativos** de `icons/*`. _(WQ-A5)_

### Q1 — Profundidad SEO y descubrimiento

7. **Datos estructurados JSON-LD** (`WebApplication`). _(WQ-S3)_
8. **Copy descriptivo en HTML inicial** (se integra con el estado vacío-héroe P1 #7).
   _(WQ-S6)_
9. **Manifest/PWA + `theme-color`** (opcional). _(WQ-S7)_

### Q2 — Endurecimiento de seguridad

10. **HSTS** cuando se termine HTTPS (next-secure-headers/nginx). _(WQ-B3)_
11. **`Permissions-Policy`** + verificar `nosniff`. _(WQ-B4)_
12. **Higiene de dependencias:** confirmar/retirar `swr`, `images.remotePatterns`,
    `npm audit` en CI. _(WQ-B6, WQ-P5)_

### Q3 — Red de seguridad Core Web Vitals (plegar en P1/P2)

13. **Vigilar CLS < 0.1** al añadir `next/font` (P1 #5) y el estado vacío (P1 #7).
    _(WQ-P3)_
14. **Sacar el parseo/render del hilo principal** (Web Worker o `scheduler.yield`) +
    `useTransition`. _(WQ-P1; extiende E2/F5)_
15. **Speculation Rules** para `/demo` y `/dendrogram`. _(WQ-P4)_
16. **Pase de contraste** dentro de la tokenización (P1 #6). _(WQ-A1)_
17. **Tamaño de objetivo ≥ 24px**, error ligado al campo (`aria-invalid`), y
    `dialog.showModal()`. _(WQ-A6, WQ-A7, WQ-A8)_
18. **Documentar lint-fuera-de-build** y mantener lint en verificador/CI. _(WQ-B5)_

---

## 7. Cruce con la investigación original

| Tema original | Estado tras P0 + esta auditoría |
|---|---|
| C1 `lang` | ✅ resuelto en P0; reafirmado por `accessibility` |
| C2 contraste | abierto → **WQ-A1** (resolver al tokenizar, P1 #6) |
| C3 reduced motion | ✅ resuelto en P0 |
| C4/C5/C6 labels/nombres/teclado | ✅ resuelto en P0 |
| C7 modal de error | extendido → **WQ-A8** (`showModal()`) |
| E2 carga/`useTransition` | extendido → **WQ-P1** (worker / yield) |
| F3 `useDeferredValue` | ✅ resuelto en P0 |
| F8 `swr` sin uso | reafirmado → **WQ-B6** |
| H3 erratas _meta_ | ✅ resuelto en P0; **título genérico** sigue → **WQ-S2** |
| _Nuevos por las skills_ | SEO técnico (WQ-S1/S3/S4/S6/S7), cabeceras (WQ-B1/B2/B3/B4), `<h1>` (WQ-A4), _skip link_/foco (WQ-A2/A3), CWV main-thread/CLS (WQ-P1/P3) |

---

## 8. Riesgos y consideraciones

- **No tocar código de producto** en este documento (es investigación); el _green
  gate_ (`./init.sh`: lint + build) se mantiene.
- **Cabeceras:** validar la CSP en un _staging_ real antes de endurecer; un
  `default-src` mal ajustado puede romper estilos/inline legítimos de DaisyUI/Next.
- **CWV vs. P1:** la tipografía y el estado vacío deben medirse con Lighthouse para
  no regresar CLS/LCP.
- **SEO de SPA:** Phily es una herramienta, no un sitio de contenido; el objetivo SEO
  es _descubribilidad_ básica (robots/sitemap/título/JSON-LD), no _keyword stuffing_.
- **Worker para el parseo:** mover `parseStringToTree` a un Worker implica serializar
  el árbol; cuidar que no rompa el _pipeline_ D3 (objetos no serializables viven en
  Redux con checks desactivados — `architecture.md`).

---

## 9. Verificación y post-feature

- **Naturaleza:** documento (sin cambios de código de producto).
- **Green gate:** `./init.sh` (lint + build) permanece verde; este archivo vive en
  `.handyman/docs/` (capa de docs versionada del harness).
- **Post-feature (docs del harness):** **ningún** cambio requerido ahora (no se tocó
  código). Cuando se implementen Q0–Q2, actualizar:
  - `docs/conventions.md`: regla "no enviar `X-XSS-Protection`; CSP sin `'unsafe-inline'`
    en `default-src`"; convención de `<title>`/`<h1>` por página; `aria-hidden` en SVG.
  - `docs/architecture.md`: cabeceras de seguridad y datos estructurados como parte
    del _shell_; Worker para parseo si se adopta.
  - `docs/verification.md`: nota de que `next build` ignora ESLint (WQ-B5) y por qué
    el verificador corre `npm run lint` aparte.
  - `docs/business.md`: SEO/onboarding (robots/sitemap, copy inicial) si se prioriza.

---

## 10. Apéndice — Índice de literatura aplicada

| Skill | Hallazgos |
|---|---|
| `web-quality-audit` (marco, severidades) | §3–§5 (estructura), conteo §4 |
| `core-web-vitals` (LCP/INP/CLS, speculation rules) | WQ-P1, WQ-P2, WQ-P3, WQ-P4 |
| `accessibility` (WCAG 2.2: skip link, foco, headings, target size, dialog) | WQ-A1…WQ-A8 |
| `seo` (robots/sitemap, título, JSON-LD, canonical, headings) | WQ-S1…WQ-S7 |
| `best-practices` (X-XSS-Protection, CSP, HSTS, SRI/Trusted Types, deps) | WQ-B1…WQ-B8 |
