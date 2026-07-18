# Work Brief: 008-playwright-tests

## Summary

Write Playwright end-to-end tests for the Braille-Reference tool and enable the Playwright CI workflow. The workflow file (`.github/workflows/playwright.yml`) is already scaffolded but fully commented out because no tests exist yet. This work creates the tests in `tests/e2e/`, adds a root `package.json` with Playwright as a dev dependency, and uncomments the workflow steps so the CI job goes green on every pull request.

Carol flagged Playwright functional tests as a medium-priority open item after the last release. This work closes that item.

## Status

Status: done

## Mockup mode

D — no mockup needed. This is test code and CI configuration, not a UI change.

## Items in scope

### Test location and runner

- Tests live in `tests/e2e/` in the repository root.
- The project has no root `package.json` today. Sean must create one with Playwright as a dev dependency and add an `npm test` or `npm run test:e2e` script that runs `npx playwright test`.
- Playwright runs against `index.html` served by a local static server, not against the live GitHub Pages URL. The accessibility workflow already uses `npx serve` or a similar static server via `wait-on`; Sean should follow the same pattern. The test setup should start a static server on a localhost port, wait for it to be ready, run the tests, then stop the server.
- The workflow uncomment work is part of this scope. Once at least one test exists, Sean uncomments the relevant steps in `.github/workflows/playwright.yml` and replaces the placeholder test command with the actual command.

### Functional flows to cover

The following flows each need at least one test. Acceptance criteria are written as conditions that are either true or false.

#### 1. Page load

- The page loads without a JavaScript error in the console.
- The results table contains at least one row after the page loads.
- The status element (the element with `role="status"`) does not show "Loading..." after the page has finished loading.

#### 2. Grade filter

- Selecting the "Grade 1" radio button removes rows that are Grade 2 only from the table.
- Selecting the "Grade 2" radio button shows rows for both grades.
- Selecting the "All" radio button restores all rows.
- Category checkboxes that are Grade 2 only (for example, Wordsigns, Groupsigns, Final-letter contractions, Shortforms) are hidden when "Grade 1" is selected.
- Those same checkboxes are visible when "Grade 2" or "All" is selected.

#### 3. Text search

- Typing a letter or word into the text search input filters the table so that only rows whose Print, Braille, or Notes columns contain that text are shown.
- The status element updates to show a count that matches the number of visible rows.
- Typing a string that matches nothing shows zero rows and the status element says "No results" (or similar; check the exact wording in `index.html`).

#### 4. Dot-pattern search

- Typing a dot pattern such as "1 2 3" into the dot-pattern search input filters the table to rows whose Dot pattern column matches.
- The status element updates to reflect the result count.
- Typing a pattern that matches nothing shows zero rows.

#### 5. Clear buttons

- Activating the clear button next to the text search input clears the text input value and restores all rows that were hidden by that filter.
- Activating the clear button next to the dot-pattern search input clears the dot input value and restores all rows that were hidden by that filter.
- The status element updates after each clear.

#### 6. Category checkboxes

- Unchecking a category checkbox removes rows in that category from the table.
- Re-checking it restores those rows.
- Unchecking all checkboxes shows zero rows.

#### 7. Terms used section

- The page contains a "Terms used" section.
- That section contains at least one definition (a `dt` or equivalent element with a term name).

## Out of scope

- Playwright visual regression (screenshot comparisons). These are expensive to maintain and brittle on a static reference page. They are not part of this work.
- Accessibility testing. That is the job of `accessibility.yml`, which already runs axe-core and Pa11y. Playwright tests cover functional behaviour only.
- Screen reader testing (VoiceOver, JAWS, NVDA). This is a Tim-side gate handled separately.
- Any change to `index.html`, `style.css`, or the braille data. This work touches only `tests/e2e/`, `package.json`, `playwright.config.js` (or equivalent), and `.github/workflows/playwright.yml`.

## Risk and rollback

Low risk. No production code changes. The only blast radius is a failing CI job, which blocks a pull request but does not affect the live site.

If the static server approach causes test flakiness, Sean should add a `wait-on` or Playwright `waitForLoadState` guard. The accessibility workflow's server startup pattern is the reference.

The root `package.json` introduces a new Node.js dependency surface. Jacob should be consulted if the architecture of having two `package.json` files (root and `.github/accessibility-tools/`) raises a concern. For now, the assumption is that the root file manages test tooling and the accessibility-tools file manages CI audit tooling, keeping them separate.

Rollback: revert the PR. The playwright workflow returning to a placeholder echo step is harmless.

## Definition of done

- A root `package.json` exists with Playwright as a dev dependency and a test script.
- At least one Playwright test exists in `tests/e2e/` for each of the seven functional flows listed above.
- All tests pass locally with `npm test` (or `npm run test:e2e`) run from the repository root.
- The relevant steps in `.github/workflows/playwright.yml` are uncommented and the placeholder step is removed.
- The Playwright CI job is green on the pull request.
- Carol has completed a functional test pass confirming no regressions.
- A pull request is open and all CI checks (lint, accessibility, Playwright) pass.
- Sonja has run the merge gate and Tim has approved the merge.

## Agent routing

1. **Jacob** — architecture review. Confirm the approach: root `package.json` for Playwright alongside `.github/accessibility-tools/package.json` for audit tools. Flag any concern before Sean starts.
2. **Sean** — implement: create `package.json`, write the tests in `tests/e2e/`, create `playwright.config.js` (or `playwright.config.ts`), uncomment the workflow steps, and open a pull request on a branch `feat/playwright-tests`.
3. **Carol** — test pass (functional) and confirm the Playwright CI job is green. Update the release checklist.

## Approved GitHub actions

All six pre-approved by Tim on 2026-06-05:

- Create a branch
- Commit to a branch
- Push a branch other than main
- Open a pull request
- Comment on a pull request or issue
- Create an issue
