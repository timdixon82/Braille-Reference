# Security Governance Review: Braille-Reference

Reviewer: Gerrie
Date: 2026-05-21
Scope: `timdixon82/Braille-Reference` — static site hosted on GitHub Pages. One file (`index.html`) plus a short `README.md`. Read-only review; no repository changes made.

---

## 1. Review summary

Braille-Reference is a pure static site. It processes no personal data, makes no outbound network requests, and has no back-end. This removes the majority of risk categories entirely. The main findings are all in the security-header posture, which GitHub Pages does not let owners control directly, and which will need a mitigation decision from Tim.

Severity classification used below: High means blocking before release. Medium means fix before release or document as an exception. Low means fix as a chore, or document as an exception with a stated rationale.

---

## 2. UK GDPR assessment

### 2.1 Personal data collected

None. The site has no forms, no user accounts, no cookies, no analytics tag, no tracking pixels, no contact mechanism, and no comment system. The JavaScript in `index.html` is entirely client-side; it filters and renders a hard-coded data array. It never sends any value to a server.

### 2.2 Third-party requests

None. Every resource loaded by the page is inline or served from the same origin. There are no external font calls (the CSS specifies only system fonts: Georgia, "Times New Roman", Courier New, Lucida Console), no external script tags, no external stylesheet links, no image resources, and no analytics or monitoring tags.

### 2.3 GitHub Pages hosting

GitHub Pages is operated by GitHub (a Microsoft company) and stores access logs for their own operational purposes. Those logs may contain Internet Protocol (IP) addresses, which are personal data under UK GDPR. That processing is GitHub's, governed by GitHub's own privacy notice and their data-processing terms, not Tim's. No action is needed from this project.

### 2.4 Conclusion

There is no personal data processing by Tim or this project. UK GDPR imposes no obligations on this site. No lawful basis, consent mechanism, retention schedule, or data subject rights process is required.

---

## 3. OWASP Top 10 mapping

The OWASP Top 10 is mapped below to this site's threat surface. Because there is no server, no database, no authentication, and no user input that reaches a server, the majority of categories are not applicable (N/A) at this time. Each N/A is explained so it can be reassessed if the site's scope changes.

### 3.1 A01 — Broken access control

N/A. The site is a public read-only page. There is no authenticated content, no restricted area, no role, and no authorisation decision anywhere in the code. Required defence: none.

### 3.2 A02 — Cryptographic failures

Partially applicable. HTTPS must be enforced; see section 4.2.

All data on the page is hard-coded braille reference data with no personal or sensitive value, so encryption at rest is not relevant.

Required defence: GitHub Pages enforces HTTPS automatically for `github.io` domains. If a custom domain is ever added, HTTPS must be configured and enforced, and a Strict-Transport-Security header must be set.

### 3.3 A03 — Injection

Partially applicable in a narrow, client-side sense.

The text-search and dot-search inputs in `index.html` are used to filter the hard-coded data array. The filtering code reads user input, converts it to a lower-case string, and uses `String.includes()` and integer parsing against fixed data. Results are written back into the Document Object Model (DOM) using the `.textContent` property (not the innerHTML property), which means user input is never interpreted as markup or code. There is no server query, no dynamic code execution, no innerHTML write, no legacy document-write calls, and no dynamic script loading.

Cross-site scripting (XSS) risk is very low. The only values written to the DOM from the data set are values from the hard-coded `data` array, not from user input, and those are set via `.textContent`. The user-provided search term is never written back into the DOM directly.

Required defence: the current `.textContent` practice must be maintained. Any future developer must not switch to innerHTML or innerHTML-adjacent methods for rendering data or search terms without a full XSS review.

### 3.4 A04 — Insecure design

Low. The design is appropriately minimal: no server, no database, no accounts, and no dynamic data. The only foreseeable design risk is a future scope change, such as adding a contact form or analytics, which would require a fresh review.

Required defence: document that the no-server, no-analytics, no-external-request posture is a deliberate security and privacy choice, so it is not changed accidentally.

### 3.5 A05 — Security misconfiguration

