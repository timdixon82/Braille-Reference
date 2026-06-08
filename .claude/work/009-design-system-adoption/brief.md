# Work Brief: 009-design-system-adoption

## Summary

Adopt the June 2026 Tim Dixon Design System in the Braille-Reference project. This is a first-time installation: the project currently holds all styles inline in `index.html` and has no separate `colors_and_type.css`, `theme.js`, or Roboto font files. The work extracts the design system into canonical external files, wires the four-theme model into the page, and migrates the inline custom properties to the design system token names.

## Status

Status: done

## Triage type

Small feature.

## Out of scope

- Redesigning the layout or any component.
- Changing heading levels, copy, or braille data.
- Modifying the GoatCounter analytics integration.
- Any change to the Playwright test suite beyond confirming tests still pass after the token migration.

## In scope (updated 2026-06-08 — Tim's direction)

- **Use Roboto throughout.** Remove the Georgia body-font override. The page must use `var(--font-sans)` (Roboto) as the design system intends.
- **Add a visible four-theme selector.** A user-facing control must appear on the page so users can choose between Light, Dark, Muted Light, and Muted Dark. The selector must be fully keyboard-accessible and correctly labelled for screen readers. It must call `window.tdTheme.set(name)` to apply and persist the chosen theme.

## Risk and rollback

- **Risk:** Migrating from inline custom properties (`--navy`, `--orange`, `--ink`, `--muted`) to design system tokens (`--accent`, `--warm`, `--fg`, `--fg-muted`) requires a careful audit. A missed reference would show unstyled or wrongly coloured elements.
- **Risk:** The Content Security Policy in `index.html` has `style-src 'self' 'unsafe-inline'` — adding an external `<link rel="stylesheet">` is allowed by `'self'`, so no CSP change is needed.
- **Risk:** `theme.js` must be the first script in `<head>` before any stylesheet to avoid a flash of the wrong colour scheme. The existing `<style>` block defines the `:root` defaults; that block will need updating or removal once external CSS is in place.
- **Rollback:** The feature branch can be abandoned. No database or deployment change is involved; reverting the PR is sufficient.

## Definition of done

- `assets/css/colors_and_type.css` exists with canonical content from AgentTeam.
- `assets/js/theme.js` exists with canonical content from AgentTeam.
- `assets/fonts/Roboto-VariableFont.ttf`, `assets/fonts/Roboto-Italic-VariableFont.ttf`, and `assets/fonts/OFL.txt` are present.
- `index.html` links `assets/css/colors_and_type.css` via `<link rel="stylesheet">`.
- `theme.js` is the first script in `<head>`, before any `<link rel="stylesheet">`.
- The inline `:root` block in `index.html` is removed or reduced to project-specific overrides only. All colour and type references use design system tokens (`--accent`, `--warm`, `--fg`, `--fg-muted`, `--bg`, `--border`, etc.).
- No old hardcoded hex values from the pre-design-system palette remain in `*.css`, `*.html`, or `*.js` files (excluding `node_modules`).
- Body font is Roboto (via `var(--font-sans)`); no Georgia override remains.
- A visible theme selector is present on the page with four options (Light, Dark, Muted Light, Muted Dark), fully keyboard-accessible, and correctly labelled for screen readers.
- Carol signs off: four-theme switching works via the selector, WCAG 2.2 AAA passes in all four themes, Roboto loads from the project fonts folder, no layout regressions.

## Pre-approved GitHub actions

- [x] Create a branch
- [x] Commit to a branch
- [x] Push a branch (not main)
- [x] Open a pull request
- [x] Comment on a pull request or issue
- [x] Create an issue

Merging to main: always paused for Tim's express approval.

## Source files (from AgentTeam)

| File | Canonical path |
|---|---|
| Colour and type tokens | `/Users/timdixon/Code/AgentTeam/docs/design-system/tokens/colors_and_type.css` |
| Theme bootstrap script | `/Users/timdixon/Code/AgentTeam/docs/design-system/tokens/theme.js` |
| Roboto upright | `/Users/timdixon/Code/AgentTeam/docs/design-system/fonts/Roboto-VariableFont.ttf` |
| Roboto italic | `/Users/timdixon/Code/AgentTeam/docs/design-system/fonts/Roboto-Italic-VariableFont.ttf` |
| Font licence | `/Users/timdixon/Code/AgentTeam/docs/design-system/fonts/OFL.txt` |

## Current project design-system state

- All styles are inline in `index.html` inside a `<style>` block in `<head>`.
- The project defines its own `:root` custom properties:
  - `--navy: #0A2342`
  - `--orange: #FF6F00`
  - `--bg: #FFFFFF`
  - `--ink: #0A2342`
  - `--muted: #4A5568`
  - `--rule: #767676`
  - `--highlight: #FFF9F0`
  - `--focus: #0A2342`
- Several hardcoded hex values exist inline: `#fff`, `#fafbfc`, `#f7f9fb`, `#e6eaf0`.
- No Roboto fonts. Body uses Georgia/serif. Sans-serif is not used.
- No `theme.js` or dark/muted theme support.

## Token mapping (old project names → design system tokens)

| Old name | Design system token | Notes |
|---|---|---|
| `--navy` | `--accent` | Interactive navy in light theme |
| `--ink` | `--fg` | Body text |
| `--muted` | `--fg-muted` | Secondary text |
| `--bg` | `--bg` | Already named correctly |
| `--orange` | `--warm` | Brand orange fill |
| `--rule` | `--border` | Dividers |
| `--highlight` | `--accent-subtle` | Subtle tinted background |
| `--focus` | `--accent` | Focus ring (same as interactive) |
| `#fff` inline | `var(--bg-card)` or `var(--accent-text)` depending on context |
| `#fafbfc`, `#f7f9fb` | `var(--bg)` or `var(--neutral-bg)` depending on context |
| `#e6eaf0` | `var(--border)` or `var(--neutral-bg)` depending on context |

## Adoption pattern reference

`/Users/timdixon/Code/AgentTeam/docs/patterns/design-system-adoption.md`
