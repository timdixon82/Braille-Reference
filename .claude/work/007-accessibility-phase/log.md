# Work Log: 007-accessibility-phase

This log is chronological and append-only.

## [2026-06-04] setup | Work folder created

Tim directed the team to address the seven deferred accessibility items from Carol's baseline audit (2026-05-21). These are the AAA gaps and advisory findings that were carried forward from the setup build. The brief is at `brief.md`. Tad is being dispatched for requirements and braille vocabulary copy; Sean will build in parallel on items 1–6 and then item 7 once Tad's copy lands.

## [2026-06-04] build | Tad and Sean complete; PR 11 open

Tad wrote `tad-requirements.md` and the "Terms used" HTML fragment (eight UEB vocabulary terms, `<dl>` structure with `aria-labelledby`, plain language at grade 9). Sean implemented all seven fixes in a single commit `4fea39c` on branch `fix/accessibility-phase`:

- Fix 1 SC 1.4.8: `header { max-width: 70ch }` — caps prose header, leaves table and controls at full `.wrap` width.
- Fix 2 SC 2.5.5: `padding: 0.5rem 0` on radio and checkbox labels — target height ≥ 44px.
- Fix 3 SC 1.4.6: `--highlight` changed from `#FFF4E6` to `#FFF9F0` — muted text `#4A5568` achieves 7.22:1 on new highlight (was 6.93:1, threshold 7:1).
- Fix 4 Advisory SC 4.1.2: `tr.tabIndex = 0` removed from `buildRow()`.
- Fix 5 Advisory: `aria-describedby` removed from `<table>`. Caption remains.
- Fix 6 Advisory: `aria-live="polite"` removed from status element. `role="status"` retained.
- Fix 7 SC 3.1.3: `<section id="terms-used">` with `<dl>` added before `</main>`.

All 9 CI checks pass on `4fea39c`. PR 11 opened at https://github.com/timdixon82/Braille-Reference/pull/11. Carol dispatched for test pass and release checklist.
- [2026-06-04 13:25:10] subagent completed

## [2026-06-04] test-pass | Carol: FAIL — rework required for Fix 2

Carol completed the functional and accessibility test pass for PR 11. Six of the seven fixes pass all acceptance criteria. Fix 2 (SC 2.5.5, target size) fails the computed-height criterion.

Finding: `.radio-group label, .check-group label { padding: 0.5rem 0 }` produces a rendered height of 40.8 px (radio labels) and 41.65 px (checkbox labels). SC 2.5.5 requires 44 px minimum. The acceptance criterion in tad-requirements.md states "computed height of each label in the browser developer tools is 44 px or greater." This criterion is not met.

The fix requires changing `padding: 0.5rem 0` to `padding: 0.6rem 0` on both selectors. At 0.6 rem = 9.6 px per side, total height = 24.8 + 9.6 + 9.6 = 44.0 px, meeting the threshold exactly.

Rework flag routed to Sonja for re-dispatch to Sean. Carol to re-verify after rework.

Test reports at:
- `carol-test-pass.md`
- `carol-release-checklist.md`

PR 11 is NOT ready for the merge gate until rework is complete and re-tested.
- [2026-06-04 13:28:18] subagent completed
- [2026-06-04 13:29:38] subagent completed
- [2026-06-04 13:32:09] subagent completed
- [2026-06-04 13:35:44] subagent completed

## [2026-06-04] rework | Fix 2 rework — label padding 0.5rem → 0.6rem

Sean committed `7e37d0b` — `padding: 0.6rem 0` on `.radio-group label, .check-group label`. Computed height 44.0px, meets SC 2.5.5 exactly. Carol re-verified: Fix 2 cleared, checklist updated to READY. All 9 CI checks pass on `7e37d0b`.

## [2026-06-04] merge | PR 10 and PR 11 merged to main

Tim approved both merge gates.

- PR 10 (template sync 1.5.1) merged at `0a77e41`.
- PR 11 (accessibility phase, seven deferred AAA fixes) merged at `28cf621`.

All seven deferred accessibility items are now on main. Status: 007 done pending screen reader passes.

Outstanding before first release tag (Tim-side):
- VoiceOver pass on macOS
- JAWS pass on Windows
- NVDA pass on Windows
- Advisory 5 (single-character print cells) to be assessed during screen reader testing

Separate future PR (medium priority, flagged by Carol):
- Playwright functional tests — playwright.yml scaffold has no tests; no automated functional regression coverage.
- [2026-06-04 16:05:46] subagent completed
- [2026-06-04 16:23:26] subagent completed
- [2026-06-04 17:25:11] subagent completed
- [2026-06-04 17:36:50] subagent completed
- [2026-06-04 17:44:33] subagent completed
- [2026-06-04 19:07:28] subagent completed
- [2026-06-04 19:34:21] subagent completed
- [2026-06-04 19:48:28] subagent completed
- [2026-06-05 14:14:33] subagent completed
