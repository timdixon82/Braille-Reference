# Exception: pa11y alpha-compositing false positive on #status

## Status

- State: Active
- Decided: 2026-07-14
- Supersedes: None
- Superseded by: None

## Statement

`pa11y.json`'s `ignore` array suppresses `WCAG2AAA.Principle1.Guideline1_4.1_4_6.G17.Fail` (the WCAG 2.2 AAA colour-contrast rule) project-wide in the pa11y gate. This is a targeted suppression of one confirmed tool false positive, not a waiver of the underlying WCAG 2.2 AAA 7:1 contrast requirement.

### The finding

The `#status` element (`<div class="status" role="status" id="status">`) has a semi-transparent background, `rgba(235, 156, 82, 0.16)`. Pa11y's engine, HTML_CodeSniffer, cannot composite a semi-transparent background colour against the page behind it. Instead of computing a real ratio, it reports the element's contrast as `NaN:1` and fails the 7:1 AAA rule:

```
Expected a contrast ratio of at least 7:1, but text in this element has a contrast ratio of NaN:1.
```

`NaN:1` is a measurement failure inside the tool, not a real contrast defect.

### The evidence

axe-core, run at WCAG 2.2 AAA against the same page, composites alpha channels correctly. It reports **0 violations**, confirming `#status` meets the 7:1 AAA contrast requirement against its actual rendered background. This confirms the pa11y result is a false positive, not a genuine accessibility defect.

The `NaN:1` result is pre-existing behaviour of pa11y's HTML_CodeSniffer engine on any element with a semi-transparent background; it was not introduced by the work that closed out this exception (branch `sean/ci-archetype-and-tests`, pull request #28).

### Scope

This exception covers only the `NaN:1` alpha-compositing limitation in pa11y's HTML_CodeSniffer engine, as observed on the `#status` element's semi-transparent background. It does not:

- Waive the WCAG 2.2 AAA 7:1 contrast requirement for `#status` or any other element. axe-core, which composites alpha correctly, remains a required, un-ignored gate and will catch a genuine contrast regression anywhere on the page, including `#status`.
- Cover any other pa11y rule or any other element's contrast finding. A future genuine `G17.Fail` result on an element with a fully opaque background would not be covered by this exception and must be investigated on its own.

### Why the ignore is scoped this broadly within pa11y.json

Pa11y's `ignore` option matches only by rule code or issue type; it has no per-element or per-selector scoping. Ignoring `WCAG2AAA.Principle1.Guideline1_4.1_4_6.G17.Fail` project-wide in pa11y.json is therefore the narrowest suppression the tool allows. The residual risk this leaves — a real contrast failure on some other element going unflagged by pa11y — is accepted because axe-core, run as a separate, mandatory CI step with `--exit`, independently enforces the same 7:1 AAA rule with correct alpha compositing across the whole page.

## References

- `pa11y.json`, `ignore` array and `_ignoreComment`.
- `.github/workflows/accessibility.yml`, the `Pa11y at WCAG 2.2 AAA` and `axe-core at WCAG 2.2 AAA` steps.
- Pull request #28 (branch `sean/ci-archetype-and-tests`).
