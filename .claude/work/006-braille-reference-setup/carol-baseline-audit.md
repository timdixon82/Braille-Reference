# WCAG 2.2 AAA Baseline Accessibility Audit: Braille Reference

Audit date: 2026-05-21. Auditor: Carol (tester). Scope: `index.html` of `timdixon82/Braille-Reference`, served locally at `http://localhost:8743/` and inspected by code review. Read-only; no changes made to the repository.

## Method

- Code inspection of `index.html` in full.
- Pa11y 9.1.1 run against the locally served page, configured to WCAG2AAA standard. Result: no issues reported.
- axe-core could not be run (Playwright not installed in this environment). Pa11y covers overlapping automated rules.
- Colour contrast ratios calculated programmatically using the WCAG relative luminance formula.
- Structural, semantic, keyboard, and screen reader characteristics assessed by code inspection against WCAG 2.2 criteria at A, AA, and AAA levels.
- Note on manual screen reader testing: VoiceOver, JAWS, and NVDA tests with live browsers were not performed in this baseline audit because the tooling environment does not support a GUI. These are flagged as outstanding tests that must be performed before the project passes the team's full testing protocol.

## Verdict

The page does not currently meet WCAG 2.2 at AA. Two AA failures are present (focus indicator contrast and input boundary contrast). Those same failures block AAA conformance. The page meets WCAG 2.2 Level A. Once the two major findings below are fixed, the page will be very close to AAA conformance, with only minor and advisory items remaining.

## Findings

### Critical findings

No critical findings.

### Major findings

#### Finding 1: Focus indicator contrast fails SC 1.4.11 (AA) and SC 2.4.13 (AAA)

Criterion: 1.4.11 Non-text Contrast, Level AA; 2.4.13 Focus Appearance, Level AAA.

The focus ring colour is orange `#FF6F00`. Against the white page background (`#FFFFFF`) and the near-white controls background (`#fafbfc`), the contrast ratio is 2.79:1. SC 1.4.11 requires 3:1 for user interface component boundaries. SC 2.4.13 requires 3:1 between the focused and unfocused state of a component.

This affects every focusable element that sits on a white or near-white background: both search inputs, the text inputs within them, radio buttons and checkboxes, table rows (which have `tabIndex=0`), and the details summary element. Only the primary buttons with a navy background (`#0A2342`) pass, giving a focus ring contrast of 5.65:1 against that background.

Additionally, the `accent-color: #FF6F00` applied to checkboxes and radios means the filled indicator of those controls also fails 3:1 against the white background.

Severity: major. This is an AA failure, making it a blocking issue for any conformance claim.

Fix required: Darken the focus ring to a colour that achieves at least 3:1 against both `#FFFFFF` and `#fafbfc`. The existing navy `#0A2342` achieves 15.77:1 and would satisfy both criteria. Alternatively, a two-colour focus ring (outer navy, inner orange) maintains the brand orange while ensuring the outer edge is visible.

#### Finding 2: Input and fieldset borders fail SC 1.4.11 (AA)

Criterion: 1.4.11 Non-text Contrast, Level AA.

The shared border colour `--rule: #CBD5E0` is used on the outer controls section border, both fieldsets, both search input borders, and the details element border. Against the white page background, the contrast is 1.49:1. Against the near-white controls background (`#fafbfc`), it is 1.43:1. Both values are well below the required 3:1.

These borders are the only visual indicators of the input field boundaries. Without sufficient contrast, low-vision users may not locate the input fields without relying on the placeholder text or the label. This also affects sighted keyboard users who rely on the input boundary to understand where to type.

Severity: major. AA failure.

Fix required: Replace `#CBD5E0` with a border colour that achieves at least 3:1 against white. A mid-grey such as `#767676` achieves exactly 4.54:1 against white and would pass both AA and AAA. The existing navy `#0A2342` at 15.77:1 is also an option and aligns with the button borders.

### Minor findings

#### Finding 3: SC 1.4.8 line length at wide viewports

Criterion: 1.4.8 Visual Presentation, Level AAA.

