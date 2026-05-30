# Carol Release Checklist: Braille-Reference setup PR 1

Checklist date: 2026-05-23
Checker: Carol
Branch: chore/project-setup (HEAD 63326d0)
Base: main
Repository: timdixon82/Braille-Reference (public)

This checklist covers the merge gate for PR 1. It follows the shape established by the LLBS release checklist.

---

## Section 1: Required CI checks

| Check | Status | Notes |
|---|---|---|
| Lint HTML, CSS, and JavaScript | Pass | CI exit 0 on 63326d0. |
| Pa11y and axe at WCAG 2.2 AAA | Pass | CI exit 0 on 63326d0. |
| Semgrep | Pass | CI exit 0 on 63326d0. |
| Trivy | Pass | CI exit 0 on 63326d0. |
| Dependency review | Pass | CI exit 0 on 63326d0. |
| CodeQL (Analyse JavaScript) | Pass | CI exit 0 on 63326d0. |
| CodeQL | Pass | CI exit 0 on 63326d0. |

All seven required CI checks pass. Confirmed by `gh pr checks 1 --repo timdixon82/Braille-Reference` on 2026-05-23.

## Section 2: Linters exit 0

| Linter | Status | Notes |
|---|---|---|
| `npm run lint:html` (html-validate) | Pass | Confirmed by CI check. |
| `npm run lint:css` (stylelint) | Pass | Confirmed by CI check. Uses `--allow-empty-input`; no separate CSS files in single-file phase. |
| `npm run lint:js` (eslint) | Pass | Confirmed by CI check. Uses `--no-error-on-unmatched-pattern`; no `js/` directory in single-file phase. |

## Section 3: actionlint

| Check | Status | Notes |
|---|---|---|
| actionlint across all five workflow files | Pass | Sonja-confirmed locally; work log records "all five files pass actionlint exit 0". Not independently reproduced by Carol in this session. |

## Section 4: Accessibility

| Check | Status | Notes |
|---|---|---|
| Pa11y WCAG 2.2 AAA on index.html | Pass | CI exit 0. |
| axe-core WCAG 2.2 AAA on index.html | Pass | CI exit 0 (run via accessibility.yml using `@axe-core/cli`). |
| Focus indicator contrast (SC 1.4.11, SC 2.4.13) | Pass | `--focus: #0A2342`, 15.77:1 against white. |
| Input and fieldset border contrast (SC 1.4.11) | Pass | `--rule: #767676`, 4.54:1 against white. |
| CSP meta tag present | Pass | `meta http-equiv="Content-Security-Policy"` in `index.html` at line 5. |
| Referrer-Policy meta tag present | Pass | `meta name="referrer" content="strict-origin-when-cross-origin"` at line 6. |
| VoiceOver (macOS) | Pending | Tim-side gate. Required before first release tag. Not blocking this setup merge. |
| JAWS (Windows) | Pending | Tim-side gate. Required before first release tag. Not blocking this setup merge. |
| NVDA (Windows) | Pending | Tim-side gate. Required before first release tag. Not blocking this setup merge. |

## Section 5: Security

| Check | Status | Notes |
|---|---|---|
| Semgrep static analysis | Pass | CI exit 0. |
| Trivy (CRITICAL and HIGH) | Pass | CI exit 0. |
| Dependency review | Pass | CI exit 0. |
| CodeQL JavaScript analysis | Pass | CI exit 0. |
| GitHub Pages security-header exception | Covered | Standing exception applies. Approved by Tim Dixon on 2026-05-23 (Q50). Recorded at `docs/exceptions/github-pages-headers.md`. See Section 6 below. |

## Section 6: Standing GitHub Pages security-header exception

The standing exception recorded in the global wiki at `AgentTeam/docs/exceptions/github-pages-security-headers.md` covers this project. All five conditions for the standing exception are met:

1. Static front-end of HTML, CSS, and JavaScript. Met.
2. No personal data processed. Met.
3. No login, no authenticated session, no cookie. Met.
4. No form that submits data to a server, no action with a side effect. Met.
5. No external scripts or styles from third-party origins. Met. GoatCounter's `count.js` is self-hosted. The CSP `connect-src` permits `data.goatcounter.com` for the analytics beacon; no script is loaded from an external origin.

