# Architecture Review: Braille-Reference

This is the backfilled architecture review for the adopted project `timdixon82/Braille-Reference`, carried out under work 006-braille-reference-setup. It assesses the project against the team's static front-end standard and records four Architecture Decision Records: file structure, build step, GitHub Pages hosting and security headers, and dependency posture.

This review is read-only. It changes nothing in the project repository. The decision records below are written for the project wiki that Sonja will scaffold; they are reproduced here in the work folder for Sonja to consolidate.

## Scope of the review

The repository holds two files: `index.html` and a short `README.md`. There is no favicon, no separate stylesheet or script, no asset folder, and no package manifest.

`index.html` is 757 lines. It holds all three concerns in one file:

- Structure: the HyperText Markup Language (HTML) for the header, the filter and search controls, the cell-numbering reference, and the results table, at lines 215 to 299.
- Presentation: a `<style>` block of Cascading Style Sheets (CSS), lines 7 to 213.
- Behaviour: a `<script>` block of JavaScript, lines 301 to 755. This block contains both the Unified English Braille (UEB) data set (the `data` array, lines 309 to 519) and the logic that renders the table, parses the dot-pattern search, and applies the filters (lines 521 to 754).

The page is a single-screen interactive reference. It has no login, no form that posts data anywhere, no cookies, no personal data, and no state-changing action.

## Summary of findings

The project is in good architectural health for an adopted page. It is small, self-contained, and uses semantic HTML throughout (`<table>` with `<caption>`, `<thead>`, `scope` attributes; `<fieldset>` and `<legend>` for the control groups; a `role="status"` live region; a skip link). It carries no third-party dependencies at all.

It diverges from the static front-end standard on one point only: structure, presentation, and behaviour are not in separate files. That is the same gap the team met on Periodic-Table and Clock-Practice, and the team already has a recorded pattern for it. It also has no Content-Security-Policy, which the team's standard requires.

Four decision records follow. They are numbered to match the project wiki's `decisions/` folder.

## Decision Record 001: Keep the single-file structure for the adoption work

### Status

Proposed. Recorded by Jacob (architect) on 2026-05-21, during work 006-braille-reference-setup. Awaiting Tim's decision on the question raised at the end of this record.

### Context

Braille-Reference is an existing repository being adopted as a team project. The whole page is one `index.html` of 757 lines. That single file holds three things at once: the HTML structure, a `<style>` block of CSS (lines 7 to 213), and a `<script>` block of JavaScript (lines 301 to 755).

The team's static front-end stack standard, in the global wiki at `stacks/static-front-end.md`, says under "Project structure": "Keep structure (HTML), presentation (CSS), and behaviour (JavaScript) separate." Read plainly, that asks for separate files: `index.html`, a stylesheet, and a script.

The current single-file layout does not meet that standard. This record decides what to do about the gap during the adoption work.

There is one extra factor specific to this project. The JavaScript block is not one kind of content. Lines 309 to 519 are the UEB data set: a list of around 130 braille entries, each with a print form, dot pattern, category, and usage notes. Lines 521 to 754 are the behaviour: the helpers that convert dot numbers to braille glyphs, build the table rows, parse the dot-pattern search, and apply the filters. These are a data set and the logic that consumes it, mixed in one block. This is the same shape Periodic-Table had, where the element data and the grid logic were separated into their own files.

### Decision

Keep the single-file structure for the project-adoption work (work 006), and do not split the file as part of that work.

Two reasons, the same as for Clock-Practice:

1. The adoption work is a backfill of reviews and repository configuration. It is not a feature change. Splitting the file is a refactor that moves every line, which would make Gerrie's security review and Jed's code review harder to trace against the file the team actually adopted. The team should review the project as it stands first.
2. The split is a one-way refactor with real value, but it is a separate, deliberate piece of work. It should be scoped, branched, and reviewed on its own, not folded into an adoption housekeeping task.

The split should still happen. This record recommends it as the next piece of work after adoption. The recommended target layout, when the split is scheduled, is four files:

