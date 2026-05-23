# UEB Braille Reference

An interactive reference for Unified English Braille (UEB) Grade 1 and Grade 2. The page lists 175 entries covering the alphabet, numbers, punctuation, indicators, contractions, and shortforms. A filter panel lets you narrow by grade and category; two search fields let you search by print text or by dot-cell pattern.

## What it is

Braille Reference is a single-page static site built with HTML, CSS, and JavaScript. It runs entirely in the browser with no server-side code. The site is intended for braille learners and teachers who want a quick, keyboard-accessible reference for UEB symbols.

The current data set covers the most common UEB Grade 2 contractions and shortforms. Full UEB coverage is planned as a future milestone.

## How to run it locally

No build step is needed. Serve the repository root with Python's built-in HTTP server:

```
python3 -m http.server --directory "$(pwd)" 8080
```

Then open `http://localhost:8080` in your browser.

## File structure

```
index.html                  The page — structure, styles, data, and behaviour in one file
VERSION                     The current semantic version (updated by release-please on each release)
README.md                   This file
docs/                       Project wiki: decisions, accessibility notes, glossary, and release log
  decisions/                Architecture Decision Records (ADRs) for the project
  exceptions/               Security and accessibility exceptions, each signed off by Tim
  accessibility.md          Baseline WCAG 2.2 AAA audit findings and outstanding tests
  glossary.md               UEB domain terms defined
  release-process.md        Project-specific release notes
  index.md                  Catalogue of every wiki page
  log.md                    Chronological operations log (append-only)
.github/workflows/          Continuous integration: lint, accessibility, security, CodeQL, and release
package.json                Development tooling only — linters pinned to explicit versions
package-lock.json           Lockfile committed alongside package.json
count.js                    Self-hosted GoatCounter analytics script (see Privacy below)
todo.md                     Outstanding and future work
```

## Live site

The site is published on GitHub Pages at [UEB Braille Reference on GitHub Pages](https://timdixon82.github.io/Braille-Reference/).

## Privacy

Page views are counted using GoatCounter, served from a self-hosted copy of `count.js` in this repository. GoatCounter records the page path, referrer, a coarse browser and screen-size profile, and an approximation of the visitor's country derived briefly from the Internet Protocol address. It does not collect user content, does not set persistent identifying cookies, and does not require a consent banner under UK General Data Protection Regulation (UK GDPR). A Data Processing Agreement is in place between Tim Dixon and GoatCounter. The tracker code used is the team account at `timdixon82.goatcounter.com`.

## Version

Current version: 0.1.0. Version history is in `CHANGELOG.md`, maintained automatically by release-please.
