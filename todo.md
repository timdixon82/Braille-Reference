# To-do: Braille-Reference

Outstanding and future work for the `timdixon82/Braille-Reference` project. Items are grouped by priority: setup work that must be done before the project is considered adopted, and future milestones that are planned but not yet scoped.

## Setup work (outstanding)

These items are part of the adoption build (work 006-braille-reference-setup) and are assigned to Sean unless noted.

### Add a version string (Q16)

Tim decided at Q16 that this project, and every repository going forward, must carry a version string.

- Create a `VERSION` file at the repository root containing the initial semantic version on one line (for example `0.1.0`).
- Add a small, unobtrusive version note to the page, such as a footer. The exact placement is a project decision; the version must be reachable without knowing where to look.
- The release-please workflow reads `VERSION` and updates it on each release.

Standard: [AgentTeam global wiki: coding-standards.md](../AgentTeam/docs/coding-standards.md), Repository Standards section.

### Expand the README (Q17)

Tim decided at Q17 that this project, and every repository going forward, must have a README that a new reader can use to understand and run the project.

The expanded README must cover at minimum:

- What the project is, in plain language.
- How to run or use it locally (a single `python3 -m http.server` command is enough for a static project with no build step).
- The file structure.
- A link to the live site on GitHub Pages, with descriptive link text.

The README follows the screen-reader output style: one H1, ordered headings, no skipped levels, descriptive link text, no emoji.

Standard: [AgentTeam global wiki: coding-standards.md](../AgentTeam/docs/coding-standards.md), Repository Standards section.

### Add Content-Security-Policy and Referrer-Policy meta tags

Add a `<meta http-equiv="Content-Security-Policy">` tag as the first element in `<head>` after `<meta charset>`, using the interim policy value from [Decision Record 003](docs/decisions/003-github-pages-security-headers.md).

Add a `<meta name="referrer" content="strict-origin-when-cross-origin">` tag in `<head>`.

Carol tests the page under the active CSP in a real browser before each release.

### Fix focus indicator contrast (WCAG 2.2 SC 1.4.11 and SC 2.4.13)

Darken the focus ring colour from `#FF6F00` to a colour that achieves at least 3 to 1 contrast against `#FFFFFF` and `#fafbfc`. The existing navy `#0A2342` achieves 15.77 to 1 and satisfies both criteria.

Also update `accent-color` on checkboxes and radios.

See [docs/accessibility.md](docs/accessibility.md), Failure 1.

### Fix input and fieldset border contrast (WCAG 2.2 SC 1.4.11)

Replace the shared border colour `#CBD5E0` with a colour that achieves at least 3 to 1 against white. A mid-grey such as `#767676` achieves 4.54 to 1.

See [docs/accessibility.md](docs/accessibility.md), Failure 2.

### Pin linters in a development manifest

Add a `package.json` at the repository root, marked `"private": true`, with the project's linters (HTMLHint, Stylelint, ESLint) each pinned to an explicit version. Commit `package-lock.json` alongside it. Add `node_modules/` to `.gitignore`.

Standard: [AgentTeam global wiki: decisions/006-adopted-static-project-standards.md](../AgentTeam/docs/decisions/006-adopted-static-project-standards.md), standard 4.

### Swap GoatCounter tracker placeholder before merge

The GoatCounter snippet in `index.html` currently uses the placeholder value `__BRAILLE_REFERENCE_TRACKER_PLACEHOLDER__` for the `data-goatcounter` attribute. Before this pull request is merged, swap the placeholder for the real tracker URL from Tim's GoatCounter dashboard. Sonja batches this question to Tim (Q53 or next available).

## Minor accessibility improvements

These are not blocking issues but improve the project's accessibility posture toward full WCAG 2.2 AAA conformance.

- Cap text column width at `max-width: 70ch` to satisfy SC 1.4.8 at wide viewports.
- Increase checkbox and radio label target size to 44 by 44 CSS pixels to satisfy SC 2.5.5.
- Adjust the muted-text-on-highlight contrast to reach 7 to 1 for SC 1.4.6.
- Remove `tabIndex=0` from `tr` elements, or add a keyboard handler and an accessible label, to address the advisory finding in [docs/accessibility.md](docs/accessibility.md).
- Remove `aria-describedby` from the `table` element (redundant with the `caption`).
- Remove `aria-live="polite"` from the status element (redundant with `role="status"`).
- Add a "Terms used" section to the page defining specialist braille vocabulary, to satisfy SC 3.1.3.

## Future milestone: full Unified English Braille coverage (Q15B)

Tim decided at Q15B that the current data set, covering the most common UEB Grade 2 contractions and shortforms (approximately 175 entries), is the intended scope for now.

Full Unified English Braille (UEB) coverage is a named future milestone, planned as a separate piece of work. When that work is scoped, it should include:

- A review of the complete UEB symbol inventory.
- A data audit of existing entries for accuracy.
- A decision on how additional categories are structured and labelled.
- An update to the requirements in the project's business analysis document.

This milestone is not part of the adoption work and is not scheduled.

## Future milestone: file split

Split `index.html` into four separate files (see [Decision Record 001](docs/decisions/001-single-file-structure.md)):

- `index.html`: page structure only.
- `css/styles.css`: all presentation.
- `js/braille-reference.js`: behaviour, helpers, rendering, search parsing, and filtering.
- `js/braille-data.js`: the UEB data set.

The split is a refactor that must not change behaviour, appearance, or accessibility. It is a precondition for the stricter Content-Security-Policy target value in [Decision Record 003](docs/decisions/003-github-pages-security-headers.md).