Medium. Security response headers are absent. See section 4.1. GitHub Pages does not allow per-repository HTTP header configuration, so this requires a mitigation path.

### 3.6 A06 — Vulnerable and outdated components

Low. There are no third-party dependencies. The code is vanilla HTML, CSS, and JavaScript with no npm packages, no CDN-loaded frameworks, and no libraries. There is nothing to update or track.

Required defence: none at present. If a dependency is ever added, it must be pinned and tracked.

### 3.7 A07 — Identification and authentication failures

N/A. There is no authentication. The site is fully public with no login, no session, and no token. Required defence: none.

### 3.8 A08 — Software and data integrity failures

Low. There are no external scripts or resources, so subresource integrity (SRI) is not applicable. The repository is public on GitHub. Commits should be protected by branch-protection rules, which is a configuration matter for the project-setup phase.

Required defence: when branch protection is configured in the project-setup phase, require pull request reviews before merging to the main branch.

### 3.9 A09 — Security logging and monitoring failures

N/A in the traditional sense. There is no application server to instrument. GitHub provides audit logs for the repository, and GitHub Pages provides access logs at the platform level. No application-level logging is possible or needed.

### 3.10 A10 — Server-side request forgery (SSRF)

N/A. There is no server. The browser makes no outbound requests beyond loading the page itself from GitHub Pages. Required defence: none.

---

## 4. Security header posture

### 4.1 Current state

GitHub Pages does not allow repository owners to set custom HTTP response headers for standard Pages deployments. The platform serves its own default headers. The following headers are absent or inadequate for a standard GitHub Pages deployment:

- `Content-Security-Policy` (CSP): absent by default. Without it, there is no restriction on inline script execution or resource loading.
- `X-Content-Type-Options: nosniff`: absent by default.
- `X-Frame-Options` or a `frame-ancestors` CSP directive: absent by default, leaving the page frameable by third-party sites.
- `Referrer-Policy`: absent by default.
- `Permissions-Policy`: absent by default.
- `Strict-Transport-Security`: GitHub Pages sets this for `*.github.io` domains but not automatically for custom domains.

### 4.2 Severity and rationale

The absent headers are rated Medium overall for this site.

The site has no authenticated content and no sensitive data, so the practical impact of missing headers is lower than on a site with accounts or personal data. However, the coding standards require the security header set on every site the team ships (see `docs/coding-standards.md`, section "Security response headers"). Shipping without them means the site does not meet the team's own policy.

Specific risks on this site:

- No CSP means inline scripts are unrestricted. The site uses an inline script block. An injection of malicious content into the repository itself would execute without a CSP to restrict it. This is a supply-chain risk rather than a user-input risk.
- No `X-Frame-Options` means the page can be embedded in a frame on a third-party site. For a reference table with no account or sensitive action, clickjacking is a low practical risk, but policy still requires the header.
- The practical risk profile is low; the policy gap is Medium.

### 4.3 Mitigation options

There are three approaches, and Tim needs to choose one (see section 6, question 1).

Option A: accept the header limitation as a security exception, recorded in the project wiki's `exceptions/` folder, with the rationale that the site has no personal data, no authentication, and no user-generated content, and the residual risk is low.

Option B: adopt a GitHub Actions workflow that deploys the site using the modern Pages deployment actions (`actions/upload-pages-artifact` and `actions/deploy-pages`), and test whether a `_headers` convention is supported for header injection. This needs verification in the project-setup phase.

Option C: migrate hosting to Cloudflare Pages, which natively supports a `_headers` file for custom response headers, while keeping the repository on GitHub.

Gerrie's recommendation is option A for now. The residual risk is genuinely low for this site. If the site grows to include a contact form or analytics, the headers question must be revisited before those features go live.

### 4.4 Inline script and Content Security Policy

The entire JavaScript of this site is a single inline script block at the bottom of `index.html`. A strict CSP with `default-src 'self'` and no `unsafe-inline` would block it unless one of these approaches is taken:

