# Exception: GitHub Pages security-header gap

## Status

Covered by the team's standing exception. Approved by Tim Dixon on 2026-05-23 in the global wiki. No project-specific sign-off is required.

## Statement

This project relies on the team's standing exception for the GitHub Pages security-header gap. The exception, the headers affected (`X-Frame-Options` and `Permissions-Policy`), the residual-risk acceptance, and the compensating controls are recorded once in the global wiki at [Standing exception: GitHub Pages security-header gap](../../../AgentTeam/docs/exceptions/github-pages-security-headers.md).

Braille-Reference meets every condition the standing exception names: a static front-end of HTML, CSS, and JavaScript; no personal data; no login, no authenticated session, no cookie; no form that submits data to a server, and no action with a side effect; and no external scripts or styles from third-party origins.

This pointer file exists so the project's exception ledger remains complete on its own. A reader auditing this project's security posture will find this entry, follow the link, and read the team-wide assessment.

## References

- [Standing exception: GitHub Pages security-header gap](../../../AgentTeam/docs/exceptions/github-pages-security-headers.md).
- [Decision Record 011: Standing GitHub Pages security-header exception](../../../AgentTeam/docs/decisions/011-standing-github-pages-security-header-exception.md).
- [Project Decision Record 003: GitHub Pages security headers](../decisions/003-github-pages-security-headers.md).
