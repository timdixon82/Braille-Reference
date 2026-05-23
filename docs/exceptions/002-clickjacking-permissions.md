# Security Exception 002: X-Frame-Options and Permissions-Policy not deliverable on GitHub Pages

## Status

Recorded. Awaiting Tim Dixon's approval.

## Summary

This exception records two headers that cannot be delivered for this project on GitHub Pages, and explains why the residual risk is accepted.

This exception is a companion to [Exception 001: Absent security response headers on GitHub Pages](001-security-headers.md). Exception 001 covers all absent headers. This record gives the specific risk assessment for the two that have no viable meta-tag mitigation.

## X-Frame-Options

The `X-Frame-Options: DENY` header prevents the page being embedded in a `<iframe>` on another site. It cannot be set as an HTTP header on GitHub Pages. The Content-Security-Policy `frame-ancestors` directive would provide equivalent protection, but `frame-ancestors` is ignored when the CSP is delivered by meta tag, which is the only delivery route available here.

Risk assessment: low. This page has no login, no authenticated session, no payment flow, and no action with a side effect. A clickjacking attack requires a victim to be tricked into performing an interactive action in a framed version of the page. The only interactive controls on this page filter and search a static reference table. There is nothing an attacker can gain from tricking a user into filtering the braille table inside a frame.

Mitigation: the Content-Security-Policy meta tag, which limits script and style sources, reduces the overall attack surface even though it cannot restrict framing. Jed's code review (Finding 7) confirmed there are no external links, and Finding 4 confirmed no unsafe DOM injection exists.

## Permissions-Policy

The `Permissions-Policy` header disables browser features the page does not use, such as geolocation, the camera, and the microphone. It cannot be set as an HTTP header on GitHub Pages. Its meta-tag form is not reliably supported across browsers and is therefore not used.

Risk assessment: low. This page never requests geolocation, camera, or microphone access. A static page served from GitHub Pages cannot quietly acquire these permissions. The absent header is a defence-in-depth measure against a future developer accidentally adding such a request; it is not mitigating an active threat.

Mitigation: no JavaScript on this page calls any browser permission API. Jed's code review confirmed there are no external scripts. The Content-Security-Policy meta tag restricts script sources to `'self'`, limiting the surface through which a future change could introduce an unexpected API call.

## Acceptance rationale

Both gaps are accepted because:

1. The residual risk for this project is genuinely low, given the read-only, no-personal-data, no-login design.
2. The mitigation, moving to a host that can send custom headers, is available and recorded as the correct response if the project's scope grows to include authenticated content, personal data, or state-changing actions.
3. The team's standing standard for static GitHub Pages projects, in [AgentTeam global wiki: decisions/006-adopted-static-project-standards.md](../../../AgentTeam/docs/decisions/006-adopted-static-project-standards.md), standard 3, records this gap as the documented approach for every project on this host.

## Approval

Tim Dixon's approval is required before this exception is valid. Record the approval date here when given.

Approval: pending.
