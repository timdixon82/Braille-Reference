# Project Wiki: Braille-Reference

This index lists every page in the Braille-Reference project wiki, organised by category. The global wiki at `AgentTeam/docs/` holds team-wide standards. This wiki holds what is specific to this project.

## Standards and coding

- [Coding standards](coding-standards.md): project-specific notes. Global standards are in the [AgentTeam global wiki: coding-standards.md](../../AgentTeam/docs/coding-standards.md).
- [Accessibility](accessibility.md): project-specific accessibility gaps and exceptions. Global criteria are in the [AgentTeam global wiki: accessibility.md](../../AgentTeam/docs/accessibility.md).
- [Release process](release-process.md): branching, pull requests, merge gate, and releases for this project.

## Stack

- Stack: static front-end of HTML, CSS, and JavaScript, hosted on GitHub Pages.
- Global stack standard: [AgentTeam global wiki: stacks/static-front-end.md](../../AgentTeam/docs/stacks/static-front-end.md).

## Reference

- [Glossary](glossary.md): domain terms used in this project.

## Decisions

Architecture Decision Records, numbered in the order Jacob proposed them during work 006-braille-reference-setup.

- [001: Keep the single-file structure for the adoption work](decisions/001-single-file-structure.md)
- [002: No build step](decisions/002-no-build-step.md)
- [003: GitHub Pages hosting and the security-header constraint](decisions/003-github-pages-security-headers.md)
- [004: Zero third-party runtime dependencies](decisions/004-zero-dependencies.md)

## Exceptions

Recorded accessibility and security exceptions, each approved by Tim Dixon.

- [001: Absent security response headers on GitHub Pages](exceptions/001-security-headers.md)
- [002: X-Frame-Options and Permissions-Policy not deliverable](exceptions/002-clickjacking-permissions.md)

## Operations

- [Log](log.md): chronological, append-only operations log.
