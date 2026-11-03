# Brief: 011-dependency-alerts

## Summary

Clear the open Dependabot alerts in the root `package-lock.json` (29 open on
2026-11-03, all development scope). Targeted `npm update` within existing
ranges fixes vite, postcss, postcss-selector-parser, js-yaml, fast-uri,
source-map-js and brace-expansion. The critical tinypool alerts and the
`@vitest/mocker` and `vitest` alerts need vitest 4, because vitest 3 pins
tinypool 1.x. The `vitest` range in `package.json` moves from `^3.0.0` to
`^4.1.12`. vitest 4 drops tinypool entirely.

- Status: active
- Branch: fix/dependency-alerts
- Priority: 2
- Blockers: None

## Out of scope

- Feature changes.
- `.github/lint-tools` and `.github/accessibility-tools` (handled elsewhere).
- Workflows.
- The open Dependabot group pull request that proposes eslint 10, stylelint
  17, vitest 5 and other major bumps. That stays a separate decision.
- The minimatch alert (needs a version above eslint 9 and eslint 10 both
  pull in), left open and documented.

## Risk and rollback

Development tooling only; nothing ships to the live site. The main risk is the
vitest major upgrade changing test behaviour. Lint and the 177 unit tests pass
after the upgrade. Rollback: revert the single pull request.

## Definition of done

- `npm ci`, `npm run lint` and `npm test` pass.
- `npm audit` shows only the documented remaining items.
- One pull request open against main, not merged.
