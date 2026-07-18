# Work Brief: 007-accessibility-phase

## Summary

Fix the seven deferred accessibility items recorded in `docs/accessibility.md` and `todo.md` from Carol's baseline audit (2026-05-21). These items blocked full WCAG 2.2 AAA conformance. The two AA failures were fixed in the setup build (007 is the follow-on phase). This work targets the remaining AAA gaps and advisory findings.

## Status

Status: done

## Mockup mode

D — no mockup needed. These are CSS, HTML, and minor JS changes to existing elements, not a UI redesign.

## Items in scope

All seven items from Carol's deferred list:

1. **SC 1.4.8 (AAA)** — cap text column width at `max-width: 70ch`. Currently `.wrap` is `max-width: 72rem`.
2. **SC 2.5.5 (AAA)** — increase checkbox and radio label target size to 44 by 44 CSS pixels. Add `padding: 0.5rem 0` to labels in `.radio-group` and `.check-group`.
3. **SC 1.4.6 (AAA)** — muted text `#4A5568` on highlight background `#FFF4E6` is 6.93:1; needs 7:1. Adjust highlight background or muted text colour in that state.
4. **Advisory (SC 4.1.2)** — remove `tabIndex=0` from `tr` elements, or add a keyboard handler and an accessible label. Current JS sets `tr.tabIndex = 0` for every row.
5. **Advisory** — remove `aria-describedby` from the `table` element; the `caption` is already programmatically associated.
6. **Advisory** — remove `aria-live="polite"` from the status element; `role="status"` implies it.
7. **SC 3.1.3 (AAA)** — add a short "Terms used" section to `index.html` defining specialist braille vocabulary: wordsign, groupsign, contraction, shortform, whole-word contraction, part-word contraction, strong contraction, strong groupsign. Definitions already exist in `docs/glossary.md`; they need to appear in the page itself.

## Out of scope

- File split (future milestone, recorded in Decision Record 001).
- Full UEB coverage (future milestone, Q15B).
- Screen reader passes (VoiceOver, JAWS, NVDA) — Tim-side gates, handled separately.
- Advisory 5 (single-character print cells) — deferred to screen reader testing.
- Any change to the braille data set.

## Risk and rollback

Low risk. All changes are confined to `index.html`. No build step, no dependencies, no server-side code. Rollback: revert the commit or the PR.

The contrast fix for item 3 must be verified with a colour tool before Sean commits. The target is 7:1 for `#4A5568` against the adjusted colour. Simon is not needed; the fix is a single CSS value and Contrast Master can verify if needed.

Item 4 (tabIndex) is the most behaviour-sensitive change. Removing `tabIndex=0` from rows means keyboard users can no longer Tab to individual rows. Arrow-key navigation in table mode still works in all screen readers. Carol's test pass must confirm no regression in keyboard operability.

## Definition of done

- All seven items are implemented in `index.html`.
- All three linters (`lint:html`, `lint:css`, `lint:js`) exit 0 locally and in CI.
- Pa11y and axe-core pass at WCAG 2.2 AAA in CI.
- Carol has completed a functional and accessibility test pass.
- A pull request is open and all CI checks pass.
- Sonja has run the merge gate and Tim has approved the merge.

## Routing plan

1. **Tad** — record requirements and write the "Terms used" content (definitions for the seven braille vocabulary terms, plain-language, at grade 9 or below, matching the docs/glossary.md definitions).
2. **Sean** — implement all seven items in `index.html` on a branch `fix/accessibility-phase`. Items 1–6 can be built without waiting for Tad. Item 7 (Terms used) needs Tad's copy.
3. **Carol** — test pass (functional and accessibility in parallel) and release checklist update.

## Approved GitHub actions

All six standard actions are pre-approved (template 1.5.1 default):

- Create a branch.
- Commit to a branch.
- Push a branch other than main.
- Open a pull request.
- Comment on a pull request or an issue.
- Create an issue.

Merging to main requires Tim's express approval at the time.
