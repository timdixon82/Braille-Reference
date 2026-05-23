# Release Process: Braille-Reference

This page records the release process for this project. It does not duplicate the global process.

The full team release process is in the [AgentTeam global wiki: release-process.md](../../AgentTeam/docs/release-process.md). That page defines branching, pull request lifecycle, merge gate, release-please configuration, signed commits, rollback, and deployment. All of it applies to this project.

## Hosting

GitHub Pages, served from the `main` branch, with "Enforce HTTPS" enabled. This is the standard static-project host. See [Decision Record 003: GitHub Pages hosting and the security-header constraint](decisions/003-github-pages-security-headers.md) for the full rationale.

## Deployment

GitHub Pages deploys directly from the `main` branch. There is no build step (see [Decision Record 002: No build step](decisions/002-no-build-step.md)). What is on the `main` branch is what the browser receives.

## Versioning

This project uses semantic versioning. The version string lives in a `VERSION` file at the repository root, as required by the [AgentTeam global wiki: coding-standards.md](../../AgentTeam/docs/coding-standards.md), Repository Standards section. The version is also shown in the page.

Adding the `VERSION` file and the in-page version display is outstanding setup work for Sean. It is tracked in [todo.md](../todo.md).

## Release-please

Releases are automated with release-please. The workflow reads Conventional Commits, opens a release pull request that updates `VERSION` and the changelog, and tags the release when the pull request merges. See the global release-process page for the full procedure.

## Merge gate

Before Sonja merges to `main`, all of these must hold:

- Required workflow checks pass: continuous integration, accessibility at WCAG 2.2 AAA, and security.
- Carol has signed off functional, accessibility, and visual testing.
- The architecture-and-security conformance check has passed.
- For a release, Carol's release checklist is complete, including Tim's own screen-reader test.

Sonja merges only with Tim's express approval, given at the time. A merge is never pre-approved.

## Security-header check before release

Before any release, confirm that the Content Security Policy (CSP) and Referrer-Policy meta tags are in place in `index.html` and that they do not break any functionality. Carol tests the page under the active CSP in a real browser. See [Decision Record 003](decisions/003-github-pages-security-headers.md) and [Exception 001](exceptions/001-security-headers.md).