- `index.html`: the page structure only. It links the stylesheet and the script.
- `css/styles.css`: all presentation, moved out of the `<style>` block.
- `js/braille-reference.js`: the behaviour — the helpers, the rendering, the search parsing, and the filtering.
- `js/braille-data.js`: the UEB data set, the `data` array currently at lines 309 to 519.

The data is separated from the behaviour for the same reason it was on Periodic-Table: it is a different kind of content. A correction to a braille entry, for example a wrong dot pattern, then touches only the data file and never the logic, and the logic can be read without scrolling past around 210 lines of data. This separation also matters here because braille accuracy is the whole point of the project: a clearly isolated data file is the single place for Tad's requirements and Jed's review to check entry by entry.

File names follow the team's kebab-case naming standard. The flat `css/` and `js/` folders suit a project this small; a deeper structure can wait until the code needs it.

Decision Record 002 (no build step) and Decision Record 003 (hosting and headers) both assume this split will follow.

### Alternatives considered

#### Split the file now, as part of the adoption work

Rejected for this work. The split is sound and should be done, but doing it inside the adoption work mixes a refactor with a review-and-configure task. It would obscure the audit trail: the security and code reviews could no longer be read against the file the team adopted. Periodic-Table took the other path and split during adoption; the team's more recent practice, set on Clock-Practice, is to review first and split as named follow-up work. This review follows the Clock-Practice pattern for consistency.

#### Leave the file as one file permanently

Rejected. A 757-line single file is workable today, but the standard exists for good reasons that apply here:

- A separate stylesheet and script can be cached by the browser across visits.
- Separate files give cleaner change history: a CSS-only change does not appear in the same diff as a data correction or a behaviour change.
- A separate `.css` file and `.js` file can be linted by the standard tools without the lint step first extracting them from HTML. The stack standard requires lint checks in continuous integration.
- The Content-Security-Policy this project will adopt (Decision Record 003) is stricter and simpler when the script and style are external files, because the policy can then forbid inline script and inline style entirely.

Carrying a known standards exception forever is worse than doing the refactor once.

#### Split into many small feature files

Rejected as too much for a page this size. The stack standard says "source organised by feature", but Braille-Reference is one screen with one feature: look up braille. Four files (one HTML, one CSS, one behaviour script, one data file) match the page. Splitting the behaviour further into a render module, a search-parse module, and a filter module is possible, but it is more structure than a roughly 230-line behaviour block needs today. The team's principle "prefer the simple solution" applies. Revisit if the script grows.

### Consequences

- For work 006, the project carries one known, recorded gap against the stack standard: structure, presentation, and behaviour are not in separate files. This record is the documentation of that gap. Gerrie and Jed should review the single file as it stands and not treat the layout itself as a defect to fix inside this work.
- A follow-up piece of work should split `index.html` into `index.html`, `css/styles.css`, `js/braille-reference.js`, and `js/braille-data.js`. That work is a `refactor` change and must not alter behaviour, appearance, or accessibility.
- The split is a precondition for the stricter Content-Security-Policy in Decision Record 003. Until the split happens, the page needs `'unsafe-inline'` for both script and style, which weakens the policy. Decision Record 003 records that interim state.
- The `<pre>` cell-numbering diagram in the reference `<details>` block (lines 272 to 275) is marked `aria-hidden="true"` and is followed by a text explanation. That arrangement is correct and must be preserved if any reflow of the file happens; it is noted here so the split work does not disturb it.

### Question for Tim

This question is the same one raised for Clock-Practice and is batched with it. The split into separate files is recommended follow-up work, but it is not free, and it is the kind of change that can introduce a subtle regression in a page that currently works. Should the team schedule the file split as the next piece of work after the Braille-Reference adoption, or leave the page as a single file for now? The architecture recommendation is to schedule the split, because it unlocks a stronger Content-Security-Policy and cleaner linting. Because Periodic-Table, Clock-Practice, and Braille-Reference all face the identical question, a single decision from Tim can cover all three adopted static projects.