SC 1.4.8 requires that blocks of text are no more than 80 characters wide. The `.wrap` container is set to `max-width: 72rem`. At a default 16px font size, 72rem is 1152px. With Georgia at an average character width of approximately 8.5px, a single line of paragraph text can reach approximately 135 characters at the maximum viewport width. This exceeds the 80-character limit.

The requirement applies to the default visual presentation. Responsive behaviour at narrower viewports does not substitute for wide-viewport compliance.

Severity: minor. AAA-only criterion. Does not affect low-vision users who typically zoom in (which narrows lines) or those using a narrow viewport.

Fix required: Cap text columns at `max-width: 70ch` or similar character-unit width, or constrain the `p`, `td`, and other block text elements individually.

#### Finding 4: Checkbox and radio label target size fails SC 2.5.5 (AAA)

Criterion: 2.5.5 Target Size (Enhanced), Level AAA.

SC 2.5.5 requires pointer targets of at least 44 by 44 CSS pixels. The checkbox and radio labels are `display: inline-block` with `font-size: 1rem` and `line-height: 1.55` (inherited from body). The computed label height is approximately 24.8px. This is below the 44px AAA target.

The buttons and clear buttons are not affected: their padding plus border produces an estimated height of approximately 44.8px, which meets the requirement.

Severity: minor. AAA-only criterion. Has no impact on screen reader users (Tim's primary use case), but does affect sighted users with motor impairments.

Fix required: Add `padding: 0.5rem 0` to the label elements within `.radio-group` and `.check-group`, or increase `min-height` to 44px, to make the click target large enough.

#### Finding 5: Table rows with tabIndex=0 have no communicated purpose

Criterion: 4.1.2 Name, Role, Value, Level A.

The JavaScript assigns `tabIndex=0` to every `tr` element, making all rows keyboard-focusable. However, a `tr` element has no implicit ARIA role that screen readers announce as interactive. When a keyboard user or screen reader user focuses a row, the row highlights visually but nothing signals to the user what action, if any, the row affords. There is also no keyboard activation handler (Enter or Space) attached to the rows. For a screen reader user who navigates by Tab, this results in unexpected focus landings on inert content.

Severity: minor. The content remains accessible through the table cells; no information is lost. But the experience is unexpected and could mislead screen reader users into thinking a row is an interactive control.

Fix: If rows are intended only to provide focus-within styling, remove `tabIndex=0` from the `tr` elements. Table navigation in screen readers already allows row-by-row reading via arrow keys without `tabIndex`. If row-level activation is intended for a future feature, add `role="row"` (which `tr` already has implicitly), add a keyboard activation handler, and add an `aria-label` or `aria-describedby` explaining the action.

### Advisory findings

#### Finding 6: aria-describedby on table references its own caption

The `table` element has `aria-describedby="table-desc"`, and `"table-desc"` is the `id` of the `caption` element inside that same table. A `caption` is already programmatically associated with its parent table by the HTML specification. Screen readers announce the caption as the table's accessible description automatically. The additional `aria-describedby` pointing to the same caption text may cause the description to be read twice by some screen reader and browser combinations.

Recommendation: Remove the `aria-describedby` attribute from the `table` element and rely on the `caption` alone. If the caption is intentionally screen-reader-only (it has `class="sr-only"`), consider whether a visible caption would serve sighted low-vision users better.

#### Finding 7: Redundant ARIA live region attributes on the status element

The status element carries both `role="status"` and `aria-live="polite"`. The `status` role implies `aria-live="polite"` by the ARIA specification. Having both is not harmful and browsers handle it correctly, but it is unnecessary markup.

Recommendation: Remove `aria-live="polite"` and keep `role="status"`.

#### Finding 8: No linked glossary for specialist braille terminology

Criterion: 3.1.3 Unusual Words, Level AAA.

Terms such as "wordsign", "groupsign", "contraction", and "shortform" are specialist braille vocabulary. SC 3.1.3 requires a mechanism to identify the meaning of unusual words. The notes column provides contextual definitions for each entry, which partially satisfies this intent. However, there is no glossary page or in-page glossary section that a user could consult for term definitions independently of the table rows.

Recommendation: Add a short "Terms used" section above or below the table that defines the main category terms. This would also serve new learners who may not know what to search for.

#### Finding 9: Single-character print cells may be ambiguous for screen readers

The Print column displays single characters for punctuation entries: commas, semicolons, opening quotation marks, and similar. Screen readers typically announce these as their Unicode names (for example, "comma" or "left double quotation mark"), but behaviour varies across JAWS, VoiceOver, and NVDA, and depends on the verbosity setting. Some screen reader users set punctuation verbosity low, in which case these cells may be announced as blank or skipped.

The Notes column provides full text descriptions, which mitigates this. There is no WCAG failure here, but it is worth confirming in live screen reader testing that the Print column announces sensibly for punctuation characters.

Recommendation: Consider adding a visually hidden but announced description to ambiguous single-character cells, for example `<span class="sr-only">(comma)</span>`, or confirm in manual screen reader tests that the character is read correctly.

#### Finding 10: Brand colour alignment note

The page uses `--navy: #0A2342` and `--orange: #FF6F00`. The team brand defines Navy as `#061528` and Accent Orange as `#FF7C00`. The page colours are close but not identical. This is an existing repository being adopted, not a new Tim Dixon branded artifact, so brand colour alignment is not a conformance failure. Sonja should decide whether to align the palette to the brand reference in a future pass.

## Contrast summary table

The following table gives the key text colour pairings and their contrast ratios.

| Pairing | Ratio | Result |
|---|---|---|
| Body text (navy #0A2342) on white | 15.77:1 | PASS AAA |
| Heading text (navy) on white | 15.77:1 | PASS AAA |
| Muted text (#4A5568) on white | 7.53:1 | PASS AAA |
| Muted text on controls background (#fafbfc) | 7.26:1 | PASS AAA |
| Muted text on highlight (#FFF4E6) | 6.93:1 | PASS AA, FAIL AAA |
| White text on navy table header | 15.77:1 | PASS AAA |
| Navy text on category tag background (#e6eaf0) | 13.06:1 | PASS AAA |
| White text on navy button | 15.77:1 | PASS AAA |
| Navy text on secondary button (white) | 15.77:1 | PASS AAA |
| Status text (navy) on highlight | 14.52:1 | PASS AAA |
| Focus ring (orange #FF6F00) on white | 2.79:1 | FAIL (requires 3:1) |
| Focus ring (orange) on controls background | 2.69:1 | FAIL (requires 3:1) |
| Focus ring (orange) on navy button background | 5.65:1 | PASS |
| Input border (#CBD5E0) on white | 1.49:1 | FAIL (requires 3:1) |
| Input border on controls background | 1.43:1 | FAIL (requires 3:1) |

The muted-on-highlight pairing (6.93:1) is not a direct text-on-background pairing in the design. Muted text is only placed on white or the controls background, both of which pass AAA. The 6.93:1 figure is included for completeness.

## Automated test results

Pa11y 9.1.1, WCAG2AAA standard, run against the locally served page: no issues reported.

Note: Pa11y uses Axe and HTML_CodeSniffer under the hood. It detected no violations. The two major findings (focus ring contrast and input border contrast) involve values that are close to but below the 3:1 threshold; some automated tools only flag clear failures and may miss borderline non-text contrast issues. The contrast calculations above were computed directly from the CSS values.

## Outstanding tests before full conformance sign-off

The following tests must be completed before the project can claim full WCAG 2.2 AAA conformance under the team protocol. They require a GUI environment and are not possible in this tooling context.

1. VoiceOver with Safari on macOS: confirm heading navigation, landmark navigation, table reading, live region announcements on filter changes, and correct announcement of the Print column for punctuation characters.
2. JAWS with Chrome on Windows: same checks as above. Pay particular attention to the table row `tabIndex` behaviour and whether JAWS announces the focused row in a useful way.
3. NVDA with Firefox on Windows: cross-check the live region timing (200ms debounce) and confirm the status message is announced once and not repeatedly.
4. Keyboard-only session: confirm skip link operates correctly, confirm no keyboard trap in the controls section or the details disclosure, and confirm the table is operable without a mouse.
5. Reflow test at 320px viewport width: confirm no two-dimensional scrolling is required (the table uses `overflow-x: auto` within a scroll container, which the WCAG reflow exception for data tables allows).
6. 200% zoom test: confirm all content remains visible and the controls section does not overlap or clip.
