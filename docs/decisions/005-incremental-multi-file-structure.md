# Decision Record 005: Move to an incremental multi-file structure

## Status

- State: Accepted
- Decided: 2026-07-14
- Supersedes: 001
- Superseded by: None

## Context

Decision Record 001 kept Braille Reference as a single `index.html` file for the project-adoption work, and recommended a full four-file split (`index.html`, `css/styles.css`, `js/braille-reference.js`, `js/braille-data.js`) as follow-up work, done in one pass.

Since then, Sean extracted the UEB data set and the DOM-free conversion helpers into `js/braille-data.js`, imported into `index.html` via `<script type="module">`, so that the braille-mapping logic can be unit tested in isolation (`js/braille-data.test.js`). This is a partial extraction: the CSS remains an inline `<style>` block and the DOM-bound rendering, filtering, and event-wiring code remains an inline `<script>`.

Tim has approved moving to a multi-file structure. This record confirms that direction, replaces Decision Record 001's "split in one pass" framing with an incremental one, and records the extraction already done as its first accepted step.

## Decision

Braille Reference moves to a multi-file structure, built up incrementally rather than in a single split. Each extraction step must be behaviour-preserving, reviewed on its own, and must not alter appearance, accessibility, or the page's public behaviour.

Step 1, accepted by this record: `js/braille-data.js` holds the UEB `data` array and the DOM-free helper functions (`dotsToChar`, `cellsToBraille`, `describeCell`, `cellsToDotsText`, `categoryLabel`, `parseDotInput`, `cellEqual`, `cellsContain`). It is imported into `index.html` with a native ES module `<script type="module">` and a relative, extension-qualified specifier (`./js/braille-data.js`). `js/braille-data.test.js` unit-tests this module directly.

The module boundary is: pure data and DOM-free logic in `js/braille-data.js`; everything that touches `document`, `window`, or a DOM event stays inline in `index.html` until a later step extracts it.

Further steps remain open, to be scheduled as separate, named pieces of work, not committed to a single timeline here:

- Extract the inline `<style>` block into `css/styles.css`.
- Extract the DOM-bound rendering, filtering, and event-wiring code from the inline `<script type="module">` into `js/braille-reference.js`, once the CSS extraction makes it worthwhile to also drop the inline script entirely.

Each future step is its own decision to schedule, but not its own architecture decision to approve — this record is the standing approval for the multi-file direction. A future record is only needed if a step deviates from the module boundary or the no-build constraint set here.

This record does not change project's hosting, dependency, or CSP posture. Decision Record 003's interim Content-Security-Policy (`script-src 'self' 'unsafe-inline'`, `style-src 'self' 'unsafe-inline'`) still applies while any script or style content remains inline; Decision Record 003's target policy remains the trigger to revisit once both extractions are complete.

## Alternatives considered

### Do the full four-file split in one pass, as Decision Record 001 originally recommended

Rejected for this record. Tim approved the direction, not a mandate to do it all now. Splitting the CSS and the DOM-bound script in the same change as this record would mix a larger, harder-to-review diff with a change that was made for a specific, narrower reason (testability of the data and helpers). Smaller, independently reviewable steps keep Jed's and Carol's reviews focused and keep the audit trail clear about why each step happened.

### Keep the single-file structure permanently

Rejected. Decision Record 001 already gave the reasons a split is worthwhile (browser caching of separate files, cleaner change history, standard linting, a stricter Content-Security-Policy without `'unsafe-inline'`). Tim's approval removes the "not yet" framing; nothing has changed to make those reasons weaker.

### Adopt a bundler alongside the split

Not proposed and not needed. Decision Record 002's no-build-step decision is unaffected by this record. Native ES modules resolve in the browser with no bundler, and the project has no third-party package to bundle (Decision Record 004). If a future step introduces a genuine bundler trigger — many modules, a third-party package needing resolution, or a build-time-only tool — Decision Record 002 already names the expected choice (a light bundler such as Vite) and states that reopening the no-build decision is a separate step from this one.

## Consequences

- Decision Record 001 is superseded by this record and its `## Status` block is updated accordingly. Its context and reasoning remain valid as history.
- `js/braille-data.js` and its accompanying `js/braille-data.test.js` are the first accepted piece of the multi-file structure. No further action is required on them beyond routine maintenance.
- The cross-reference comments in `js/braille-data.js` and in the inline `<script type="module">` block in `index.html`, which currently point at Decision Record 001, should be updated to point at this record (005) as routine cleanup, not as a correctness issue.
- Future extraction steps (CSS, then the DOM-bound script) remain open follow-up work, each to be scoped and reviewed on its own, consistent with Decision Record 001's original caution against mixing a refactor with an unrelated task.
- Decision Record 003's interim Content-Security-Policy stays in force until both remaining extraction steps are complete; its target policy (dropping `'unsafe-inline'` from `script-src` and `style-src`) remains the marker of when the multi-file structure is functionally complete.
- Decision Record 002 (no build step) and Decision Record 004 (zero third-party dependencies) are unaffected and continue to apply without change.
