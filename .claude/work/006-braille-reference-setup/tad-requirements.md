# Business Analysis: Braille-Reference

## 1. Purpose and background

Braille-Reference is a single-page, client-side reference tool for the Unified English Braille (UEB) standard. It was created before the team existed and predates any formal requirements or documentation. This document reverse-engineers the project's purpose, users, requirements, and acceptance criteria from the source code alone.

The site is a static HTML, CSS, and JavaScript application. It has no back-end server, no database, and no build step. It is served as a single `index.html` file, intended for GitHub Pages.

## 2. Project purpose

The site gives users a filterable, searchable table of every UEB braille symbol at Grade 1 (uncontracted) and Grade 2 (contracted). It lets a user quickly look up the braille dot pattern for a given letter, word, or symbol, or reverse-look up the print meaning of a given dot pattern.

## 3. Target users

The site targets three overlapping groups.

1. Sighted people who are learning to read or transcribe braille and need a quick reference.
2. People with visual impairments who use screen readers and want an accessible reference they can navigate by keyboard.
3. Teachers, transcribers, and braille proofreaders who need to verify or look up specific UEB patterns.

Tim Dixon is a member of the second group. The original author built accessibility into the site from the start: the code includes skip links, a live status region, screen-reader fallback text for braille glyphs, visible focus indicators, and keyboard-focusable table rows.

## 4. Functional requirements

### 4.1 Data coverage

1. The site must display all 26 letters of the UEB alphabet with their dot patterns.
2. The site must display all 10 UEB digits (0 to 9), each shown as a two-cell sequence: the numeric indicator followed by the corresponding letter cell.
3. The site must display at least the following UEB punctuation marks: comma, semicolon, colon, full stop, exclamation mark, question mark, apostrophe, hyphen, opening and closing double quotation marks, and opening and closing round brackets.
4. The site must display the UEB indicators: capital letter, capital word, capital passage, numeric, Grade 1, italic symbol, and bold symbol.
5. In Grade 2 mode, the site must display all 23 UEB alphabetic wordsigns.
6. In Grade 2 mode, the site must display the 5 strong wordsigns: and, for, of, the, with.
7. In Grade 2 mode, the site must display all 12 strong groupsigns: ch, gh, sh, th, wh, ed, er, ou, ow, st, ar, ing.
8. In Grade 2 mode, the site must display the lower wordsigns and groupsigns (13 entries in the current data set).
9. In Grade 2 mode, the site must display all initial-letter contractions (dot-5 prefix, dots-4-5 prefix, and dots-4-5-6 prefix groups, 27 entries in the current data set).
10. In Grade 2 mode, the site must display all final-letter contractions (dots-4-6 prefix and dots-5-6 prefix groups, 12 entries).
11. In Grade 2 mode, the site must display the common shortforms (17 entries in the current data set).

### 4.2 Grade filter

12. The site must provide a "Grade 1" option that shows only entries with grade 1 data (alphabet, numbers, punctuation, and indicators). Grade-2-only category checkboxes must be hidden in this mode.
13. The site must provide a "Grade 2" option that shows all entries, including all Grade 2 contractions and shortforms. Grade-2-only category checkboxes must be visible in this mode.
14. Switching grade must update the table and the live status region without a page reload.

### 4.3 Category filter

15. The site must provide a checkbox for each data category so that the user can show or hide each category independently.
16. In Grade 1 mode, the following categories must be available: Alphabet, Numbers, Punctuation, Indicators.
17. In Grade 2 mode, the following additional categories must be available: Alphabetic wordsigns, Strong wordsigns, Strong groupsigns, Lower contractions, Initial-letter contractions, Final-letter contractions, Shortforms.
18. All checkboxes must be checked by default when the page loads.
19. Changing any checkbox must update the table and the live status region without a page reload.

### 4.4 Text search

20. The site must provide a text search field that filters rows by matching against the print form and the notes field (case-insensitive).
21. The text search must be debounced so that the table updates after a short pause, not on every keystroke, to avoid overwhelming screen readers.
22. The site must provide a "Clear" button that empties the text search field, reapplies filters, and returns focus to the text search field.

