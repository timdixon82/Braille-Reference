# Coding Standards: Braille-Reference

This page records project-specific notes. It does not duplicate the global standards.

The full stack-independent standards are in the [AgentTeam global wiki: coding-standards.md](../../AgentTeam/docs/coding-standards.md). The static front-end stack standards are in the [AgentTeam global wiki: stacks/static-front-end.md](../../AgentTeam/docs/stacks/static-front-end.md). Both apply in full to this project.

## Stack

Static front-end of HTML (HyperText Markup Language), CSS (Cascading Style Sheets), and JavaScript, hosted on GitHub Pages. No server, no database, no build step (see [Decision Record 002: No build step](decisions/002-no-build-step.md)).

## File structure

The current state is a single `index.html` file containing all HTML structure, CSS, and JavaScript. This is a known, recorded gap against the stack standard. See [Decision Record 001: Keep the single-file structure for the adoption work](decisions/001-single-file-structure.md) for the rationale and the planned split.

The target layout, when the split is scheduled as follow-up work, is:

- `index.html`: page structure only.
- `css/styles.css`: all presentation.
- `js/braille-reference.js`: behaviour, helpers, rendering, search parsing, and filtering.
- `js/braille-data.js`: the UEB data set, currently the `data` array at lines 309 to 519 of `index.html`.

## DOM writes

All writes to the Document Object Model (DOM) use the `.textContent` property, never `innerHTML` or adjacent methods. This pattern eliminates DOM-based cross-site scripting (XSS) and must be maintained in any future change. See [Jed's code review](../../AgentTeam/.claude/work/006-braille-reference-setup/jed-code-review.md), Finding 4.

## Dependencies

Zero third-party runtime dependencies. No external scripts, no external stylesheets, no external fonts. See [Decision Record 004: Zero third-party runtime dependencies](decisions/004-zero-dependencies.md). If any dependency is added in the future, it follows the rules in the global stack standard: self-hosted where possible, pinned with Subresource Integrity (SRI) if loaded from a content delivery network (CDN), and recorded in the architecture decision record.

## Version string

A version string is required on this repository, per Tim's decision at Q16 and the team's global standard in [AgentTeam global wiki: coding-standards.md](../../AgentTeam/docs/coding-standards.md), Repository Standards section. The version string lives in a plain-text `VERSION` file at the repository root, and is also shown in the page itself. Adding the version string is recorded in [todo.md](../todo.md) as outstanding setup work for Sean.

## Linting

Linters must be pinned in a `package.json` development manifest, per the [team's standing standard for adopted static projects](../../AgentTeam/docs/decisions/006-adopted-static-project-standards.md), standard 4. This is outstanding setup work for Sean.

The default linter set for this stack:

- HTMLHint for HTML structure.
- Stylelint for CSS.
- ESLint for JavaScript.

## Language

The HTML element carries `lang="en-GB"`. The site uses British English spelling. UEB is the braille standard for English-speaking countries including the United Kingdom.