- Extract the script to an external file (`braille-table.js`) served from the same origin. This allows a clean `default-src 'self'` CSP and also aligns with the static front-end stack standard that requires structure, presentation, and behaviour to be kept in separate files.
- Use a hash-based CSP that allows the specific inline script. This works but is fragile: any edit to the script changes the hash and breaks the policy.
- Use a nonce-based CSP, which requires server-side rendering to inject a fresh nonce into each response. Not practical for a static file.

The recommended approach is extraction to an external file. This is a minor refactor that unblocks a clean CSP and improves code organisation.

---

## 5. Secrets handling and access control

### 5.1 Secrets in the repository

No secrets were found in `index.html` or `README.md`. There are no API keys, tokens, passwords, or credentials anywhere in the codebase. This is expected and correct for a static site with no back-end.

### 5.2 Repository access control

The repository `timdixon82/Braille-Reference` is public. This is correct and intentional for a GitHub Pages project (see `docs/stacks/static-front-end.md`). There are no private files in the repository.

Branch protection has not been verified in this read-only review; that is a configuration task for the project-setup phase (step 4 in the routing plan). At minimum, the main branch should require at least one pull request review before merging, and the deny-list actions (force-push, history rewrite, branch deletion) should be blocked by branch-protection rules.

### 5.3 Logging hygiene

No application-level logging exists, which is correct for a static site. GitHub Pages access logs are controlled entirely by GitHub. No personal data is logged by this project.

---

## 6. Questions for Tim (batched)

These questions cannot be resolved without Tim's decision. Sonja should relay them to Tim as a batch.

Question 1: Security headers on GitHub Pages.

The team's coding standards require a set of security response headers on every site shipped. Standard GitHub Pages deployments do not allow custom headers. Options:

A. Record the absent headers as a security exception in the project wiki, with the rationale that the site has no personal data, no authentication, and no sensitive user data, and the residual risk is low. Gerrie recommends this option.

B. Move to the modern GitHub Actions Pages deployment method and test whether a `_headers` convention is supported for header injection.

C. Migrate hosting to Cloudflare Pages, which natively supports a `_headers` file, keeping the repository on GitHub.

Question 2: Inline script extraction.

The JavaScript is currently a single inline script block in `index.html`. Extracting it to a separate file (`braille-table.js`) would enable a clean Content Security Policy if headers become available, and would align with the static front-end stack standard that requires structure, presentation, and behaviour to be kept in separate files.

A. Yes, extract the inline script to a separate file as part of project setup. Gerrie recommends this option.

B. No, leave it inline and accept it as a style exception.

---

## 7. Exception to record

If Tim chooses option A for question 1, the following exception record must be created in the project wiki at `docs/exceptions/001-security-headers.md` once the project wiki is scaffolded. It requires Tim's approval and a date.

Title: Absent security response headers on GitHub Pages.

Reason: GitHub Pages standard deployment does not allow custom HTTP response headers. The site has no personal data, no authentication, no external requests, and no user-generated content.

Mitigations in place: all DOM writes use the `.textContent` property (innerHTML is never used), no external resources are loaded, no user data is processed or stored, and HTTPS is enforced by the platform.

Approval needed: Tim Dixon, to be recorded with date when given.

---

## 8. Summary of findings

| Finding | OWASP category | Severity | Status |
|---|---|---|---|
| Security response headers absent | A05 Security misconfiguration | Medium | Decision needed from Tim (question 1) |
| Inline script blocks clean CSP | A05 Security misconfiguration | Low | Decision needed from Tim (question 2) |
| Branch protection not yet configured | A08 Software and data integrity | Low | Covered in project-setup phase |
| UK GDPR: no personal data processed | UK GDPR | Pass | No action required |
| Third-party requests: none | UK GDPR / A02 | Pass | No action required |
| Secrets in code: none | Secrets handling | Pass | No action required |
| DOM writes use `.textContent` correctly | A03 Injection | Pass | Must be maintained in future development |

No High findings. The site's minimal attack surface is a genuine security strength. The two open decisions (questions 1 and 2) are policy alignment questions rather than active vulnerabilities.
