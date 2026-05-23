# Decision Record 003: GitHub Pages hosting and the security-header constraint

## Status

Accepted. Recorded by Jacob (architect) on 2026-05-21, during work 006-braille-reference-setup. The Content-Security-Policy value is interim until the file split in Decision Record 001 is complete.

## Context

Braille-Reference is hosted on GitHub Pages, served from the public `timdixon82/Braille-Reference` repository. GitHub Pages is the team's standard host for static projects.

The team's coding standard requires a set of security response headers on every site: Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Content-Type-Options, Referrer-Policy, X-Frame-Options, and Permissions-Policy.

GitHub Pages has a hard limit: it does not let the site owner set custom HTTP response headers. GitHub Pages does send Strict-Transport-Security when "Enforce HTTPS" is enabled, and it sends `X-Content-Type-Options: nosniff` by default. The rest cannot be set as headers.

The current `index.html` carries no CSP and no Referrer-Policy meta tag.

This record decides how the project meets the security-header standard within the GitHub Pages constraint. The standing team standard for this situation is recorded in [AgentTeam global wiki: decisions/006-adopted-static-project-standards.md](../../../AgentTeam/docs/decisions/006-adopted-static-project-standards.md), standard 3.

## Decision

### Hosting

Confirm GitHub Pages as the host, served from the `main` branch, with "Enforce HTTPS" enabled. Sonja should confirm in the work log that "Enforce HTTPS" is on for this repository; if it is not yet on, enabling it is required.

The team accepts the GitHub Pages header limit rather than moving to a host that allows custom headers. The cost of moving is not justified for a static page with no personal data, no login, and no server-side logic. The gap is recorded honestly as a security exception.

### Security headers

Each required header is handled as follows.

#### Content-Security-Policy: delivered by meta tag

The Content-Security-Policy is delivered through a `<meta http-equiv="Content-Security-Policy">` tag in the `<head>` of `index.html`. The page does not have one today; adding it is a content change for Sean in the setup build. The meta tag must be placed first in the `<head>`, immediately after `<meta charset>`.

A meta-tag policy is honoured by browsers. Its limits compared with a real header are that it cannot use `frame-ancestors`, `report-uri`, or `report-to`. None of these matter for this project.

Target policy, after the file split in Decision Record 001:

`default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`

Interim policy, while the page is still a single file:

`default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`

The `'unsafe-inline'` tokens are required while the script and style are inline. They weaken the policy; this is one reason to schedule the file split.

Carol tests the page under the active CSP in a real browser before release.

#### Strict-Transport-Security

This header cannot be set by the project. GitHub Pages sends its own Strict-Transport-Security header for `github.io` domains once "Enforce HTTPS" is enabled. No project action is needed beyond keeping that setting on.

#### X-Content-Type-Options

This header cannot be set by the project. GitHub Pages sends `X-Content-Type-Options: nosniff` on its responses by default.

#### Referrer-Policy: delivered by meta tag

Delivered through a `<meta name="referrer">` tag in the `<head>`, set to `strict-origin-when-cross-origin`. The page does not have one today; adding it is a content change for Sean.

#### X-Frame-Options and Permissions-Policy

These headers cannot be set by the project on GitHub Pages. The residual risks are low for a static reference page with no login, no form that submits data, and no action with a side effect. Both gaps are recorded as security exceptions in [exceptions/001-security-headers.md](../exceptions/001-security-headers.md) and [exceptions/002-clickjacking-permissions.md](../exceptions/002-clickjacking-permissions.md).

## Alternatives considered

### Move to a host that allows custom headers, such as Netlify or Cloudflare Pages

Considered and rejected for now. Moving means leaving the team's standard static host and taking on a new platform. For a static page with no personal data, no login, and no forms, the headers GitHub Pages cannot deliver are the lower-risk ones, and the gap is small. The move is the right answer if the project later gains a feature that handles personal data or a state-changing action.

### Put GitHub Pages behind a proxy or content delivery network

Considered and rejected. A proxy could add the missing headers, but it also adds a second platform to configure and maintain. The overhead is not repaid for a project of this size and risk.

### Skip the CSP because it cannot be a real header

Rejected. A meta-tag CSP is weaker than a header policy, but it is not worthless. Browsers honour it, and it still restricts where scripts, styles, and other resources may load from.

## Consequences

- `index.html` must gain a `<meta http-equiv="Content-Security-Policy">` tag (first in `<head>` after `<meta charset>`) and a `<meta name="referrer">` tag. Adding them is a content change for Sean in the setup build.
- The strict target CSP depends on the file split in Decision Record 001. Until the split, the page uses the interim policy with `'unsafe-inline'`. This is a second reason to schedule the split.
- Strict-Transport-Security and X-Content-Type-Options are supplied by GitHub Pages. "Enforce HTTPS" must be confirmed on and must stay on.
- Two security exceptions are recorded: the X-Frame-Options and `frame-ancestors` gap (low risk), and the missing Permissions-Policy (low risk).
- Carol tests the CSP in a real browser before each release.
