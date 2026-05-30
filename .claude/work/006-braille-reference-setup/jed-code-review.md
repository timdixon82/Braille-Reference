# Code Review and Penetration Test: Braille-Reference index.html

Date: 2026-05-21
Reviewer: Jed
Scope: `/Users/timdixon/Library/Mobile Documents/com~apple~CloudDocs/Github/Braille-Reference/index.html`
Methodology: manual code review, OWASP Top 10 mapping. No destructive or modifying actions were taken. The repository was read only.

## Summary of findings

| Severity | Count | Finding |
|---|---|---|
| High | 1 | No Content Security Policy header |
| Low | 1 | Missing security response headers (X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, Permissions-Policy, Referrer-Policy) |
| Low | 1 | Inline script block prevents strong CSP |
| Info | 4 | No unsafe DOM injection, no inline event handlers, no eval, no external resources, no external links |

Overall risk: Medium. The site is a read-only static reference page with no user accounts, no form submission to a server, and no external resource loading. The attack surface is narrow. The main gap is the absence of a Content Security Policy, which is a team-standard requirement on every site.

## Detailed findings

### Finding 1: Missing Content Security Policy

Severity: High
OWASP category: A05 Security Misconfiguration

The page loads no Content Security Policy (CSP) header or meta equivalent. The team's coding standard (`docs/coding-standards.md`) requires every site to send a CSP as one of its mandatory security response headers, with the example starting point `default-src 'self'; object-src 'none'; base-uri 'self'`.

Without a CSP, a browser will execute any script that ends up in the page, whether by a future mistake in the code, a compromised dependency, or a speculative injection path. For this particular page, the inline `<script>` block at lines 301 to 755 is the only script on the page. All other content is static HTML and CSS. However, the team standard is unconditional, and a future change that adds a third-party widget or a CDN script would be unprotected.

How to reproduce: load the page in a browser, open the developer tools Network panel, and inspect the response headers. No `Content-Security-Policy` header is present. You can also confirm there is no `<meta http-equiv="Content-Security-Policy">` tag in the `<head>` of the file.

Recommended fix: add the following meta tag in the `<head>` element as a minimum, and also configure the GitHub Pages deployment to send the header at the HTTP layer if the Pages configuration allows it.

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'unsafe-inline'; object-src 'none'; base-uri 'self'">
```

Note that the inline `<script>` block requires `script-src 'unsafe-inline'` when expressed as a meta tag, because meta-tag CSPs cannot use nonces. The better long-term fix is to move the JavaScript into an external file and use `script-src 'self'`, removing the need for `'unsafe-inline'`. Either option is an improvement on the current state of no policy at all. See Finding 3 for the external-file recommendation.

### Finding 2: Missing security response headers

Severity: Low
OWASP category: A05 Security Misconfiguration

The team standard requires five additional response headers beyond the CSP. GitHub Pages does not currently allow custom HTTP response headers on free-plan repositories; however, the requirement should be documented as a known gap and a formal exception recorded in the project wiki.

The missing headers are:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains` — GitHub Pages serves over HTTPS by default, but the HTTP Strict Transport Security header is not set, meaning a first-visit downgrade attack remains theoretically possible.
- `X-Content-Type-Options: nosniff` — prevents MIME-type sniffing.
- `X-Frame-Options: DENY` — prevents the page being embedded in a frame. A CSP `frame-ancestors 'none'` directive covers this as well.
- `Referrer-Policy: strict-origin-when-cross-origin` — limits referrer data sent to other origins.
- `Permissions-Policy: geolocation=(), camera=(), microphone=()` — explicitly disables browser features the page does not use.

How to reproduce: load the page, open the developer tools Network panel, and inspect the response headers. None of these headers are present.

Recommended fix: if GitHub Pages does not support custom headers, record the limitation as an exception in the project wiki at `exceptions/security-headers.md`. If the site is later moved to a host that supports custom headers, or if a Cloudflare proxy is placed in front of the GitHub Pages origin, add all five headers at that point.

### Finding 3: Inline script block prevents strong Content Security Policy

Severity: Low
OWASP category: A03 Injection (cross-site scripting mitigation)

