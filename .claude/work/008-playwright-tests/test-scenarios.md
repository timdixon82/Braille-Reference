# Playwright test scenarios — UEB Braille Reference

Each scenario gives a short test name, the actions to take, and the assertion to make. Scenarios are grouped by feature area. All tests run against `index.html` loaded as a `file://` URL (or via a local static server if needed for consistent timing).

---

## 1. Page load

- [ ] **Page title is correct**
  Action: Navigate to `index.html`.
  Assert: `document.title` equals `"UEB Braille Reference — Interactive Table"`.

- [ ] **H1 is present and correct**
  Action: Navigate to `index.html`.
  Assert: The `h1` element contains the text `"UEB Braille Reference"`.

- [ ] **Table body has rows after load**
  Action: Navigate to `index.html` and wait for `networkidle`.
  Assert: `#rows` contains at least one `tr` element that is not hidden (`display` is not `none`).

- [ ] **Status element does not show "Loading" after load**
  Action: Navigate to `index.html` and wait for `networkidle`.
  Assert: The text content of `#status` does not equal `"Loading…"` and matches the pattern `\d+ entries? shown`.

- [ ] **Status element shows a numeric count after load**
  Action: Navigate to `index.html` and wait for `networkidle`.
  Assert: The text content of `#status` begins with a number greater than zero.

- [ ] **Empty-state element is hidden on load**
  Action: Navigate to `index.html` and wait for `networkidle`.
  Assert: `#empty-state` has `hidden` attribute or is not visible.

---

## 2. Grade filter

- [ ] **Grade 1 is the default selection**
  Action: Navigate to `index.html`.
  Assert: The radio with `value="1"` is checked.

- [ ] **Grade 2-only category labels are hidden when Grade 1 is selected**
  Action: Navigate to `index.html` (Grade 1 is the default).
  Assert: All elements with class `grade2-only` have `display: none` (computed style).

- [ ] **Grade 2-only rows are absent when Grade 1 is selected**
  Action: Navigate to `index.html`. Count visible rows in `#rows`.
  Assert: No visible row has a category tag whose text matches any Grade 2-only category (`Wordsign`, `Strong wordsign`, `Strong groupsign`, `Lower contraction`, `Initial-letter`, `Final-letter`, `Shortform`).

- [ ] **Switching to Grade 2 reveals Grade 2-only category labels**
  Action: Click the radio with `value="2"`.
  Assert: All elements with class `grade2-only` are visible (computed `display` is not `none`).

- [ ] **Switching to Grade 2 increases the visible row count**
  Action: Record the visible row count at Grade 1. Click the radio with `value="2"`. Record the new visible row count.
  Assert: The Grade 2 count is greater than the Grade 1 count.

- [ ] **Switching to Grade 2 shows "but" (alphabetic wordsign)**
  Action: Click the radio with `value="2"`.
  Assert: At least one visible row has a Print cell containing `"but"`.

- [ ] **Switching back to Grade 1 hides Grade 2-only rows again**
  Action: Click `value="2"` then click `value="1"`.
  Assert: No visible row in `#rows` has a category tag whose text matches a Grade 2-only category.

- [ ] **Status text updates to reflect the active grade**
  Action: Click the radio with `value="2"`.
  Assert: `#status` text contains `"Grade 2"`.

---

## 3. Text search

- [ ] **Typing "the" filters the table to matching rows**
  Action: Type `"the"` into `#text-search` and wait 300 ms for the debounce.
  Assert: Every visible row has print text or notes text containing `"the"` (case-insensitive). The visible row count is less than the unfiltered count.

  Note: The search must be run with Grade 2 selected, because `"the"` as a strong wordsign only appears in Grade 2 data. With Grade 1 selected, `"the"` may still match notes text of some Grade 1 entries. Both states should be tested.

- [ ] **Search by notes text: typing "louis braille" returns the 'w' row**
  Action: Select Grade 1. Type `"louis braille"` into `#text-search` and wait 300 ms.
  Assert: The row with Print `"w"` is visible (its notes reference Louis Braille).

- [ ] **Status element updates to show filtered count and search term**
  Action: Type `"the"` into `#text-search` and wait 300 ms.
  Assert: `#status` text contains `"the"` in quotes and contains a number.

- [ ] **Clearing text search restores the full filtered set**
  Action: Type `"the"` into `#text-search` and wait 300 ms. Note the visible row count. Clear the field (delete all characters). Wait 300 ms.
  Assert: The visible row count returns to what it was before the search.

