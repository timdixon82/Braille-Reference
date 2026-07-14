# Project Log: Braille-Reference

This log is chronological and append-only. Each entry begins with the date, the operation, and its subject.

## [2026-05-23] open | Project wiki scaffolded

Tad created the project wiki during work 006-braille-reference-setup. Files created: `docs/index.md`, `docs/log.md`, `docs/glossary.md`, `docs/coding-standards.md`, `docs/accessibility.md`, `docs/release-process.md`, `docs/decisions/001-single-file-structure.md`, `docs/decisions/002-no-build-step.md`, `docs/decisions/003-github-pages-security-headers.md`, `docs/decisions/004-zero-dependencies.md`, `docs/exceptions/001-security-headers.md`, `docs/exceptions/002-clickjacking-permissions.md`, and `todo.md` at the repository root.

Decision records follow Jacob's four Architecture Decision Records from `jacob-architecture-review.md`. Exceptions follow Jed's and Gerrie's security findings. Accessibility gaps follow Carol's baseline WCAG 2.2 AAA audit. The Q15 full-UEB-coverage future milestone, the Q16 version string, and the Q17 expanded README are recorded in `todo.md`.

## [2026-07-14] ingest | pa11y NaN false positive on #status documented as exception

Pull request #28's CI had one remaining red check: pa11y's WCAG 2.2 AAA scan reported `#status` at a contrast ratio of `NaN:1` and failed `WCAG2AAA.Principle1.Guideline1_4.1_4_6.G17.Fail`. `#status` has a semi-transparent background, `rgba(235, 156, 82, 0.16)`; pa11y's HTML_CodeSniffer engine cannot composite a semi-transparent background, so it cannot compute a real ratio. axe-core, which composites alpha correctly, reports 0 violations at WCAG 2.2 AAA and confirms `#status` conforms.

`pa11y.json`'s `ignore` array now suppresses `WCAG2AAA.Principle1.Guideline1_4.1_4_6.G17.Fail`, the narrowest scope pa11y's ignore mechanism allows (rule code only, no per-element scoping), with an inline `_ignoreComment` recording the rationale. `docs/exceptions/pa11y-alpha-compositing-status.md` records the exception per Decision 017's status-block convention (State: Active). axe-core remains a required, un-ignored gate and continues to enforce the 7:1 AAA requirement across the whole page, including `#status`.
