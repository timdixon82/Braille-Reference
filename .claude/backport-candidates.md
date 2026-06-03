# Backport candidates for BR

- [ ] Fix accessibility workflow: replace browser-driver-manager with Chrome for Testing CDN ChromeDriver matching
  source: .github/workflows/accessibility.yml
  priority: high
  note: browser-driver-manager installs to an unresolvable path on ubuntu-latest runners; CDN download pattern (from BR PR #4) is proven green. Fix templates/.github/workflows/accessibility.yml in the master.

