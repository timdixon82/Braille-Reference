# Accessibility: Braille-Reference

This page records the project's accessibility posture: its current conformance level, the gaps found in the baseline audit, and the recorded exceptions. It does not duplicate the global standards.

The full WCAG 2.2 AAA interpretation is in the [AgentTeam global wiki: accessibility.md](../../AgentTeam/docs/accessibility.md). That page defines the criteria, testing protocol, exception pattern, and the screen reader and browser pairings the team tests with. All of it applies to this project.

## Conformance target

WCAG 2.2, Level AAA. This is the team's non-negotiable floor for every project.

## Baseline audit verdict

Carol conducted a baseline WCAG 2.2 AAA audit on 2026-05-21, against `index.html` served locally.

Current level: WCAG 2.2 Level A is met. Two Level AA failures are present. Those failures also block Level AAA conformance.

The two failures must be fixed before the project can claim any conformance above Level A.

## AA failures (blocking)

These are blocking issues. The project cannot claim Level AA or AAA conformance until both are resolved. Sean addresses them in the setup build.

### Failure 1: Focus indicator contrast (SC 1.4.11 and SC 2.4.13)

Criterion: 1.4.11 Non-text Contrast, Level AA; 2.4.13 Focus Appearance, Level AAA.

The focus ring colour is orange `#FF6F00`. Against the white page background (`#FFFFFF`) the contrast ratio is 2.79 to 1. SC 1.4.11 requires 3 to 1.

All focusable elements on a white or near-white background are affected: both search inputs, radio buttons, checkboxes, table rows with `tabIndex=0`, and the details summary element.

Fix: darken the focus ring to a colour that achieves at least 3 to 1 against `#FFFFFF` and `#fafbfc`. The existing navy `#0A2342` achieves 15.77 to 1 and satisfies both criteria.

### Failure 2: Input and fieldset border contrast (SC 1.4.11)

Criterion: 1.4.11 Non-text Contrast, Level AA.

The shared border colour `#CBD5E0` achieves 1.49 to 1 against white. SC 1.4.11 requires 3 to 1 for user interface component boundaries.

Affected elements: the outer controls section border, both fieldsets, both search input borders, and the details element border.

Fix: replace `#CBD5E0` with a colour that achieves at least 3 to 1 against white. A mid-grey such as `#767676` achieves 4.54 to 1.

## AAA gaps (minor)

These do not block Level AA conformance but must be resolved to reach Level AAA.

### Gap 1: Line length at wide viewports (SC 1.4.8)

Criterion: 1.4.8 Visual Presentation, Level AAA.

The `.wrap` container is set to `max-width: 72rem`. At wide viewports, paragraph text can exceed the 80-character limit SC 1.4.8 requires.

Fix: cap text columns at `max-width: 70ch` or constrain block text elements individually.

### Gap 2: Checkbox and radio label target size (SC 2.5.5)

Criterion: 2.5.5 Target Size (Enhanced), Level AAA.

Checkbox and radio labels have a computed height of approximately 24.8 CSS pixels. SC 2.5.5 requires at least 44 by 44 CSS pixels.

Fix: add `padding: 0.5rem 0` to label elements within `.radio-group` and `.check-group`.

### Gap 3: Muted text on highlight background (SC 1.4.6)

Criterion: 1.4.6 Contrast Enhanced, Level AAA.

Muted text `#4A5568` on the highlight background `#FFF4E6` achieves 6.93 to 1. SC 1.4.6 requires 7 to 1 for normal text. This pairing appears only in a specific state; muted text on white and the controls background both pass AAA. See Carol's audit for the full contrast table.

Fix: adjust the highlight background or the muted text colour in that state so the pairing reaches 7 to 1.

## Advisory findings

These are not conformance failures but are worth addressing.

### Advisory 1: tabIndex=0 on table rows (SC 4.1.2)

Every `tr` element has `tabIndex=0`, making rows keyboard-focusable, but no interactive role or keyboard handler is attached. A screen reader user focuses the row but receives no signal that it is interactive.

Recommendation: remove `tabIndex=0` from `tr` elements unless row-level activation is planned. Screen readers already allow row-by-row navigation with arrow keys in table mode.

### Advisory 2: aria-describedby on table references its own caption

The `table` element carries `aria-describedby` pointing to the element ID of its own `caption`. A `caption` is already programmatically associated with its table by the HTML specification, so the description may be announced twice.

Recommendation: remove `aria-describedby` from the `table` element and rely on the `caption` alone.

### Advisory 3: Redundant ARIA live region attributes

The status element carries both `role="status"` and `aria-live="polite"`. The `status` role implies `aria-live="polite"` by the ARIA specification.

Recommendation: remove `aria-live="polite"` and keep `role="status"`.

### Advisory 4: No linked glossary for specialist braille terminology (SC 3.1.3)

Criterion: 3.1.3 Unusual Words, Level AAA.

Terms such as "wordsign", "groupsign", "contraction", and "shortform" are specialist braille vocabulary. SC 3.1.3 requires a mechanism to identify the meaning of unusual words. The notes column provides contextual definitions for each entry, but there is no standalone glossary section.

Recommendation: add a short "Terms used" section to the page. Note that this project wiki's `glossary.md` defines these terms; the question is whether equivalent definitions appear in the page itself.

### Advisory 5: Single-character print cells may be ambiguous for some screen reader configurations

The Print column displays single characters for punctuation entries. Screen reader behaviour for single punctuation characters varies by verbosity setting.

Recommendation: confirm in live screen reader testing that punctuation characters in the Print column are announced sensibly across VoiceOver, JAWS, and NVDA. Add visually hidden descriptive text if testing shows a problem.

## Outstanding tests before conformance sign-off

The following tests require a graphical user interface environment and must be completed before the project can claim WCAG 2.2 AAA conformance. They were not possible in the tooling environment at the time of the baseline audit.

1. VoiceOver with Safari on macOS.
2. JAWS with Chrome on Windows.
3. NVDA with Firefox on Windows.
4. Keyboard-only session.
5. Reflow test at 320 px viewport width.
6. 200 percent zoom test.

## Exceptions

Security exceptions are in the `exceptions/` folder. Accessibility exceptions are listed below. None have been approved yet; they require Tim's sign-off before they are valid.

No accessibility exceptions are currently proposed. The two AA failures and the AAA gaps above are targeted for remediation rather than exception.

## Contrast summary

Key pairings and their contrast ratios, from Carol's baseline audit.

| Pairing | Ratio | Result |
|---|---|---|
| Body text navy `#0A2342` on white | 15.77 to 1 | Pass AAA |
| Heading text navy on white | 15.77 to 1 | Pass AAA |
| Muted text `#4A5568` on white | 7.53 to 1 | Pass AAA |
| Muted text on controls background `#fafbfc` | 7.26 to 1 | Pass AAA |
| Muted text on highlight `#FFF4E6` | 6.93 to 1 | Pass AA, fail AAA |
| White text on navy table header | 15.77 to 1 | Pass AAA |
| Navy text on category tag background `#e6eaf0` | 13.06 to 1 | Pass AAA |
| White text on navy button | 15.77 to 1 | Pass AAA |
| Focus ring orange `#FF6F00` on white | 2.79 to 1 | Fail (requires 3 to 1) |
| Focus ring orange on controls background | 2.69 to 1 | Fail (requires 3 to 1) |
| Focus ring orange on navy button background | 5.65 to 1 | Pass |
| Input border `#CBD5E0` on white | 1.49 to 1 | Fail (requires 3 to 1) |
| Input border on controls background | 1.43 to 1 | Fail (requires 3 to 1) |
