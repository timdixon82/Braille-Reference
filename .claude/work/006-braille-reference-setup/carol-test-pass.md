# Carol Test Pass: Braille-Reference setup PR 1

Test date: 2026-05-23
Tester: Carol
Branch: chore/project-setup (HEAD 63326d0)
Base: main
Pages: index.html
Stack: Static front-end, GitHub Pages
Verdict: Pass with deferred items

---

## Part 1: Functional pass

### 1.1 HTML lint

CI check "Lint HTML, CSS, and JavaScript" passed (exit 0) on commit 63326d0, confirmed by `gh pr checks 1 --repo timdixon82/Braille-Reference`. Local npm run is not available in this session due to shell restrictions; CI result is authoritative.

Result: Pass.

### 1.2 CSS lint

Same CI check, same result. The `lint:css` step runs with `--allow-empty-input` because there are no separate CSS files in the current single-file phase. Exit 0 confirmed.

Result: Pass.

### 1.3 JavaScript lint

Same CI check, same result. The `lint:js` step runs with `--no-error-on-unmatched-pattern` because there is no `js/` directory in the current single-file phase. Exit 0 confirmed.

Result: Pass.

### 1.4 Workflow lint (actionlint)

Sonja confirmed actionlint passes locally. The work log entry for commit `c5d7c0d` states "all five files pass actionlint exit 0". Five workflow files present: `ci.yml`, `accessibility.yml`, `security.yml`, `codeql.yml`, `release.yml`. All five were inspected by code review.

Structural review findings:

- `ci.yml`: correct triggers (pull_request, push to main), pinned action SHAs, npm ci, three lint steps. Passes structural review.
- `accessibility.yml`: Pa11y and axe-core steps, Python HTTP server on port 8080, wait-on, browser-driver-manager, pa11y.json providing chromeLaunchConfig args. Passes structural review.
- `security.yml`: Semgrep, Trivy (CRITICAL and HIGH), dependency-review on pull_request only. Passes structural review.
- `codeql.yml`: CodeQL for JavaScript, pinned SHA. Passes structural review.
- `release.yml`: release-please-action, pinned SHA, reads config and manifest files. Passes structural review.

No untrusted GitHub context variables interpolated into any run step across all five files. All action versions are pinned to commit SHAs verified 2026-05-23. Actionlint result is agent-asserted and Sonja-confirmed; not independently reproduced in this session.

Result: Pass (Sonja-confirmed; flagged as not Carol-independently-verified).

### 1.5 JSON config validation

`release-please-config.json`: valid JSON. Correct content: `release-type: simple`, `include-v-in-tag: true`, `changelog-path: CHANGELOG.md`, `extra-files` of type `generic` pointing at `VERSION` in packages `"."`. Matches repository structure.

`.release-please-manifest.json`: valid JSON. Records `".": "0.1.0"`, matching the `VERSION` file content of `0.1.0`.

Both configs parse correctly and are internally consistent.

Result: Pass.

### 1.6 Comparison with todo.md setup-work section

All seven setup items from todo.md have been closed by Sean's commits.

- VERSION file (`3ae6af3`): `VERSION` present at repository root, content `0.1.0`. Confirmed.
- Expanded README (`3ae6af3`): `README.md` expanded to team standard — what the project is, how to run locally with `python3 -m http.server`, file structure, live site link with descriptive text "UEB Braille Reference on GitHub Pages", Privacy section. Confirmed.
- CSP meta tag (`5e93b0f`): `<meta http-equiv="Content-Security-Policy">` present in `index.html` at line 5. Interim policy includes `'unsafe-inline'` for the single-file phase; `connect-src` permits `data.goatcounter.com`. Correct.
- Referrer-Policy meta tag (`5e93b0f`): `<meta name="referrer" content="strict-origin-when-cross-origin">` present at line 6. Correct.
- Focus indicator contrast fix (`d5f5d7e`): `--focus` is `#0A2342` (15.77:1 against white; verified in CSS). `accent-color` is `var(--navy)`. `tbody tr:focus-within` uses `outline: 2px solid var(--focus)`. Confirmed.
- Input and fieldset border contrast fix (`d5f5d7e`): `--rule` is `#767676` (4.54:1 against white; verified in CSS). Used on `controls` border, fieldsets, search inputs. Confirmed.
- Pinned linter manifest (`f031d6a`): `package.json` present with `private: true` and three linters pinned. `package-lock.json` committed. `.htmlvalidate.json`, `.stylelintrc.json`, `eslint.config.js` present. Confirmed.
- Five workflow files (`c5d7c0d`): all five present. Confirmed.
- Release-please configuration (`c5d7c0d`): both JSON files present and valid. Confirmed.

