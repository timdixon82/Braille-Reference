# Privacy: Braille-Reference

## Analytics

Braille-Reference uses GoatCounter to count page views. GoatCounter is the team's standard analytics tool for projects that ship a publicly accessible page.

### Implementation

The GoatCounter script (`count.js`) is self-hosted in this repository at the project root. The script is fetched from `https://gc.zgo.at/count.js` and committed locally so that it is covered by the project's own Content Security Policy and is not a third-party `<script>` load from an external origin. The script should be reviewed against the upstream once a quarter and updated if it has changed.

The tracker URL for this project is the team account at `timdixon82.goatcounter.com`. The tracker URL is stored as the `data-goatcounter` attribute on the analytics `<script>` tag in `index.html`.

### What is collected

GoatCounter records:

- The page path (which page was visited).
- The HTTP referrer (which site the visitor came from, if any).
- A coarse browser and screen-size profile.
- An approximation of the visitor's country, derived briefly from the Internet Protocol (IP) address. The IP address itself is not stored.

### What is not collected

GoatCounter does not collect:

- User content of any kind (no braille data entered, no search terms).
- Form submissions.
- Any identifying cookie or persistent tracking identifier.

### Legal basis

No consent banner is required under UK General Data Protection Regulation (UK GDPR) for aggregate, anonymised analytics that do not set persistent identifying cookies. GoatCounter does not set such cookies.

A Data Processing Agreement (DPA) is in place between Tim Dixon and GoatCounter. The DPA covers the `timdixon82.goatcounter.com` account used by this project.

### Content Security Policy

The `Content-Security-Policy` meta tag in `index.html` includes `connect-src 'self' https://data.goatcounter.com` to permit the outbound beacon that count.js sends when recording a page view. No other third-party network call is made by the page.