## Decision Record 002: No build step

### Status

Accepted. Recorded by Jacob (architect) on 2026-05-21, during work 006-braille-reference-setup. Reviewed by Sonja.

### Context

Braille-Reference is a static front-end project. The team's static front-end stack standard says a small project needs no build step, and a larger one may use a light bundler such as Vite. The project has no build step today: the file is served to the browser exactly as it is written.

This record decides whether the project should adopt a build step, given its size.

### Decision

The project keeps no build step. The files are written in standards-based HTML, modern CSS, and modern JavaScript, and are served to the browser unchanged.

The project is small. It is one HTML file today, and after the split recommended in Decision Record 001 it would be one HTML file, one CSS file, and two JavaScript files. It has no third-party libraries to bundle (see Decision Record 004). Modern browsers run modern JavaScript and modern CSS directly, so there is nothing a build step would need to transform.

The JavaScript uses no syntax that needs compiling down: `const`, arrow functions, template literals, `Set`, and `document.createElement` are all long-standing browser features. The braille glyphs are produced at run time with `String.fromCharCode(0x2800 + offset)`, which is plain JavaScript and needs no tooling.

A build step would add a dependency, a configuration file, a step that can fail, and a gap between the source a developer reads and the code a browser runs. For a project this size none of that is repaid. The team's general standard is to prefer the simple solution and to add complexity only when a real need arrives.

This decision is not permanent. The trigger to revisit it is a genuine need, for example: the JavaScript grows large enough that splitting it into modules and bundling them would measurably help load time; or a third-party library is adopted that ships only as a package needing a bundler; or the project needs a tool, such as a CSS pre-processor, that only runs at build time. If any of those arrives, a light bundler such as Vite is the expected choice, and a new decision record will record it.

### Alternatives considered

#### Adopt a bundler now, such as Vite

Rejected as premature. A bundler earns its place when there are many modules to combine, third-party packages to resolve, or transforms to run. Braille-Reference has none of these. Adopting one now would add setup and a failure point with no return.

#### Add a minification-only step

Rejected for now. Minifying the CSS and JavaScript would shave a small amount off the download. The saving is tiny for a page of this size, and the cost is a build step that makes the served code differ from the source. The simpler win, browser caching of separate files, comes for free once Decision Record 001's split is done. Minification can be reconsidered if the asset size grows.

### Consequences

- The repository's source is exactly what the browser runs. This makes debugging direct and review straightforward, which suits a project being adopted and audited.
- Continuous integration still lints the HTML, CSS, and JavaScript and runs the accessibility checks, as the stack standard requires. Linting and testing are not a build step; they check the code without transforming it. Sean sets up the lint and accessibility workflows.
- GitHub Pages serves the repository files directly, with no build action in between. This is covered in Decision Record 003.
- If the project later outgrows this decision, the named trigger and the expected choice (a light bundler such as Vite) are recorded above, so the next decision starts from a clear position.

## Decision Record 003: GitHub Pages hosting and the security-header constraint

### Status

Accepted. Recorded by Jacob (architect) on 2026-05-21, during work 006-braille-reference-setup. One part, the Content-Security-Policy value, is proposed and depends on the file split in Decision Record 001.

### Context

Braille-Reference is hosted on GitHub Pages, served from the public `timdixon82/Braille-Reference` repository. GitHub Pages is the team's standard host for static projects, set in the global wiki's foundations decision, and a GitHub Pages site is served from a public repository.

The team's coding standard, in the global wiki's `coding-standards.md`, requires a set of security response headers on every site: Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, and Permissions-Policy. The stack standard says to set these headers through the hosting configuration.

GitHub Pages has a hard limit here: it does not let the site owner set custom HyperText Transfer Protocol (HTTP) response headers. A site owner cannot add Content-Security-Policy, X-Frame-Options, Referrer-Policy, X-Content-Type-Options, or Permissions-Policy as real response headers. GitHub Pages does send Strict-Transport-Security itself once "Enforce HTTPS" is enabled, and it sends `X-Content-Type-Options: nosniff` by default. The rest cannot be set as headers.