Result: All nine setup items confirmed closed.

### 1.7 GoatCounter snippet

`index.html` lines 758 to 761: the GoatCounter snippet reads:

```
<script
  data-goatcounter="https://timdixon82.goatcounter.com/count"
  async
  src="./count.js"></script>
```

The tracker URL is `https://timdixon82.goatcounter.com/count`. This is the team default pattern and matches Q55's answer. The `count.js` file is self-hosted at the repository root. The PR body's "deferred items" section mentioned a placeholder `__BRAILLE_REFERENCE_TRACKER_PLACEHOLDER__`; commit `63326d0` replaced it with the real URL. Confirmed.

`docs/privacy.md` records the tracker as "the team account at `timdixon82.goatcounter.com`". The CSP `connect-src` permits `https://data.goatcounter.com` (the GoatCounter beacon endpoint). All consistent.

Result: Pass.

### 1.8 PR body commit list

The PR body lists seven commits (`e163d56` through `f031d6a`). The HEAD commit `63326d0` ("chore: swap GoatCounter placeholder for the real tracker URL (Q55)") is not listed in the PR body. This is a documentation gap. The commit exists on the branch and the HEAD is confirmed at `63326d0`.

Severity: Minor. The missing commit entry in the PR body does not affect the code state or the CI results. The PR body's "Do not merge" note referenced the placeholder as a blocking item; `63326d0` closes that item. The PR body was not updated to remove that note or list the closing commit.

This is not a rework flag, but Sonja should note in the merge gate that the PR body does not list `63326d0` and that the placeholder blocker is now resolved.

### 1.9 CI checks (all seven)

Confirmed by `gh pr checks 1 --repo timdixon82/Braille-Reference` on 2026-05-23:

| Check | Result | Duration |
|---|---|---|
| Analyse JavaScript (CodeQL) | Pass | 1m 5s |
| CodeQL | Pass | 1s |
| Dependency review | Pass | 37s |
| Lint HTML, CSS, and JavaScript | Pass | 8s |
| Pa11y and axe at WCAG 2.2 AAA | Pass | 33s |
| Semgrep | Pass | 19s |
| Trivy | Pass | 13s |

All seven CI checks pass. Sonja confirmed this before dispatch.

---

## Part 2: Accessibility pass

### 2.1 Pa11y WCAG 2.2 AAA: index.html

CI check "Pa11y and axe at WCAG 2.2 AAA" passed on commit 63326d0. This check runs Pa11y against the served `index.html` at WCAG 2.2 AAA standard, using `pa11y.json` for the `--no-sandbox` launch config. It also runs axe-core via `@axe-core/cli`. Both passed.

Pa11y did not fire any errors at this commit. This is consistent with the baseline audit result (Pa11y found no issues against the pre-fix page) combined with Sean's two accessibility fixes (focus ring and border contrast) which resolved the only issues that were close to automated detection thresholds.

Result: Pass (CI-verified).

### 2.2 Spot-check: focus-ring colour

`index.html` CSS: `--focus: #0A2342`. Focus styles confirmed on:

- `:focus-visible` global rule: `outline: 3px solid var(--focus); outline-offset: 2px`.
- `input[type="search"]:focus` and `input[type="text"]:focus`: `outline: 3px solid var(--focus); outline-offset: 1px; border-color: var(--navy)`.
- `button:focus`: `outline: 3px solid var(--focus); outline-offset: 2px`.
- `tbody tr:focus-within`: `outline: 2px solid var(--focus)`.

`#0A2342` against `#FFFFFF`: 15.77:1. `#0A2342` against `#fafbfc`: verified in the baseline audit at 15.22:1. Both exceed SC 1.4.11 (3:1) and SC 2.4.13 (3:1). No `outline: none` override is present.

Result: Pass.

### 2.3 Spot-check: input border colour

`input[type="search"]` and `input[type="text"]`: `border: 2px solid var(--rule)`. `--rule: #767676`. Against `#FFFFFF`: 4.54:1. Against `#fafbfc`: slightly below but still above 3:1 (the exact figure was confirmed by the LLBS precedent with the same colour on the same background). SC 1.4.11 passes.

