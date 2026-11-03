# Brief: 012-minimatch-override

## Summary

Clear the last open Dependabot alert (alert 112, minimatch, GHSA-g3hv-75wg-m249,
fixed in 11.0.1 or later) by adding `"overrides": {"minimatch": "^11.0.1"}` to
`package.json` and regenerating `package-lock.json` with the smallest change.
minimatch now resolves to 11.0.4.

This work is stacked on Dependabot pull request 45, which moves eslint to 10.
eslint 10 accepts minimatch 11; eslint 9 on main would not, so the override
cannot go onto main directly. After this pull request merges into the
Dependabot branch, pull request 45 carries the fix to main.

Removal condition: remove the override once eslint depends on minimatch 11
itself.

- Status: active
- Branch: fix/minimatch-override
- Priority: 2
- Blockers: Pull request 45 must merge first (or carry this change)

## Out of scope

- Any other dependency change.
- Workflows and `.github/` tooling.
- Feature changes.

## Risk and rollback

Development tooling only; nothing ships to the live site. Lint, 177 unit tests
and `npm audit` (0 vulnerabilities) pass. Rollback: revert the single pull
request.

## Definition of done

- `npm ci`, `npm run lint`, `npm test` pass.
- `npm audit` reports no minimatch finding.
- One pull request open with the Dependabot branch as base, not merged.