- [ ] **Search is case-insensitive**
  Action: Type `"THE"` into `#text-search` and wait 300 ms.
  Assert: At least one row is visible (same rows as lower-case "the" search).

- [ ] **Typing a term with no matches triggers no-results state**
  Action: Type `"zzzznotamatch"` into `#text-search` and wait 300 ms.
  Assert: No `tr` in `#rows` is visible. `#empty-state` is visible. `#status` text contains `"No entries match"`.

---

## 4. Dot search

- [ ] **Entering "1 2 3" shows rows with cells matching dots 1, 2, 3**
  Action: Type `"1 2 3"` into `#dot-search` and wait 300 ms.
  Assert: Every visible row contains `"dots 1, 2, 3"` in its dot-pattern column. The letter `l` row is among the visible rows (its cell is `[1,2,3]`).

  Note: With Grade 1 selected, only the alphabet entry `l` should be visible. With Grade 2 selected, the wordsign `like` (also `[1,2,3]`) will also appear.

- [ ] **Entering dash-separated "1-2-3" is treated the same as "1 2 3"**
  Action: Type `"1-2-3"` into `#dot-search` and wait 300 ms.
  Assert: The same rows are visible as for `"1 2 3"`.

- [ ] **Multi-cell search "5 / 1 4 5" shows the "day" contraction**
  Action: Select Grade 2. Type `"5 / 1 4 5"` into `#dot-search` and wait 300 ms.
  Assert: The row with Print `"day"` is visible (cells `[[5],[1,4,5]]`).

- [ ] **Dot search status text names the pattern**
  Action: Type `"1 2 3"` into `#dot-search` and wait 300 ms.
  Assert: `#status` text contains `"dot"` or `"dots"`.

- [ ] **Clearing dot search restores results**
  Action: Type `"1 2 3"` into `#dot-search` and wait 300 ms. Note the visible row count. Clear the field. Wait 300 ms.
  Assert: The visible row count returns to the unfiltered count for the current grade.

- [ ] **An invalid dot entry (non-digit characters only, e.g. "abc") shows all rows**
  Action: Type `"abc"` into `#dot-search` and wait 300 ms.
  Assert: The visible row count equals the unfiltered count (the parser ignores non-digit characters and produces a null result).

---

## 5. Category checkboxes

- [ ] **All Grade 1 categories are checked by default**
  Action: Navigate to `index.html` (Grade 1 default).
  Assert: The checkboxes for `alphabet`, `number`, `punctuation`, and `indicator` are all checked.

- [ ] **Unchecking "Alphabet" removes alphabet rows from the table**
  Action: Uncheck the checkbox with `value="alphabet"`.
  Assert: No visible row has category tag text `"Alphabet"`.

- [ ] **Re-checking "Alphabet" restores alphabet rows**
  Action: Uncheck then re-check the checkbox with `value="alphabet"`.
  Assert: Rows with category tag `"Alphabet"` are visible again.

- [ ] **Unchecking multiple categories removes all their rows**
  Action: Uncheck `value="alphabet"` and `value="number"`.
  Assert: No visible row has category tag `"Alphabet"` or `"Number"`.

- [ ] **Status count decreases when a category is unchecked**
  Action: Record the visible count. Uncheck `value="alphabet"`.
  Assert: The new count (read from `#status`) is less than the previous count.

- [ ] **Grade 2-only checkboxes are checked when Grade 2 is selected**
  Action: Click the radio with `value="2"`.
  Assert: The checkboxes for `wordsign`, `strong-wordsign`, `strong-groupsign`, `lower`, `initial-letter`, `final-letter`, and `shortform` are all checked.

- [ ] **Unchecking a Grade 2-only category (e.g. wordsign) removes those rows**
  Action: Select Grade 2. Uncheck the checkbox with `value="wordsign"`.
  Assert: No visible row has category tag text `"Wordsign"`.

---

## 6. Combined filters

- [ ] **Text search + Grade 1 filter combine correctly**
  Action: Confirm Grade 1 is selected. Type `"letter"` into `#text-search` and wait 300 ms.
  Assert: Every visible row has notes containing `"letter"` (case-insensitive) and no visible row has a Grade 2-only category.

- [ ] **Text search + Grade 2 filter shows more results than Grade 1**
  Action: Type `"letter"` into `#text-search` and wait 300 ms. Record the visible count (Grade 1). Select Grade 2. Wait 100 ms.
  Assert: The visible count with Grade 2 selected is greater than or equal to the Grade 1 count.