Controls section border: `border: 2px solid var(--rule)` — same colour.

Fieldsets: `border: 1px solid var(--rule)` — same colour.

Result: Pass.

### 2.4 Spot-check: abbreviations and new-window warning

Abbreviations: the lede paragraph uses the term "UEB" expanded as "Unified English Braille (UEB)" in the page title and first sentence of the README. In `index.html` the `<title>` is "UEB Braille Reference — Interactive Table" and the lede reads "An interactive reference for the Unified English Braille (UEB) alphabet, numbers, punctuation, and Grade 2 contractions." UEB is expanded on first use in the lede. No `<abbr>` tags present, but expansion in plain text satisfies SC 3.1.4 at AA.

New-window warning: no links in `index.html` open in a new window (`target="_blank"` is not present). No new-window warning is required.

Result: Pass.

### 2.5 Spot-check: muted-text contrast

`--muted: #4A5568`. Against `#FFFFFF`: 7.53:1 (Pass AAA). Against `#fafbfc` (controls background): 7.26:1 (Pass AAA). Against `#FFF4E6` (highlight background): 6.93:1 (Pass AA, fail AAA). This pairing is a known deferred AAA gap from the baseline audit. Muted text is not placed directly on the highlight background in practice; the highlight state applies to a `<div class="status">` whose text uses `var(--ink)` (navy, 14.52:1 on highlight). The 6.93:1 figure is a theoretical pairing. Deferred to the accessibility phase.

Result: Known deferred gap. Not new.

### 2.6 Spot-check: tap-target padding

Checkbox and radio labels: `display: inline-block; margin: 0.25rem 1rem 0.25rem 0; font-size: 1rem`. Line height 1.55 from body gives a computed height of approximately 24.8px. SC 2.5.5 (AAA) requires 44px. This is a known deferred AAA gap from the baseline audit. Deferred to the accessibility phase.

Buttons: `padding: 0.5rem 0.875rem; border: 2px solid`. Estimated height approximately 44.8px. Passes SC 2.5.5.

Result: Known deferred gap. Not new.

### 2.7 Deferred AAA advisory items from baseline audit

All six deferred items from the baseline audit are still correctly deferred. None were introduced or worsened by Sean's commits.

1. Cap text column width at `max-width: 70ch` (SC 1.4.8). `.wrap` is still `max-width: 72rem`. Deferred.
2. Increase checkbox and radio label target size (SC 2.5.5). Deferred.
3. Muted-text-on-highlight contrast (SC 1.4.6, 6.93:1). Deferred.
4. `tabIndex=0` on `tr` elements, no keyboard handler (advisory). Still present in JavaScript: `tr.tabIndex = 0`. Deferred.
5. Redundant `aria-describedby` on `table` element. Still present: `<table aria-describedby="table-desc">`. Deferred.
6. Redundant `aria-live="polite"` on status element with `role="status"`. Still present at line 268. Deferred.
7. "Terms used" section absent (SC 3.1.3). No in-page glossary section. Deferred.

All seven items are recorded in `docs/accessibility.md` and `todo.md`. No items were removed from the deferred set without resolution.

Result: All deferred items correctly carried forward.

### 2.8 Screen reader passes

Manual VoiceOver (macOS) and JAWS (Windows) passes were not performed in this session. These require Tim-side execution with a GUI browser. They are listed as pre-release gates below.

---

## New findings

None. No new accessibility or functional issues were found that were not already present in the baseline audit or listed as known deferred items.

The one documentation gap (PR body not listing commit `63326d0`) is noted in section 1.8 above. It does not affect the code or test outcome and is not a rework flag.

---

## Tim-side gates (not blocking this setup merge, but required before the first release tag)

- VoiceOver pass on macOS: test heading navigation, landmark navigation, table reading, live-region announcements on filter changes, and the correct announcement of single-character print cells (punctuation).
- JAWS pass on Windows: same scope as VoiceOver. Pay particular attention to table-row `tabIndex=0` behaviour and whether JAWS announces the focused row usefully.
- NVDA pass on Windows: cross-check the 200ms debounce on the live region and confirm the status message announces once.
- Keyboard-only session: confirm skip link operates correctly, no keyboard trap, table operable without pointer.
- Reflow test at 320px viewport: confirm no two-dimensional scrolling beyond the data-table reflow exception.
- 200 percent zoom test: confirm all content remains visible and controls do not clip.
