# Code Conventions

## Language And Runtime

- **Language:** JavaScript (ES modules, JSX). No TypeScript.
- **Runtime:** Node.js for dev; Bun in the Docker image.
- **Formatter:** Prettier 3.2.5.
- **Linter:** ESLint (`eslint .`, flat config in `eslint.config.mjs`, `eslint-config-next` + `eslint-plugin-react`).
- **Imports:** use the `@/*` alias for `src/*`; group external before internal.
- **Naming:** components in PascalCase files matching the export; hooks `useX.js`; Redux slices `slice.js` under `store/<domain>/`.

## Structure

- Components: `src/components/<area>/`, with logic extracted into a co-located `hooks/` folder.
- Redux: one slice per domain, `src/components/store/<domain>/slice.js`; keep the RESET action.
- Tree logic: `src/lib/TreeData.js`.
- API routes: `src/pages/api/**`.
- Validators: Zod schemas (e.g. `src/components/dashboard/validators/`).

## Tests

- No automated test runner is configured yet (see feature 1 and `verification.md`).
- When added, prefer Vitest/Jest with tests co-located as `*.test.js` or under a `tests/` folder.
- Favor unit tests on pure functions (TreeData methods, Newick parsing, format conversion).

## Error Handling

- Validate file inputs with Zod at the boundary; reject invalid input.
- Surface user-facing failures through the `error` Redux slice and the error modal.
- Avoid silent `catch` blocks that swallow errors.

## Comments

Prefer clear names. Add comments only for non-obvious reasoning (e.g. why
serializable checks are disabled, D3 ref/memo timing).