The entire application JavaScript — approximately 450 lines — lives in a single inline `<script>` block at lines 301 to 755 of `index.html`. There is no external JavaScript file.

This is not itself a cross-site scripting (XSS) vulnerability. The script block is static, written by the author, and contains no dynamic content injected into it. However, inline scripts require `'unsafe-inline'` in any CSP, which weakens the protection the CSP can offer. Any future developer who carelessly injects a user-controlled value into an inline script block would be unprotected by the policy.

How to reproduce: view source and observe that the `<script>` tag at line 301 contains all application code inline rather than referencing a `.js` file.

Recommended fix: move the script to an external file, for example `js/braille-reference.js`, and load it with `<script src="js/braille-reference.js">`. This allows the CSP to be tightened to `script-src 'self'`, removing `'unsafe-inline'` entirely.

### Finding 4: No unsafe innerHTML or DOM injection found

Severity: Info
OWASP category: A03 Injection (cross-site scripting)

A full search of the script was conducted for the unsafe DOM manipulation patterns: `innerHTML`, `outerHTML`, `insertAdjacentHTML`, and `eval`. None were found. The rendering code at lines 611 to 648 builds table rows entirely through `document.createElement`, `textContent` assignment, and `setAttribute`. This is the correct pattern and eliminates DOM-based XSS from this code path. The `textContent` property encodes any HTML characters in the data, so even if a data entry contained angle brackets they would be rendered as text, not as markup.

No action required.

### Finding 5: No inline event handlers found

Severity: Info
OWASP category: A03 Injection (cross-site scripting)

The HTML markup contains no `onclick`, `onchange`, `onkeyup`, or similar inline event handler attributes. All event listeners are attached in JavaScript at lines 724 to 751, using `addEventListener`. This is the correct pattern.

No action required.

### Finding 6: No external resources — no Subresource Integrity gap today

Severity: Info (forward-looking gap noted)
OWASP category: A08 Software and Data Integrity Failures

The page loads no fonts, no analytics, no Content Delivery Network (CDN)-hosted CSS or JavaScript frameworks, and no third-party images. All resources are inline or self-hosted. There is therefore no Subresource Integrity (SRI) requirement today.

If any third-party resource is added in the future, the team standard requires an `integrity` attribute and a matching `crossorigin="anonymous"` attribute on the `<link>` or `<script>` tag. This should be noted in the project wiki so future developers are aware.

No action required now.

### Finding 7: No external links

Severity: Info
OWASP category: A05 Security Misconfiguration (tab-napping)

The page contains no `<a>` tags at all. There are no external links and therefore no tab-napping risk from omitting `rel="noopener noreferrer"`. If links are added in the future, any that open in a new tab (`target="_blank"`) must carry `rel="noopener noreferrer"`.

No action required now.

### Finding 8: Search input validation is safe

Severity: Info
OWASP category: A03 Injection

The two search inputs — text search (line 252) and dot-pattern search (line 261) — feed into client-side filter logic only. No value is ever sent to a server, stored, or inserted into the Document Object Model (DOM) as HTML. The text filter at lines 689 to 692 lowercases the input and uses `String.prototype.includes` for matching against static data strings. The dot-pattern parser at lines 563 to 579 extracts only characters matching the digits 1 to 6, discarding all other characters. Neither path presents an injection risk in the current design.

No action required.

## Items that need Tim's decision

None. The findings are all technical gaps the team can address without a policy decision from Tim. The most material one (CSP and external script file) has a concrete fix that Sean can implement. The header gap is a platform limitation that needs an exception record rather than a Tim decision.

## Actions for Sonja to route

1. Route to Sean: move the inline script to an external `.js` file, and add a CSP meta tag (`default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'`). This addresses both Finding 1 and Finding 3 together.
2. Route to Tad or Sonja: create `exceptions/security-headers.md` in the project wiki to record the GitHub Pages header limitation, covering the five headers in Finding 2.
3. Note for the global wiki (Sonja's call): the pattern of recording a platform's header limitations as a project exception, rather than failing the review, is worth adding to `docs/patterns/` so future static-site projects handle it the same way.

## Usage

Tool calls made: Read (4 files), Bash (1 directory listing), Write (1 report file). No external network calls. No modifications to the repository.
