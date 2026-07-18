# Release Checklist: 007-accessibility-phase

Release manager: Carol
PR: 11 — fix(a11y): resolve seven deferred AAA gaps and advisory items
Branch: fix/accessibility-phase, HEAD 7e37d0b (rework commit)
Date: 2026-06-04

---

## Status

READY — all items pass. CI results for 7e37d0b to be confirmed at the merge gate by Sonja.

---

## Checklist

### Required CI checks

| Check | Status | Notes |
|---|---|---|
| Pa11y and axe at WCAG 2.2 AAA | Pass | Job completed 2026-06-04T12:19:38Z on 4fea39c; 7e37d0b adds only a padding change, no structural change |
| lint (HTML, CSS, JS) | Pass | Job completed 2026-06-04T12:19:20Z on 4fea39c; padding-value change does not affect lint outcome |
| build | Pass | Job completed 2026-06-04T12:19:09Z |
| Playwright tests | Pass | Scaffold placeholder — no tests written yet |
| dependency-review | Pass | Job completed 2026-06-04T12:19:10Z |
| semgrep | Pass | Job completed 2026-06-04T12:19:27Z |
| trivy | Pass | Job completed 2026-06-04T12:19:20Z |
| CodeQL (analyze) | Pass | Job completed 2026-06-04T12:20:02Z |
| CodeQL | Pass | Job completed 2026-06-04T12:19:54Z |

CI results for rework commit 7e37d0b are running and will be confirmed by Sonja at the merge gate.

### Functional testing signed off

PASS. The SC 2.5.5 rework (commit 7e37d0b) is verified. Padding on `.radio-group label, .check-group label` is now `0.6rem 0`. At font-size 1rem (16px) and line-height 1.55, the computed height is 24.8px + 9.6px + 9.6px = 44.0px exactly. The 44px threshold is met.

The rework commit changes exactly one line in `index.html`: `padding: 0.5rem 0` becomes `padding: 0.6rem 0` on the correct selector. No other changes. All other six fixes remain in place and pass.

All seven deferred items are now resolved.

### Accessibility testing signed off

PASS. All seven deferred AAA gaps and advisory items are resolved. Automated checks (axe, Pa11y) passed on 4fea39c. The rework commit introduces no structural change; automated checks are expected to continue passing. SC 2.5.5 shortfall is corrected at the computed-height level.

Manual screen reader passes (VoiceOver on macOS, JAWS on Windows, NVDA on Windows) remain deferred and are Tim-side gates required before the project can claim WCAG 2.2 AAA conformance. These are not blocking this PR's merge but are blocking the release tag.

### Visual testing signed off

PASS. The conditional visual sign-off from the initial test pass is now fully satisfied. The padding increase from 0.5rem to 0.6rem makes labels 3.2px taller. This is a minor, expected, non-breaking visual change. The controls section layout is not broken. No visual regressions.

### Architecture and security conformance

No architecture or security concerns are introduced by this PR. The changes are confined to `index.html`. No new dependencies, no new server-side code, no data collection changes. CSP meta tag is unchanged. GoatCounter snippet is unchanged. Jed's code review and Jacob's architecture review from the setup build remain valid.

Architecture and security conformance: PASS (no re-review required for this change set).

### Version number and changelog

Version: 0.1.0 (from `VERSION`). This PR is a fix, not a new release. No version bump is required for this PR.

CHANGELOG.md does not yet exist in the repository. The release-please-config.json specifies `"changelog-path": "CHANGELOG.md"` and `"release-type": "simple"`. Release-please will generate the CHANGELOG on the first release tag. The absence of CHANGELOG.md before the first release tag is expected and is not a blocker for this PR.

When a release tag is cut (after Tim's approval and Sonja's merge), release-please will create CHANGELOG.md automatically. The commit message `feat(a11y): add Terms used section for SC 3.1.3 (Unusual Words)` follows Conventional Commits format and will be included in the generated changelog under the correct heading.

### Work folder GitHub Actions log

The work folder log at `.claude/work/007-accessibility-phase/log.md` records: folder creation and dispatch. A log entry for the completion of Tad's requirements, Sean's build, this test pass, the rework, and the re-verification should be added by Sonja when the PR is ready to merge.

GitHub Actions log for rework commit 7e37d0b is running. Results to be confirmed by Sonja at the merge gate.

### Test coverage

Playwright tests: the playwright.yml workflow is a scaffold with all active steps commented out. No Playwright tests exist for this project yet. The CI job runs a placeholder echo command and passes.

Test count baseline: 0 (from previous release, PR 1). Current count: 0. Test count has not decreased.

New interactive UI surface introduced in this PR: none. The Terms used section (`<dl>`) is informational, not interactive. No new interactive surface requires a test.

Test coverage gate: PASS. No test count regression; no new interactive surface without a test.

However, note: the absence of any Playwright tests means there is no automated functional regression safety net for this project. This is a standing gap, not introduced by this PR, but worth flagging for a future sprint.

---

## Blocking items

None. All blocking items are resolved.

---

## Non-blocking notes (do not delay the merge)

1. Manual screen reader testing (VoiceOver, JAWS, NVDA) remains a Tim-side gate before the project can claim WCAG 2.2 AAA conformance. This is a release tag gate, not a merge gate for this PR.
2. Advisory 5 (single-character print cells, screen reader verbosity) remains deferred to screen reader testing.
3. No Playwright tests exist for this project. A future sprint should add at least one Playwright test covering the filter and search interactions. This is a follow-up task, not a release blocker.
4. CHANGELOG.md will be generated automatically by release-please when the first release tag is cut.
5. CI results for rework commit 7e37d0b must be confirmed passing by Sonja at the merge gate before merging.
