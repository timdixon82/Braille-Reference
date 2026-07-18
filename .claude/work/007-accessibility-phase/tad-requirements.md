# Requirements: 007-accessibility-phase

## Summary

Seven accessibility items must be resolved in `index.html` to bring the Braille-Reference page to WCAG 2.2 Level AAA conformance. This document records the requirement for each item and the acceptance criteria Sean must meet. The "Terms used" HTML fragment for item 7 is at the end of this document.

Source documents: `brief.md` (this work folder), `docs/accessibility.md` (project wiki).

---

## Item 1: Cap text column width

**WCAG success criterion:** SC 1.4.8 Visual Presentation, Level AAA.

**Failing state:** The `.wrap` container is set to `max-width: 72rem`. At wide viewports, paragraph text can exceed 80 characters per line. SC 1.4.8 requires text columns to be no wider than 80 characters.

**Required end state:** The `.wrap` container is set to `max-width: 70ch` so that text lines never exceed 80 characters at any viewport width.

**Constraints:** The change is a single CSS value. No other layout elements should be affected. Verify the table is still usable and not clipped at common viewport widths (1280 px, 1440 px, 1920 px).

### Acceptance criteria

- [ ] `.wrap` has `max-width: 70ch` in the stylesheet.
- [ ] At a 1440 px viewport, paragraph text does not exceed 80 characters per line.
- [ ] The braille reference table renders without horizontal clipping at 1280 px, 1440 px, and 1920 px viewport widths.
- [ ] The `lint:css` linter exits 0.

---

## Item 2: Checkbox and radio label target size

**WCAG success criterion:** SC 2.5.5 Target Size (Enhanced), Level AAA.

**Failing state:** Checkbox and radio labels have a computed height of approximately 24.8 CSS pixels. SC 2.5.5 requires at least 44 by 44 CSS pixels for interactive targets.

**Required end state:** Labels within `.radio-group` and `.check-group` have `padding: 0.5rem 0` applied, increasing their interactive target height to at least 44 CSS pixels.

**Constraints:** The padding must be applied to the label elements, not the input elements, so the full label text area is the hit target. Do not change the visual layout of the controls section beyond the increased label height.

### Acceptance criteria

- [ ] Labels within `.radio-group` and `.check-group` have `padding: 0.5rem 0` in the stylesheet.
- [ ] The computed height of each label in the browser developer tools is 44 px or greater.
- [ ] The controls section layout is not broken at any of the three test viewport widths.
- [ ] The `lint:css` linter exits 0.

---

## Item 3: Muted text on highlight background contrast

**WCAG success criterion:** SC 1.4.6 Contrast Enhanced, Level AAA.

**Failing state:** Muted text `#4A5568` on the highlight background `#FFF4E6` achieves a contrast ratio of 6.93 to 1. SC 1.4.6 requires 7 to 1 for normal-sized text.

**Required end state:** The contrast ratio between muted text and the highlight background is 7 to 1 or greater. This may be achieved by adjusting either the highlight background colour or the muted text colour in the highlighted state. The fix applies only to the highlighted state; all other muted-text pairings already pass.

**Constraints:** The adjusted colour must be verified with a contrast tool before Sean commits. The fix must not create a new failure in any other pairing recorded in `docs/accessibility.md`. The two already-passing pairings (muted text on white at 7.53 to 1 and muted text on controls background at 7.26 to 1) must remain passing.

One compliant option: darken the highlight background slightly, for example from `#FFF4E6` to `#FDEFD8`, and re-measure. Another option: darken the muted text in the highlighted state only, for example to `#475467`. Either approach is acceptable provided the verified ratio meets 7 to 1.

### Acceptance criteria

- [ ] The contrast ratio of muted text on the highlight background is 7 to 1 or greater, verified by a contrast tool.
- [ ] The CSS change is scoped to the highlighted-state pairing and does not alter any other colour pairing.
- [ ] Muted text on white and muted text on controls background still pass AAA (7 to 1 or greater) after the change.
- [ ] The `lint:css` linter exits 0.

---

