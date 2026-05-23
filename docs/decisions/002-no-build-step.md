# Decision Record 002: No build step

## Status

Accepted. Recorded by Jacob (architect) on 2026-05-21, during work 006-braille-reference-setup.

## Context

Braille-Reference is a static front-end project. The team's static front-end stack standard says a small project needs no build step. The project has no build step today: the file is served to the browser exactly as it is written.

This record decides whether the project should adopt a build step, given its current size.

## Decision

The project keeps no build step. The files are written in standards-based HTML, modern CSS, and modern JavaScript, and are served to the browser unchanged.

The project is small. It is one HTML file today, and after the split recommended in Decision Record 001 it will be one HTML file, one CSS file, and two JavaScript files. It has no third-party libraries to bundle (see Decision Record 004). Modern browsers run modern JavaScript and modern CSS directly, so there is nothing a build step needs to transform.

The JavaScript uses no syntax that requires compiling down: `const`, arrow functions, template literals, `Set`, and `document.createElement` are all long-standing browser features. The braille glyphs are produced at run time with `String.fromCharCode(0x2800 + offset)`, which is plain JavaScript.

A build step would add a dependency, a configuration file, a step that can fail, and a gap between the source a developer reads and the code a browser runs. For a project this size, none of that is repaid. The team's general standard is to prefer the simple solution.

This decision is not permanent. The trigger to revisit it is a genuine need: for example, the JavaScript grows large enough that splitting it into modules and bundling them would measurably help load time; or a third-party library is adopted that ships only as a package needing a bundler; or the project needs a tool, such as a CSS pre-processor, that only runs at build time. If any of those arrives, a light bundler such as Vite is the expected choice.

## Alternatives considered

### Adopt a bundler now, such as Vite

Rejected as premature. A bundler earns its place when there are many modules to combine, third-party packages to resolve, or transforms to run. Braille-Reference has none of these.

### Add a minification-only step

Rejected for now. Minifying the CSS and JavaScript would save a small amount on the download. The saving is tiny for a page of this size, and the cost is a build step that makes the served code differ from the source. The simpler win, browser caching of separate files, comes for free once Decision Record 001's split is done.

## Consequences

- The repository's source is exactly what the browser runs. This makes debugging direct and review straightforward, which suits a project being adopted and audited.
- Continuous integration lints the HTML, CSS, and JavaScript and runs the accessibility checks, as the stack standard requires. Linting is not a build step; it checks the code without transforming it.
- GitHub Pages serves the repository files directly, with no build action in between.
- If the project later outgrows this decision, the named trigger and the expected choice (a light bundler such as Vite) are recorded above.