- [ ] **Dot search + category unchecked: unchecked category rows are excluded**
  Action: Type `"1 2 3"` into `#dot-search` and wait 300 ms. Uncheck the checkbox with `value="alphabet"`.
  Assert: The row for `"l"` (Alphabet category, dots 1, 2, 3) is no longer visible.

- [ ] **Text search + dot search together narrow results further**
  Action: Select Grade 1. Type `"letter"` into `#text-search` and wait 300 ms. Record the visible count. Type `"1 2 3"` into `#dot-search` and wait 300 ms.
  Assert: The combined count is less than or equal to the text-only count. The `"l"` row is visible (Print `"l"`, notes contain "letter", cells `[1,2,3]`).

- [ ] **Status text reflects all active filters when both search fields are populated**
  Action: Type `"letter"` into `#text-search`. Type `"1 2 3"` into `#dot-search`. Wait 300 ms.
  Assert: `#status` text contains both `"letter"` in quotes and a dot description.

---

## 7. No-results state

- [ ] **Text search with no matches shows the empty-state element**
  Action: Type `"zzzznotamatch"` into `#text-search` and wait 300 ms.
  Assert: `#empty-state` is visible (not hidden).

- [ ] **Text search with no matches shows "No entries match" in the status element**
  Action: Type `"zzzznotamatch"` into `#text-search` and wait 300 ms.
  Assert: `#status` text starts with `"No entries match"`.

- [ ] **No visible rows exist when no results match**
  Action: Type `"zzzznotamatch"` into `#text-search` and wait 300 ms.
  Assert: Every `tr` in `#rows` has `display: none` (or the `tbody` is empty of visible rows).

- [ ] **Clearing the search from a no-results state removes the empty-state element**
  Action: Type `"zzzznotamatch"` and wait 300 ms. Click `#clear-text`.
  Assert: `#empty-state` is hidden and `#rows` has at least one visible row.

- [ ] **All categories unchecked produces no-results state**
  Action: Uncheck every visible category checkbox.
  Assert: `#empty-state` is visible and `#status` text starts with `"No entries match"`.

---

## 8. Clear button behaviour

- [ ] **Clear text button is labelled "Clear"**
  Action: Navigate to `index.html`.
  Assert: `#clear-text` has accessible text `"Clear"`.

- [ ] **Clear dots button is labelled "Clear"**
  Action: Navigate to `index.html`.
  Assert: `#clear-dots` has accessible text `"Clear"`.

- [ ] **Clicking Clear text empties the text search field**
  Action: Type `"the"` into `#text-search` and wait 300 ms. Click `#clear-text`.
  Assert: `#text-search` value is `""`.

- [ ] **Clicking Clear text updates the results table**
  Action: Type `"the"` into `#text-search` and wait 300 ms. Record filtered count. Click `#clear-text`.
  Assert: The visible row count increases to the unfiltered count.

- [ ] **Clicking Clear text moves focus back to the text search input**
  Action: Type `"the"` into `#text-search`. Click `#clear-text`.
  Assert: `document.activeElement` is `#text-search`.

- [ ] **Clicking Clear dots empties the dot search field**
  Action: Type `"1 2 3"` into `#dot-search` and wait 300 ms. Click `#clear-dots`.
  Assert: `#dot-search` value is `""`.

- [ ] **Clicking Clear dots updates the results table**
  Action: Type `"1 2 3"` into `#dot-search` and wait 300 ms. Record filtered count. Click `#clear-dots`.
  Assert: The visible row count increases to the unfiltered count.

- [ ] **Clicking Clear dots moves focus back to the dot search input**
  Action: Type `"1 2 3"` into `#dot-search`. Click `#clear-dots`.
  Assert: `document.activeElement` is `#dot-search`.

- [ ] **Clear text button does not affect the dot search field**
  Action: Type `"the"` into `#text-search` and `"1 2"` into `#dot-search`. Click `#clear-text`.
  Assert: `#dot-search` value is still `"1 2"`.

- [ ] **Clear dots button does not affect the text search field**
  Action: Type `"the"` into `#text-search` and `"1 2"` into `#dot-search`. Click `#clear-dots`.
  Assert: `#text-search` value is still `"the"`.

---

## 9. Braille cell reference (details/summary)

- [ ] **Details element is present and collapsed by default**
  Action: Navigate to `index.html`.
  Assert: The `details` element exists and does not have the `open` attribute.