## Item 4: Remove tabIndex=0 from table rows

**WCAG success criterion:** SC 4.1.2 Name, Role, Value (advisory finding).

**Failing state:** The JavaScript sets `tabIndex=0` on every `tr` element, making rows keyboard-focusable. No interactive role or keyboard event handler is attached to the rows. A screen reader user who focuses a row receives no signal that the row is interactive or what action is available.

**Required end state:** `tabIndex=0` is no longer set on `tr` elements. Screen reader users navigate the table using arrow keys in table mode, which all major screen readers support. Row-level Tab-key focus is removed.

**Constraints:** This is the most behaviour-sensitive change in the phase. Removing `tabIndex=0` means keyboard users can no longer Tab to individual rows. Arrow-key navigation in table mode continues to work in VoiceOver, JAWS, and NVDA. Carol's test pass must confirm no regression in keyboard operability before the pull request is merged.

### Acceptance criteria

- [ ] No `tr` element has `tabIndex=0` set by JavaScript or by any HTML attribute in the rendered page.
- [ ] The JavaScript that previously set `tabIndex` on rows is removed or updated so it no longer sets `tabIndex=0`.
- [ ] Keyboard navigation through the table using Tab, Shift-Tab, and arrow keys still reaches the search fields, filter controls, and table content.
- [ ] Carol's test pass confirms no regression in keyboard operability.
- [ ] The `lint:js` linter exits 0.

---

## Item 5: Remove aria-describedby from the table element

**WCAG success criterion:** SC 4.1.2 Name, Role, Value (advisory finding).

**Failing state:** The `table` element has an `aria-describedby` attribute pointing to the ID of its own `caption` element. The `caption` is already programmatically associated with its table by the HTML specification. The `aria-describedby` causes some screen readers to announce the caption description twice.

**Required end state:** The `aria-describedby` attribute is removed from the `table` element. The `caption` element remains and continues to be announced by screen readers as the table's programmatic description.

**Constraints:** Only the `aria-describedby` attribute is removed from the `table` element. The `caption` element itself, its content, and all other `table` attributes are left unchanged.

### Acceptance criteria

- [ ] The `table` element does not have an `aria-describedby` attribute in the rendered HTML.
- [ ] The `caption` element is still present and its content is unchanged.
- [ ] Pa11y and axe-core pass at WCAG 2.2 AAA in CI after the change.
- [ ] The `lint:html` linter exits 0.

---

## Item 6: Remove aria-live from the status element

**WCAG success criterion:** SC 4.1.2 Name, Role, Value (advisory finding).

**Failing state:** The status element has both `role="status"` and `aria-live="polite"`. The ARIA specification states that `role="status"` implies `aria-live="polite"`. The redundant attribute is not a conformance failure but may produce unexpected behaviour in some screen reader and browser combinations.

**Required end state:** The `aria-live="polite"` attribute is removed from the status element. The `role="status"` attribute remains.

**Constraints:** Only the `aria-live` attribute is removed. The `role="status"` attribute and all other attributes on the status element are left unchanged.

### Acceptance criteria

- [ ] The status element does not have `aria-live="polite"` in the rendered HTML.
- [ ] The status element retains `role="status"`.
- [ ] The live region still announces filter result updates to screen readers. (Carol to verify during test pass.)
- [ ] The `lint:html` linter exits 0.

---

## Item 7: "Terms used" section

**WCAG success criterion:** SC 3.1.3 Unusual Words, Level AAA.

**Failing state:** Specialist braille vocabulary terms (wordsign, groupsign, contraction, shortform, whole-word contraction, part-word contraction, strong contraction, strong groupsign) appear in the table but are not defined anywhere on the page. SC 3.1.3 requires a mechanism to identify the meaning of words used in an unusual or restricted way. The project glossary at `docs/glossary.md` defines these terms, but the page itself does not.

**Required end state:** A "Terms used" section is present in `index.html`. It defines all eight specialist braille vocabulary terms in plain English, at Flesch-Kincaid grade 9 or below. The section uses a `<dl>` definition list so screen readers can navigate term by term. The section has an `id` attribute so it can be linked to from within the page or from other documents.