A review of the current `index.html` confirms the page carries no Content-Security-Policy and no Referrer-Policy meta tag today. This record decides how the project meets the security-header standard within the GitHub Pages limit.

### Decision

#### Hosting

Confirm GitHub Pages as the host, served from the `main` branch, with "Enforce HTTPS" enabled. This is the standard static-project host and needs no change. Sonja should confirm in the work log that "Enforce HTTPS" is enabled for this repository; if it is not yet on, enabling it is required, because it is what makes GitHub Pages send the Strict-Transport-Security header.

The team accepts the GitHub Pages header limit rather than moving to a host that allows custom headers. The cost of moving (a new platform and a maintained deployment path) is not justified for a static page with no personal data, no login, and no server-side logic. The headers are delivered as far as the platform allows, and the gap is recorded honestly as a security exception.

#### Security headers, given the GitHub Pages constraint

Each required header is handled as follows.

##### Content-Security-Policy: meta tag

The Content-Security-Policy is delivered through an HTML `<meta http-equiv="Content-Security-Policy">` tag in the `<head>` of `index.html`. The page does not have one today; adding it is a small content change for Sean to make on the project-setup branch. The meta tag must be placed first in the `<head>`, immediately after `<meta charset>`, so the policy is in force before any other element loads.

A meta-tag policy is honoured by browsers and is the only delivery route available on GitHub Pages. Its known limits compared with a real header are that it cannot use the `frame-ancestors` directive, cannot use the `report-uri` or `report-to` reporting directives, and takes effect slightly later than a header. None of these matter much for this project: clickjacking is addressed below, and the project does not collect violation reports.

The Content-Security-Policy value should be as strict as the page allows.

- Target policy, after the file split in Decision Record 001:
  `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`
  This policy is tight on `'self'` throughout, with no third-party origin, because Decision Record 004 confirms the project has zero third-party resources.
- Interim policy, while the page is still a single file (current state):
  the same policy but with `script-src 'self' 'unsafe-inline'` and `style-src 'self' 'unsafe-inline'`, because a single-file page has its script and style inline. `'unsafe-inline'` weakens the policy: it is one reason Decision Record 001 recommends splitting the file. The interim policy is acceptable only until the split.

Gerrie confirms the exact policy value during the security review, and Carol tests that the page still works under it in a real browser. A policy that is too strict will silently break the page, so it must be tested before release.

##### Strict-Transport-Security

This header cannot be set by the project. GitHub Pages sends its own Strict-Transport-Security header for the default `github.io` domain once "Enforce HTTPS" is enabled. No project action is needed beyond keeping that setting on. Turning it off is not allowed; it would drop the one security header GitHub Pages does send and would break the HTTPS-everywhere standard.

##### X-Content-Type-Options

This header cannot be set by the project, and has no meta-tag equivalent. GitHub Pages sends `X-Content-Type-Options: nosniff` on its responses by default, so the protection is in place through the platform.

##### Referrer-Policy

Delivered through a `<meta name="referrer">` tag in the `<head>`, set to `strict-origin-when-cross-origin`. The page does not have one today; adding it is a small content change for Sean. The meta `referrer` tag is well supported by browsers and is the standard way to set a referrer policy from a page.

##### X-Frame-Options and clickjacking

This header cannot be set by the project, and has no meta-tag equivalent. The Content-Security-Policy `frame-ancestors` directive, which would replace it, is ignored when the policy is delivered by meta tag. This leaves a genuine residual gap: the page cannot fully forbid being framed by another site using only files it controls.

The risk this leaves is low. The page has no login, no form that submits data, and no action with a side effect. The filter and search controls only show and hide rows of a reference table on the visitor's own screen; there is nothing for a clickjacking attack to capture. The gap is recorded as a security exception for Gerrie to assess and for the project's `exceptions/` folder, rather than hidden.

##### Permissions-Policy