- [ ] **Clicking the summary opens the details element**
  Action: Click the `summary` element (labelled "Reference: how braille cells are numbered").
  Assert: The `details` element has the `open` attribute.

- [ ] **The expanded content describes the dot numbering**
  Action: Click the `summary` to open the `details`.
  Assert: The visible text within `details` includes both `"Dot 1"` and `"Dot 6"`.

- [ ] **Clicking the summary again closes the details element**
  Action: Click the `summary` to open, then click it again.
  Assert: The `details` element does not have the `open` attribute.

---

## 10. Glossary section

- [ ] **Terms used section is present**
  Action: Navigate to `index.html`.
  Assert: The element `#terms-used` exists in the DOM.

- [ ] **Terms used section has a visible heading**
  Action: Navigate to `index.html`.
  Assert: `#terms-used-heading` is visible and contains the text `"Terms used"`.

- [ ] **The glossary contains a definition list**
  Action: Navigate to `index.html`.
  Assert: A `dl` element exists within `#terms-used`.

- [ ] **The glossary contains at least one defined term**
  Action: Navigate to `index.html`.
  Assert: At least one `dt` element exists within `#terms-used dl`.

- [ ] **"Wordsign" is defined**
  Action: Navigate to `index.html`.
  Assert: A `dt` element contains the text `"Wordsign"` and a following `dd` element contains non-empty text.

- [ ] **"Contraction" is defined**
  Action: Navigate to `index.html`.
  Assert: A `dt` element contains the text `"Contraction"` and a following `dd` element contains non-empty text.

- [ ] **"Shortform" is defined**
  Action: Navigate to `index.html`.
  Assert: A `dt` element contains the text `"Shortform"` and a following `dd` element contains non-empty text.

---

## 11. Keyboard operability

- [ ] **Skip link is the first focusable element**
  Action: Navigate to `index.html`. Press Tab once.
  Assert: The focused element is the `.skip-link` anchor.

- [ ] **Skip link target exists**
  Action: Navigate to `index.html`.
  Assert: An element with `id="main"` exists in the DOM.

- [ ] **Tab reaches the Grade 1 radio button**
  Action: Tab through the page from the skip link.
  Assert: At some point `document.activeElement` is the radio with `value="1"`.

- [ ] **Tab reaches the Grade 2 radio button**
  Action: Tab through the page from the skip link.
  Assert: At some point `document.activeElement` is the radio with `value="2"`.

- [ ] **Arrow keys move between grade radio buttons**
  Action: Focus the radio with `value="1"`. Press ArrowDown or ArrowRight.
  Assert: The radio with `value="2"` becomes checked and focused.

- [ ] **Tab reaches the Alphabet category checkbox**
  Action: Tab through the page.
  Assert: At some point `document.activeElement` is the checkbox with `value="alphabet"`.

- [ ] **Space toggles a category checkbox**
  Action: Tab to the checkbox with `value="alphabet"`. Press Space.
  Assert: The checkbox becomes unchecked. Press Space again; it becomes checked.

- [ ] **Tab reaches the text search input**
  Action: Tab through the page.
  Assert: At some point `document.activeElement` is `#text-search`.

- [ ] **Tab reaches the Clear text button**
  Action: Tab through the page.
  Assert: At some point `document.activeElement` is `#clear-text`.

- [ ] **Enter activates the Clear text button when focused**
  Action: Type `"the"` into `#text-search`. Tab to `#clear-text`. Press Enter.
  Assert: `#text-search` value is `""` and results update.

- [ ] **Tab reaches the dot search input**
  Action: Tab through the page.
  Assert: At some point `document.activeElement` is `#dot-search`.

- [ ] **Tab reaches the Clear dots button**
  Action: Tab through the page.
  Assert: At some point `document.activeElement` is `#clear-dots`.

- [ ] **Tab reaches the details summary**
  Action: Tab through the page.
  Assert: At some point `document.activeElement` is the `summary` element.

- [ ] **Enter opens the details element when summary is focused**
  Action: Tab to the `summary` element. Press Enter.
  Assert: The parent `details` element has the `open` attribute.

- [ ] **No element traps keyboard focus**
  Action: Tab repeatedly from the beginning of the page until focus returns to the browser chrome or wraps back to the first focusable element.
  Assert: Every interactive element (skip link, radios, checkboxes, text inputs, clear buttons, summary) receives focus in document order with no element that cannot be tabbed away from.