**Constraints:**

- Definitions must match the meanings in `docs/glossary.md`. Where the glossary does not define a term directly (whole-word contraction, part-word contraction, strong contraction), definitions are derived from the glossary entries for "contraction", "wordsign", "groupsign", "strong groupsign", and "strong wordsign".
- Language must be plain English, grade 9 or below. Do not use jargon beyond the terms being defined.
- The section must use a `<section>` element with an `<h2>` heading and a `<dl>` definition list. This structure is required so VoiceOver and JAWS can navigate the definitions.
- The section must not use mouse or pointer instructions.
- The HTML fragment Sean drops in must be valid and pass `lint:html`.

### Acceptance criteria

- [ ] A `<section id="terms-used">` element is present in `index.html`.
- [ ] The section contains an `<h2>` heading and a `<dl>` definition list.
- [ ] All eight terms are defined: wordsign, groupsign, contraction, shortform, whole-word contraction, part-word contraction, strong contraction, strong groupsign.
- [ ] Each definition is one or two plain-English sentences, grade 9 or below.
- [ ] Definitions are consistent with `docs/glossary.md`.
- [ ] Pa11y and axe-core pass at WCAG 2.2 AAA in CI after the section is added.
- [ ] The `lint:html` linter exits 0.

---

## Terms used HTML fragment

The following `<section>` element is ready for Sean to drop directly into `index.html`. Place it after the main table and before the page footer, or in another location that fits the reading order. The `id="terms-used"` attribute allows the section to be linked to from elsewhere on the page.

The definitions are written at Flesch-Kincaid grade 9 or below, in plain English. Jargon is limited to the eight terms being defined. No pointer or mouse instructions are used. The `<dl>` structure allows VoiceOver and JAWS to navigate term by term using the screen reader's definition-list navigation.

```html
<section id="terms-used" aria-labelledby="terms-used-heading">
  <h2 id="terms-used-heading">Terms used</h2>
  <p>The table uses specialist braille vocabulary. The terms below explain what each one means.</p>
  <dl>
    <dt>Wordsign</dt>
    <dd>A single braille cell that stands for a complete word. It is written on its own, with a space before and after it.</dd>

    <dt>Groupsign</dt>
    <dd>A single braille cell that represents a common group of letters, such as "ch", "sh", or "ing". It may appear at the beginning, middle, or end of a word.</dd>

    <dt>Contraction</dt>
    <dd>A shortened braille symbol that stands for a word, part of a word, or a common sequence of letters. Contractions are the defining feature of Grade 2 braille and reduce the space a text takes on the page.</dd>

    <dt>Shortform</dt>
    <dd>An abbreviated braille spelling of a common word that uses real braille letters but leaves some out. For example, "ab" stands for "about".</dd>

    <dt>Whole-word contraction</dt>
    <dd>A contraction that may only be used when it represents a complete word, not when it appears inside a longer word.</dd>

    <dt>Part-word contraction</dt>
    <dd>A contraction that may be used within a word, not only as a standalone word. It can appear at the start, middle, or end of a longer word.</dd>

    <dt>Strong contraction</dt>
    <dd>A contraction that has strict rules about where it may be used. It may stand alone as a word or appear within a word, but its usage is governed by specific rules in the UEB (Unified English Braille) code.</dd>

    <dt>Strong groupsign</dt>
    <dd>A groupsign that has strict usage rules, similar to a strong contraction. It may represent a group of letters in any position within a word, subject to those rules.</dd>
  </dl>
</section>
```

### Notes for Sean

- The `aria-labelledby` attribute on the `<section>` element links the section to its `<h2>` heading. This gives screen readers a clear label for the landmark region.
- The `id` on the `<h2>` must match the `aria-labelledby` value on the `<section>`. Both are set in this fragment; do not change either value independently.
- The `<dl>`, `<dt>`, and `<dd>` elements need no ARIA additions. Their native semantics are sufficient for VoiceOver and JAWS.
- Add any CSS needed to match the existing page typography. The fragment carries no inline styles.
