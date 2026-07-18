# Brief: 010-dependabot-js-yaml-fix

## Summary

GitHub Dependabot alert #4 flags `js-yaml` (a transitive development
dependency, pulled in via the project's eslint tooling) in the root
`package-lock.json`, at a version vulnerable to a quadratic-complexity
denial-of-service in merge-key handling. This work bumps it to the patched
version. Three related alerts (adm-zip, a second js-yaml instance, and
form-data, all in `.github/accessibility-tools/package-lock.json`) were
already resolved automatically by the 2026-07-18 template sync and need no
further action.

- Status: active
- Branch: sean/fix-js-yaml-dependabot
- Mockup mode: D — no mockup needed; this is a lockfile-only dependency bump
- Priority: 3
- Blockers: None

## Requirements

Bump `js-yaml` in the root `package-lock.json` (used only by development
tooling, not shipped to the live site) from the vulnerable range
`>= 4.0.0, <= 4.1.1` to `4.2.0` or later, the first patched version per
Dependabot alert #4. No direct `package.json` dependency changes are
expected, since `js-yaml` is transitive.

## Routing plan

Sean bumps the dependency and confirms `npm run lint` and `npm test` still
pass. Carol confirms CI is green and the Dependabot alert clears. No
architecture or security review needed beyond Carol's pass: this is a
development-only dependency with no runtime or user-facing surface.

## Out of scope

- The three already-fixed alerts (adm-zip, form-data, and the
  accessibility-tools js-yaml instance) — no action needed, already
  resolved by the template sync.
- Any other dependency upgrades not tied to an open Dependabot alert.
- Changes to `.github/accessibility-tools/package-lock.json` — already
  current.

## Risk and rollback

Risk: a transitive dependency bump could in principle change the behaviour
of an eslint plugin that depends on `js-yaml`'s YAML parsing, though this is
very unlikely for a patch-level security fix.

Rollback: revert the single commit that updates `package-lock.json`; no
other files change.

## Definition of done

- [ ] `js-yaml` in the root `package-lock.json` is at 4.2.0 or later
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] CI is green on the pull request
- [ ] Dependabot alert #4 shows as fixed after merge

## Approved GitHub actions

- [x] Create a branch
- [x] Commit to a branch
- [x] Push a branch other than the main branch
- [x] Open a pull request
- [x] Comment on a pull request or an issue
- [x] Create an issue

## Not pre-approved

- Merging to the main branch. This always needs Tim's express approval at the time.
- Publishing to a blog or a social media account.

## Never allowed

The hard deny-list from `CLAUDE.md`: force-push, branch deletion, history
rewrite, repository deletion, repository visibility change,
branch-protection edits, collaborator changes, release deletion, and
disabling secret or code scanning.