### 4.5 Dot-pattern search

23. The site must provide a dot-pattern search field. The user enters dot numbers 1 to 6 to describe a braille cell. Multiple cells in a pattern are separated by a forward slash.
24. The dot-pattern search must match any entry whose cell sequence contains the searched pattern as a contiguous subsequence.
25. The dot-pattern search must be debounced in the same way as the text search.
26. The site must provide a "Clear" button for the dot-pattern field that empties it, reapplies filters, and returns focus to the dot-pattern field.

### 4.6 Reference table

27. The table must have five columns: Print, Braille, Dot pattern, Category, and Notes.
28. Each row must show the print form, the rendered braille glyph, the dot pattern as text (for example "dots 1, 2, 3"), the category label, and usage notes.
29. When no rows match the active filters, the site must show an empty-state message explaining that no entries match and suggesting the user clear the search or select more categories.

### 4.7 Dot-numbering reference

30. The site must include a collapsible section that explains how the six dots in a braille cell are numbered (dots 1 to 3 form the left column; dots 4 to 6 form the right column). This aids users who are unfamiliar with the dot-numbering convention.

### 4.8 Live status

31. The site must maintain a live status region (ARIA live region with role="status") that announces the number of matching entries and the active filters after every filter change.

## 5. Non-functional requirements

### 5.1 Accessibility

32. The site must conform to WCAG 2.2 at AAA level.
33. The site must be fully operable by keyboard alone, with no action requiring a mouse or trackpad.
34. The site must include a skip link that bypasses the filter controls and moves focus directly to the main content region.
35. All interactive controls must have visible focus indicators with a minimum 3:1 contrast ratio against their backgrounds.
36. Every braille glyph rendered as a Unicode braille character must have a screen-reader-only text alternative that describes the dot pattern in plain language (for example "Braille glyph: dots 1, 2, 3.").
37. The table must have a caption that describes its content and columns, even if that caption is visually hidden.
38. Table column headers must use scope="col".
39. The collapsible dot-numbering section must be implemented with the HTML details and summary elements so it works without JavaScript.

### 5.2 Performance

40. The site must work as a single HTML file with no external dependencies (no CDN scripts, no external fonts, no external style sheets).
41. The site must load and render correctly without a network connection after the initial load.

### 5.3 Internationalisation and language

42. The HTML element must carry the attribute lang="en-GB", as the site uses British English spelling and UEB is the braille standard for English-speaking countries including the United Kingdom.

### 5.4 Responsiveness

43. The table must be wrapped in a scrollable container so that it remains accessible on narrow viewports without content being clipped.
44. The page must render usably at viewport widths from 320 px upward.

### 5.5 Data integrity

45. Every data entry must carry a grade value (1 or 2), a category, a print form, at least one cell with at least one dot, and a non-empty notes string.
46. Dot values must be integers from 1 to 6 inclusive.

## 6. Acceptance criteria

The following checklist covers the functional and non-functional requirements. Each criterion can be tested as true or false.

### 6.1 Grade filter

- [ ] Selecting "Grade 1" hides all rows with grade 2.
- [ ] Selecting "Grade 1" hides all Grade-2-only category checkboxes.
- [ ] Selecting "Grade 2" shows all rows.
- [ ] Selecting "Grade 2" shows all category checkboxes including Grade-2-only ones.
- [ ] Changing grade updates the live status region text.
- [ ] Grade 1 is selected by default on page load.

### 6.2 Category filter

- [ ] Unchecking "Alphabet" hides all alphabet rows.
- [ ] Rechecking "Alphabet" restores all alphabet rows (subject to other active filters).
- [ ] All category checkboxes are checked on page load.
- [ ] Changing a category checkbox updates the live status region text.

### 6.3 Text search

- [ ] Typing "the" returns all rows whose print form or notes contain "the" (case-insensitive).
- [ ] Typing a string that matches no row triggers the empty-state message.
- [ ] The table does not update on every keystroke; it updates after the debounce interval.
- [ ] The "Clear" button empties the text field.
- [ ] After "Clear" is activated, focus is on the text search field.
- [ ] Clearing the text field restores the full filtered result set.