This header cannot be set by the project, and its meta-tag form is not reliably supported across browsers. The risk it addresses is low for this project, because the page never uses geolocation, the camera, or the microphone, and a static page cannot quietly start using them. The absence of this header is recorded as a low-risk security exception alongside the X-Frame-Options gap.

### Alternatives considered

#### Move to a host that allows custom headers, such as Netlify or Cloudflare Pages

Considered and rejected for now. A host with a headers configuration file could set every required header as a real header, which is stronger. But moving means leaving the team's standard static host, taking on a new platform, and maintaining a deployment path. For a static page with no personal data, no login, and no forms, the headers GitHub Pages cannot deliver are the lower-risk ones, and the gap is small. The move is not justified today. It remains the right answer if the project later gains a feature that handles personal data or a state-changing action.

#### Put GitHub Pages behind a proxy or content delivery network that adds headers

Considered and rejected. A proxy such as Cloudflare in front of the Pages site could add the missing headers. It also adds a second platform to configure and maintain, and a custom domain to manage. That overhead is not repaid for a project of this size and risk. The principle "prefer the simple solution" applies.

#### Skip the Content-Security-Policy because it cannot be a real header

Rejected. A meta-tag Content-Security-Policy is weaker than a header policy, but it is not worthless: browsers honour it, and it still restricts where scripts, styles, and other resources may load from, which is the main thing a Content-Security-Policy does. Shipping the meta-tag policy is clearly better than shipping nothing, and the project ships nothing today.

### Consequences

- `index.html` must gain a `<meta http-equiv="Content-Security-Policy">` tag, placed first in the `<head>` after `<meta charset>`, and a `<meta name="referrer">` tag. Neither exists today. Adding them is a small content change for Sean on the project-setup branch; it is content, not a GitHub action, so it needs no separate approval.
- The strict target Content-Security-Policy depends on the file split in Decision Record 001. Until the split, the page uses the interim policy with `'unsafe-inline'` for script and style. This is a second reason to schedule the split.
- Strict-Transport-Security and X-Content-Type-Options are supplied by GitHub Pages and need no project action. "Enforce HTTPS" must be confirmed on and must stay on.
- Two security exceptions are recorded in the project wiki's `exceptions/` folder: the X-Frame-Options and `frame-ancestors` gap, and the missing Permissions-Policy. Both are low risk for a static reference page with no interactive actions and no personal data. Gerrie assesses and records them; Tim approves them.
- The Content-Security-Policy must be tested in a real browser before release. Carol and Gerrie verify it.

## Decision Record 004: Zero third-party runtime dependencies

### Status

Accepted. Recorded by Jacob (architect) on 2026-05-21, during work 006-braille-reference-setup. Reviewed by Sonja.

### Context

The team's standards keep dependencies few. The stack standard, in the global wiki's `stacks/static-front-end.md`, says: "Keep dependencies few. Every dependency is something to keep updated and secure", and "Load a third-party script only when genuinely needed, and pin it with Subresource Integrity." The global foundations decision chose Dependabot as the dependency tool, partly because static projects often have nothing for it to update.

This record reviews what Braille-Reference actually depends on, so the dependency posture is recorded and can be checked against later.

### Decision

Braille-Reference has zero third-party runtime dependencies, and it should stay that way unless a real need arrives.

A review of `index.html` confirms the posture:

- No script is loaded from another origin. The page has no `<script src>` pointing at a content delivery network or any other site. All JavaScript is the project's own, written inline in `index.html` today.
- No stylesheet is loaded from another origin. There is no `<link rel="stylesheet">` to a font service or a CSS framework. All CSS is the project's own, in the inline `<style>` block.
- No web font is loaded from another origin. The page uses system-font stacks only: a serif stack (`Georgia`, `"Times New Roman"`, `serif`) for body text, and a monospace stack (`"Courier New"`, `"Lucida Console"`, `monospace`) for the braille glyphs and the cell diagram. The fonts are whatever the visitor's device already has. Nothing is fetched. This differs from Periodic-Table, which loaded three families from Google Fonts; Braille-Reference is closer to Clock-Practice, which is also fully self-contained.
- No package is installed from a package registry. There is no `package.json` and no lockfile. This is consistent with the no-build-step decision (Decision Record 002).
- There is no favicon and no image file. The repository is exactly `index.html` and `README.md`.
- The braille glyphs are not images and not a font dependency. They are Unicode braille-pattern characters in the range starting at U+2800, produced at run time by the project's own `dotsToChar` function with `String.fromCharCode(0x2800 + offset)`. Unicode braille patterns are part of the Unicode standard and are rendered by the visitor's own system; they are text, not a fetched resource.

