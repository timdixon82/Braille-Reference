# Security Exception 001: Absent security response headers on GitHub Pages

## Status

Recorded. Awaiting Tim Dixon's approval.

## Summary

GitHub Pages standard deployment does not allow custom HTTP response headers. Several headers required by the team's coding standard cannot be delivered as HTTP headers. This exception records that gap and the mitigations in place.

## Headers affected

The following headers cannot be delivered as HTTP response headers on standard GitHub Pages deployment:

- `X-Frame-Options: DENY`: prevents the page being embedded in a frame on another site. Cannot be set by the project as a header, and has no meta-tag equivalent. The CSP `frame-ancestors` directive would replace it, but `frame-ancestors` is ignored when the CSP is delivered by meta tag.
- `Permissions-Policy`: disables browser features the page does not use. Cannot be set by the project as a header, and its meta-tag form is not reliably supported across browsers.
- `Referrer-Policy`: limits referrer data sent to other origins. Delivered as a `<meta name="referrer">` tag instead of a header. The meta tag is well supported and is the standard mitigation for GitHub Pages.
- `Content-Security-Policy`: restricts where scripts, styles, and other resources may load from. Delivered as a `<meta http-equiv="Content-Security-Policy">` tag instead of a header. The meta tag is honoured by browsers. It cannot use `frame-ancestors`, `report-uri`, or `report-to`.

The following headers are supplied by GitHub Pages and need no project action:

- `Strict-Transport-Security`: sent by GitHub Pages for `github.io` domains once "Enforce HTTPS" is enabled.
- `X-Content-Type-Options: nosniff`: sent by GitHub Pages by default.

## Rationale for accepting this gap

The site has no personal data, no authenticated content, no login, no form that submits data to a server, and no action with a side effect. The attack surface is narrow. The residual risk from the missing headers is low.

The specific risks are:

- X-Frame-Options absent: the page can be embedded in a frame on a third-party site. A clickjacking attack requires an interactive action the victim can be tricked into performing. This page's controls only show and hide rows of a reference table on the visitor's own screen. There is nothing for a clickjacking attack to capture.
- Permissions-Policy absent: the page never uses geolocation, the camera, or the microphone. A static page cannot quietly start using them. The practical risk of the absent header is low.

Moving the project to a host that allows custom headers, such as Cloudflare Pages or Netlify, is the right answer if the project later gains a feature that handles personal data or a state-changing action. That move is a deliberate decision, recorded at that time.

## Mitigations in place

- All DOM writes use the `.textContent` property. `innerHTML` and adjacent methods are never used. This eliminates DOM-based cross-site scripting (XSS).
- No external resources are loaded. The Content-Security-Policy meta tag can use `'self'` for all resource types.
- No user data is processed or stored.
- HTTPS is enforced by the platform.
- A Content-Security-Policy meta tag is added to `index.html` as part of the setup build (see [Decision Record 003](../decisions/003-github-pages-security-headers.md)).
- A Referrer-Policy meta tag is added to `index.html` as part of the setup build.

## OWASP mapping

OWASP Top 10 category A05: Security Misconfiguration.

## Approval

Tim Dixon's approval is required before this exception is valid. Record the approval date here when given.

Approval: pending.
