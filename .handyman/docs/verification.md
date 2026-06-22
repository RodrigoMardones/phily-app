# Verification

The agent does not claim it works; it demonstrates it.

## Required Commands

```bash
./init.sh
```

`init.sh` runs, in order: tool checks (`jq`, `npm`), harness-file checks,
feature-state check, then the quality gates:

```bash
npm run lint     # ESLint over the project
npm run build    # Next.js production build
npm test         # only if a test script exists (see gap below)
```

## Gap: No Automated Test Runner

The project currently ships **no test runner** (only `dev`, `build`, `start`,
`lint` scripts). Because of this:

- `require_tests_to_close` is set to `false` in `feature_list.json`.
- `init.sh`'s `run_test` gate is a documented soft-pass: it runs `npm test`
  only if a `test` script exists, otherwise prints a NOTE and returns 0.
- The current quality gates that must be green are **lint** and **build**.

Feature 1 (`test_harness_setup`) closes this gap. After it lands, replace the
soft-pass with the real test command and flip `require_tests_to_close` to `true`.

## Test Levels (target state)

1. Unit tests for pure functions (TreeData methods, Newick parsing, format conversion).
2. Integration tests for user-facing flows (upload → render, export).
3. Optional smoke test for end-to-end confidence.

## Anti-patterns

- Marking `done` with a red lint or build.
- Adding a test gate that always returns 0 once a runner exists.
- Tests that only assert "no exception".
- Mocking the core behavior that should be proven.