Because every script, style, and character is the project's own and served from its own origin, the Content-Security-Policy in Decision Record 003 can use `'self'` for `script-src`, `style-src`, `img-src`, and `font-src` with no third-party origin added.

There is one accessibility-related point worth noting, though it is not a dependency and not an architecture matter. The page relies on the visitor's system to render Unicode braille-pattern characters in the visible glyph cell. The code already handles this well: every braille glyph carries an `aria-hidden="true"` visual span paired with a screen-reader-only span that spells the dots out in words (the `cellsToDotsText` text), and the dot pattern is also shown as plain text in its own table column. So the meaning never depends on the braille font rendering. Whether the visible glyph displays as expected on every device is a presentation matter for Simon and Carol, not an architecture decision.

### Alternatives considered

#### Add a library for the table rendering or the search

Rejected. The table is built with a short loop that creates `<tr>` and `<td>` elements, and the dot-pattern search is parsed by the project's own `parseDotInput` and `cellsContain` functions. Both already work with the project's own code. A library would add a dependency to keep patched, and on a static site it would also have to be either loaded from another origin (which the Content-Security-Policy would then have to allow, weakening it) or copied into the repository (which then has to be kept updated by hand). Neither earns its place for a page this size.

#### Load a dedicated braille font from a font service

Rejected, and not needed. The braille glyphs are Unicode characters that the visitor's system already renders, and the meaning is carried by text in any case (see the Decision above). Fetching a braille font from a third-party service would add a runtime dependency on a third-party origin, a request that shares the visitor's internet address with that service, and a resource the Content-Security-Policy would have to allow. If a more consistent visible glyph is ever wanted, the right path is to self-host a suitably licensed font in the repository, not to load one from a service, so the Content-Security-Policy can stay on `'self'`. That is a design question for Simon, not an architecture decision to take now.

### Consequences

- Dependabot has nothing to scan for Braille-Reference, which is the expected state for a static project with no package manifest. The global foundations decision already anticipated this.
- The Subresource Integrity rule in the stack standard does not apply today, because there is no third-party script or stylesheet to pin. If a third-party resource is ever added, it must be pinned with Subresource Integrity, its origin added to the Content-Security-Policy, and this record revisited.
- The zero-dependency posture is what lets Decision Record 003 keep the Content-Security-Policy tight on `'self'`. Adding any third-party resource later would force a change to both this record and the Content-Security-Policy.
- If the project ever adds a third-party script or stylesheet, it follows the standard dependency rules: add it only when the need is genuine; prefer a self-hosted copy committed to the repository over a third-party content delivery network; pin any third-party-origin resource with Subresource Integrity at a fixed version; and record every third-party dependency in this record so the project keeps an inventory.

## Cross-cutting note for Sonja

This is the third adopted static project (after Periodic-Table and Clock-Practice) to meet the identical single-file-versus-split question and the identical GitHub Pages security-header limit. The pattern is now well established and repeated verbatim across three projects. I flag two items for Sonja to consider promoting to the global wiki, at her discretion:

1. A pattern page for adopting a single-file static page: review as it stands, schedule the split as named follow-up work, and split into HTML, CSS, behaviour, and (where there is a data set) a data file.
2. A pattern page for the GitHub Pages security-header limit: which headers the platform supplies, which are delivered by meta tag, and which become recorded low-risk exceptions.

Promoting these would let a future static adoption reuse the reasoning instead of re-deriving it. The decision is Sonja's.
