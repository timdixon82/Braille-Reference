# Decision Record 004: Zero third-party runtime dependencies

## Status

Accepted. Recorded by Jacob (architect) on 2026-05-21, during work 006-braille-reference-setup.

## Context

The team's standards keep dependencies few. The static front-end stack standard says: "Keep dependencies few. Every dependency is something to keep updated and secure", and "Load a third-party script only when genuinely needed, and pin it with Subresource Integrity (SRI)."

This record reviews what Braille-Reference actually depends on, so the dependency posture is recorded and can be checked against later.

## Decision

Braille-Reference has zero third-party runtime dependencies, and it should stay that way unless a real need arrives.

A review of `index.html` confirms the posture:

- No script is loaded from another origin. The page has no `<script src>` pointing at a content delivery network (CDN) or any other site. All JavaScript is the project's own, written inline in `index.html` today.
- No stylesheet is loaded from another origin. There is no `<link rel="stylesheet">` to a font service or a CSS framework. All CSS is the project's own, in the inline `<style>` block.
- No web font is loaded from another origin. The page uses system-font stacks only: a serif stack (Georgia, Times New Roman, serif) for body text, and a monospace stack (Courier New, Lucida Console, monospace) for the braille glyphs and the cell diagram.
- No package is installed from a package registry. There is no `package.json` and no lockfile (note: a development-only `package.json` for linters is outstanding setup work, but it carries no runtime dependency).
- There is no favicon and no image file. The repository is exactly `index.html` and `README.md`.
- The braille glyphs are not images and not a font dependency. They are Unicode braille-pattern characters in the range starting at U+2800, produced at run time by the project's own `dotsToChar` function with `String.fromCharCode(0x2800 + offset)`. Unicode braille patterns are part of the Unicode standard and are rendered by the visitor's own system; they are text, not a fetched resource.

Because every script, style, and character is the project's own and served from its own origin, the Content-Security-Policy in Decision Record 003 can use `'self'` for `script-src`, `style-src`, `img-src`, and `font-src` with no third-party origin added.

## Alternatives considered

### Add a library for the table rendering or the search

Rejected. The table is built with a short loop using `document.createElement`, and the dot-pattern search is parsed by the project's own `parseDotInput` and `cellsContain` functions. Both work without a library. A library would add a dependency to keep patched, and on a static site it would have to be either loaded from another origin (which the CSP would then have to allow, weakening it) or copied into the repository (which then has to be updated by hand).

### Load a dedicated braille font from a font service

Rejected. The braille glyphs are Unicode characters that the visitor's system already renders, and the meaning is carried by text in any case (the screen-reader-only span describes the dot pattern in words). Fetching a font from a third-party service would add a runtime dependency on a third-party origin and a resource the CSP would have to allow. If a more consistent visible glyph is ever wanted, the right path is to self-host a suitably licensed font in the repository.

## Consequences

- Dependabot has nothing to scan for runtime dependencies on Braille-Reference. This is the expected state for a static project with no package manifest for runtime code.
- The Subresource Integrity rule in the stack standard does not apply today, because there is no third-party script or stylesheet to pin. If a third-party resource is ever added, it must be pinned with SRI, its origin added to the CSP, and this record revisited.
- The zero-dependency posture is what lets Decision Record 003 keep the CSP tight on `'self'`. Adding any third-party resource later forces a change to both this record and the CSP.
- If the project ever adds a third-party script or stylesheet, it follows the standard dependency rules: add it only when the need is genuine; prefer a self-hosted copy committed to the repository over a CDN; pin any third-party-origin resource with SRI at a fixed version; and record every third-party dependency in this record.