### 6.4 Dot-pattern search

- [ ] Entering "1 2 3" returns only rows that contain a cell with exactly dots 1, 2, 3.
- [ ] Entering "5 / 1 4 5" returns the entry for "day" (dot 5 followed by dots 1, 4, 5).
- [ ] Entering a pattern that matches no row triggers the empty-state message.
- [ ] The "Clear" button empties the dot-pattern field.
- [ ] After "Clear" is activated, focus is on the dot-pattern field.

### 6.5 Table content

- [ ] All 26 alphabet letters are present with correct dot patterns.
- [ ] All 10 digits are present; each is shown as a two-cell pattern beginning with the numeric indicator (dots 3, 4, 5, 6).
- [ ] Each table row has five cells: Print, Braille, Dot pattern, Category, Notes.
- [ ] Every Braille cell contains a visible glyph and a screen-reader-only span describing the dot pattern.
- [ ] Every row in Grade 2 mode with grade 2 data is visible.
- [ ] The empty-state message appears when no rows are visible.
- [ ] The empty-state message is hidden when at least one row is visible.

### 6.6 Dot-numbering reference

- [ ] The collapsible section is closed by default.
- [ ] Activating the summary opens the section and shows the dot-layout explanation.
- [ ] The section opens and closes using the keyboard alone (Enter or Space on the summary element).

### 6.7 Accessibility

- [ ] Activating the skip link moves focus to the main content region, bypassing the filter controls.
- [ ] Tab order follows a logical, left-to-right, top-to-bottom sequence through all controls.
- [ ] Every form control has a visible, programmatically associated label.
- [ ] The radio group for braille grade is wrapped in a fieldset with a legend.
- [ ] The category checkbox group is wrapped in a fieldset with a legend.
- [ ] The live status region announces the entry count after every filter change.
- [ ] The braille glyph span carries aria-hidden="true".
- [ ] The screen-reader-only span is present in every Braille column cell and contains the dot description.
- [ ] The table caption is present in the DOM (even if visually hidden).
- [ ] All column headers carry scope="col".
- [ ] Focus indicators are visible on all interactive elements.
- [ ] Colour is not the only means of conveying information.

### 6.8 Performance and compatibility

- [ ] The page loads with no external HTTP requests (no CDN, no remote fonts, no remote scripts).
- [ ] The page renders and all filtering works with JavaScript enabled.
- [ ] The collapsible section works with JavaScript disabled (native details/summary behaviour).
- [ ] The html element carries lang="en-GB".

## 7. Personal data assessment

The site collects no personal data. There are no user accounts, no form submissions sent to a server, no cookies, no analytics scripts, and no third-party services. All filtering and searching runs entirely in the browser using data embedded in the HTML file. No UK General Data Protection Regulation (UK GDPR) obligations arise from this site in its current form.

If the site is later given analytics, contact forms, or user accounts, a data protection assessment will be needed at that time.

## 8. Open questions

The following questions need Tim's input. They are batched here for Sonja to pass to Tim.

1. The current data set covers the most common UEB Grade 2 contractions and shortforms, but UEB is a large standard. Should the site aim to cover the complete UEB symbol inventory, or is the current subset the intended scope?

   A. Current subset is the intended scope; do not add more entries unless requested.
   B. Aim for full UEB coverage as a future milestone (to be planned separately).
   C. Tim to clarify the exact intended scope.

2. The dot-layout diagram inside the collapsible section is marked aria-hidden="true" in the HTML. The prose paragraph below it describes the layout in text, so screen reader users are not disadvantaged. This is the correct pattern. No question arises here; noting it as a finding only.

3. The site has no documented versioning or changelog. Should the team add a visible or hidden version string to the page so that releases can be tracked?

   A. Yes, add a version string (could be a hidden meta tag or a small footer note).
   B. No, rely on the Git tag history alone.

4. The README.md is currently a single-line description. Should the team expand it to include setup instructions, a description of the data structure, and a link to the live site?

   A. Yes, expand the README as part of the project-setup work.
   B. No, keep the README minimal.