Headers affected (X-Frame-Options, Permissions-Policy) are accepted at low residual risk per the standing exception. Compensating controls in place: CSP meta tag, Referrer-Policy meta tag, all DOM writes use `.textContent`, HTTPS enforced by platform.

## Section 7: Functional and visual sign-off

| Check | Status | Notes |
|---|---|---|
| All todo.md setup items closed | Pass | VERSION, README, CSP, Referrer-Policy, focus fix, border fix, pinned linters, five workflows, release-please config. All confirmed. See `carol-test-pass.md` section 1.6. |
| GoatCounter snippet uses correct tracker URL | Pass | `data-goatcounter="https://timdixon82.goatcounter.com/count"`. Matches team default pattern. |
| Privacy page records GoatCounter | Pass | `docs/privacy.md` present. Records tracker as `timdixon82.goatcounter.com`. Records data collected, UK GDPR basis, DPA, and CSP. |
| VERSION file at 0.1.0 | Pass | `VERSION` contains `0.1.0`. |
| Release-please manifest at 0.1.0 | Pass | `.release-please-manifest.json` records `".": "0.1.0"`. |
| README expanded to team standard | Pass | What it is, how to run locally, file structure, live site link with descriptive text, Privacy section. |
| PR body lists all commits | Minor gap | PR body lists `e163d56` through `f031d6a` (seven commits). HEAD commit `63326d0` is not listed. The placeholder blocker note in the PR body was not updated to reflect that `63326d0` resolved it. Not blocking. Sonja to note at merge gate. |

## Section 8: Architecture and security conformance check

| Check | Status | Notes |
|---|---|---|
| Architecture-and-security conformance check | Required | This is a Sonja responsibility, not Carol's. Must be completed before Sonja runs the merge gate. |

## Section 9: Version and changelog

| Check | Status | Notes |
|---|---|---|
| VERSION file ready | Pass | `0.1.0`. |
| CHANGELOG.md | Not yet present | No `CHANGELOG.md` exists in the repository. This is expected for the initial setup PR: release-please creates the changelog on the first release. The absence is not a blocker for the setup merge. |
| release-please-config.json | Pass | Valid. Correct release-type, changelog-path, and extra-files. |
| .release-please-manifest.json | Pass | Valid. Records `0.1.0`. |

## Section 10: Deferred AAA accessibility items

These items are not blocking the setup merge. They are carried forward to the project's later accessibility phase and recorded in `docs/accessibility.md` and `todo.md`.

1. Cap text column width at `max-width: 70ch` (SC 1.4.8).
2. Increase checkbox and radio label target size to 44 by 44px (SC 2.5.5).
3. Adjust muted-text-on-highlight contrast to reach 7:1 (SC 1.4.6).
4. Remove or handle `tabIndex=0` on `tr` elements (advisory, SC 4.1.2).
5. Remove redundant `aria-describedby` from `table` element (advisory).
6. Remove redundant `aria-live="polite"` from status element with `role="status"` (advisory).
7. Add "Terms used" section for specialist braille vocabulary (SC 3.1.3).

---

## Overall verdict

Ready for the merge gate, with one minor documentation note and the architecture-and-security conformance check outstanding.

Confirmed clean:

- All seven CI checks pass.
- All three linters exit 0 (CI-confirmed).
- Pa11y and axe-core pass at WCAG 2.2 AAA (CI-confirmed).
- All nine todo.md setup items are closed.
- GoatCounter snippet uses `https://timdixon82.goatcounter.com/count`.
- Privacy page records the analytics posture correctly.
- Focus indicator and input border contrast pass SC 1.4.11.
- Standing GitHub Pages security-header exception covers the project.
- Release-please configuration is valid and consistent with VERSION at 0.1.0.

Not blocking but to note at merge gate:

- PR body does not list commit `63326d0`, and the "Do not merge" note about the placeholder was not updated. The placeholder is resolved. Sonja should confirm this at the merge gate before Tim's approval.
- actionlint was Sonja-confirmed, not independently verified by Carol in this session.

Blocking before first release tag (not before this setup merge):

- VoiceOver, JAWS, and NVDA screen reader passes. Tim-side.
- Architecture-and-security conformance check. Sonja's responsibility.
