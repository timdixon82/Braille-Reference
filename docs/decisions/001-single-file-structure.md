# Decision Record 001: Keep the single-file structure for the adoption work

## Status

Accepted. Proposed by Jacob (architect) on 2026-05-21, during work 006-braille-reference-setup. Accepted under the team's standing standard in [AgentTeam global wiki: decisions/006-adopted-static-project-standards.md](../../../AgentTeam/docs/decisions/006-adopted-static-project-standards.md), standard 1, which applies to every adopted static front-end project.

## Context

Braille-Reference is an existing repository adopted as a team project. The whole page is one `index.html` of 757 lines. That single file holds all three concerns: HTML structure, a `<style>` block of CSS (lines 7 to 213), and a `<script>` block of JavaScript (lines 301 to 755).

The team's static front-end stack standard says: keep structure (HTML), presentation (CSS), and behaviour (JavaScript) in separate files.

The current layout does not meet that standard. This record explains the approach taken during the adoption work.

The JavaScript block mixes two kinds of content. Lines 309 to 519 are the UEB data set: roughly 175 braille entries, each with a print form, dot pattern, category, and usage notes. Lines 521 to 754 are the behaviour: helpers that convert dot numbers to braille glyphs, build the table rows, parse the dot-pattern search, and apply the filters. A data set and the logic that consumes it are mixed in one block.

## Decision

Keep the single-file structure for the project-adoption work (work 006). Do not split the file as part of that work.

Two reasons:

1. The adoption work is a backfill of reviews and repository configuration, not a feature change. Splitting the file moves every line, which would make Jed's code review and Gerrie's security review harder to trace against the file the team actually adopted.
2. The split is a one-way refactor with real value. It should be scoped, branched, and reviewed on its own, not folded into an adoption housekeeping task.

The split should still happen. This record recommends it as the next piece of work after adoption. The target layout when the split is scheduled:

- `index.html`: page structure only. It links the stylesheet and the scripts.
- `css/styles.css`: all presentation, moved from the `<style>` block.
- `js/braille-reference.js`: the behaviour, including helpers, rendering, search parsing, and filtering.
- `js/braille-data.js`: the UEB data set, the `data` array at lines 309 to 519.

Separating the data file from the behaviour file matters because braille accuracy is the whole point of the project. A correction to a braille entry then touches only the data file and never the logic. The data file becomes the single place for requirements and code review to check entry by entry.

File names use the kebab-case naming standard.

## Alternatives considered

### Split the file now, as part of the adoption work

Rejected for this work. The split is sound and should be done, but doing it inside the adoption work mixes a refactor with a review-and-configure task. It would obscure the audit trail. The team's more recent practice, set on Clock-Practice, is to review first and split as named follow-up work.

### Leave the file as one file permanently

Rejected. A 757-line single file is workable today, but the standard exists for good reasons:

- A separate stylesheet and script can be cached by the browser across visits.
- Separate files give cleaner change history.
- Separate files can be linted by standard tools without first extracting them from HTML.
- The Content-Security-Policy (see Decision Record 003) is stricter when the script and style are external files, because the policy can then forbid inline script and style entirely.

## Consequences

- For work 006, the project carries one known, recorded gap: structure, presentation, and behaviour are not in separate files.
- A follow-up piece of work should split `index.html` into four files as described above. That work is a `refactor` change and must not alter behaviour, appearance, or accessibility.
- The split is a precondition for the stricter Content-Security-Policy in Decision Record 003. Until the split happens, the page needs `'unsafe-inline'` for both script and style. Decision Record 003 records that interim state.
- The `<pre>` cell-numbering diagram in the reference `<details>` block (lines 272 to 275) is marked `aria-hidden="true"` and is followed by a prose explanation. That arrangement is correct and must be preserved if any reflow of the file happens.
