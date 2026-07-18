# Carol review — 009 Design system adoption (final)

## Verdict: PASS

All functional, accessibility, and visual checks pass. No blocking issues.
Two pre-existing console notices are noted below as non-blocking observations.

---

## Blocking issues

None.

---

## Warnings (non-blocking)

**W1 — Missing favicon (pre-existing)**
`GET /favicon.ico` returns 404 on every page load. This predates this PR and
is not introduced by the design system adoption. Noted for completeness.

**W2 — GoatCounter localhost notice (expected)**
GoatCounter logs "not counting because of: localhost" when the page is served
locally. This is the analytics script's intended behaviour, not a defect.

---

## Checks completed

- [x] **theme.js first in `<head>`** — PASS
  `<script src="assets/js/theme.js">` is line 4 of `index.html`, the first
  child of `<head>` (which opens at line 3), before every `<link>` and
  `<style>` tag. The script runs synchronously so `data-theme` is set on
  `<html>` before the browser parses any CSS, eliminating flash of wrong
  palette.

- [x] **Stylesheet link order** — PASS
  `<link rel="stylesheet" href="assets/css/colors_and_type.css">` is on
  line 10, after `theme.js` (line 4) and immediately before the inline
  `<style>` block (line 11).

- [x] **Font files present** — PASS
  `assets/fonts/Roboto-VariableFont.ttf`,
  `assets/fonts/Roboto-Italic-VariableFont.ttf`, and
  `assets/fonts/OFL.txt` all present.

- [x] **Old hex values absent** — PASS
  Grep for all nine retired palette hex values (#061528, #FF7C00, #63D2FF,
  #0A2342, #FF6F00, #4A5568, #767676, #FFF9F0, #fafbfc, #f7f9fb, #e6eaf0)
  across all *.html, *.css, and *.js files (excluding node_modules and .git)
  found zero hits in `index.html` or any project-level file. The only hits
  were inside `assets/css/colors_and_type.css` itself, where #061528 appears
  as the design system's dark theme token definitions (--bg, --accent-text,
  --warm-text). Token definitions in the design system file are expected.

- [x] **Georgia font override absent** — PASS
  `grep -n "Georgia" index.html` returned no output. The `body` rule in the
  inline style no longer carries a `font-family: Georgia` declaration.
  The design system's `body { font-family: var(--font-sans); }` applies
  Roboto without override.

- [x] **Theme selector present and labelled** — PASS
  `<select id="theme-select">` is present in `<header>` with four `<option>`
  values: `light`, `dark`, `muted-light`, `muted-dark`.
  `<label for="theme-select">Colour theme</label>` is correctly associated and
  visible: CSS sets `font-weight: bold; color: var(--navy); white-space: nowrap`
  with no `display:none`, `visibility:hidden`, or `aria-hidden`. The select
  also carries `aria-label="Choose colour theme"` as an additional screen-reader
  cue. Touch target: `min-height: var(--hit)` resolves to 44 px, meeting
  WCAG 2.5.8.

- [x] **Theme selector JS wired correctly** — PASS
  The IIFE at the end of `<body>` (lines 834-841 of `index.html`):
  - Gets the select element by `id="theme-select"` and guards on null.
  - Assigns `sel.value = document.documentElement.dataset.theme || 'light'`
    so the dropdown always reflects the active theme on load.
  - Calls `window.tdTheme.set(sel.value)` on the `change` event, which
    applies the theme and persists it to `localStorage` via `theme.js`.

- [x] **Pa11y WCAG 2.2 AAA** — PASS
  `npx pa11y http://localhost:8081 --config pa11y.json` reported: "No issues
  found."

- [x] **Playwright 79 tests** — PASS
  `npx playwright test` completed: 79 passed, 0 failed, 0 skipped in 1 minute.
  All eleven test groups pass: page load, grade filter, text search, dot search,
  category checkboxes, combined filters, no-results state, clear button behaviour,
  braille cell reference, glossary section, and keyboard operability.

- [x] **Four-theme visual check** — PASS
  Playwright evaluated `document.documentElement.dataset.theme = '<value>'` for
  each theme in turn and screenshots were taken.

  Light (#F4F6F8 background, #0C3B64 navy headings): clean light-grey surface;
  "Colour theme" label and selector readable in deep navy. Theme selector shows
  correct current value.

  Dark (#061528 deep navy background, #E2E7EC light body text, #EB9C52 orange
  accents): stark dark surface; selector border in orange accent; label and
  selector clearly readable against navy.

  Muted Light (#EDF0F3 background, #234A73 slate-navy accents): fully
  desaturated light surface; softer than standard light but distinct; selector
  and label readable.

  Muted Dark (#142536 background, #E3C196 warm-sand accents): quieter dark
  surface, visually distinct from regular dark (#061528 vs #142536); selector
  border in warm sand; label readable.

  All four themes are visually distinct. No theme produces illegible text. The
  theme selector is readable in every theme.

- [x] **Roboto font loading** — PASS
  `document.fonts.check('16px Roboto')` evaluated in-browser by the Playwright
  MCP tool returned `true`. The `@font-face` blocks in `colors_and_type.css`
  reference `../fonts/Roboto-VariableFont.ttf` and
  `../fonts/Roboto-Italic-VariableFont.ttf`, both present. The design system
  `body { font-family: var(--font-sans); }` is no longer overridden by a
  Georgia declaration in the project CSS, so Roboto loads and renders.

- [x] **WCAG 1.4.11 interactive border contrast (all four themes)** — PASS
  `--rule` maps to `var(--neutral)` in the inline project alias (line 18 of
  `index.html`). Contrast ratios computed with the WCAG relative luminance
  formula:

  | Theme       | --neutral | --bg      | Ratio  | SC 1.4.11 |
  |-------------|-----------|-----------|--------|-----------|
  | light       | #46505E   | #F4F6F8   | 7.54:1 | PASS      |
  | dark        | #9FB6CC   | #061528   | 8.76:1 | PASS      |
  | muted-light | #4A535D   | #EDF0F3   | 6.83:1 | PASS      |
  | muted-dark  | #C2CCD6   | #142536   | 9.57:1 | PASS      |

  All four exceed the 3:1 minimum required by WCAG 2.2 SC 1.4.11 (non-text
  contrast). The previous review found this criterion failing because `--rule`
  was mapped to `var(--border)` (a low-contrast divider token). The current
  branch corrects that mapping to `var(--neutral)`.

---

## Accessibility specialist recommendation

No automated tool flags and no new interactive patterns triggered a specialist
referral in this pass. The theme selector uses a native `<select>` with a
visible associated `<label>` and supplementary `aria-label`. No custom ARIA
patterns were introduced.

---

*Tested by Carol on 2026-06-08. Branch: `feat/design-system-adoption`. PR 23.*
