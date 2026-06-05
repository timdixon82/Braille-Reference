# Architecture review: 008-playwright-tests

## Recommendation

Put Playwright in a root `package.json`. Do not add it to `.github/accessibility-tools/package.json`. The root manifest is already the intended home for the project's developer and test tooling, so this choice matches the architecture that is already in place.

## Rationale

The two manifests have different jobs, and the split is deliberate. The `.github/accessibility-tools/package.json` manifest is a narrow, self-contained bundle for one CI job: it is marked `private`, installed with `npm ci` from inside its own folder, and exists so Dependabot can track the three audit tools (axe-core, Pa11y, wait-on) in isolation. Adding Playwright to it would mix a heavy browser-driving test framework into a manifest whose whole purpose is to stay small and audit-focused, and it would force the accessibility job to install Playwright it never uses. The root manifest, by contrast, is where the project's general tooling already lives: the `lint.yml` workflow runs `npm ci` and `npm run lint` at the repository root, the `deploy.yml` rsync step already excludes a root `package.json`, `package-lock.json`, `eslint.config.js`, and `.stylelintrc.json` from the deployed site, and a root `node_modules/` with stylelint is present. Playwright is project-wide test tooling, so the root manifest is the correct and consistent place for it.

## A correction to the brief

The brief states "the project has no root `package.json` today." That is not accurate. The repository is already set up to use a root manifest: `.stylelintrc.json` exists, stylelint is installed under the root `node_modules/`, `lint.yml` calls `npm ci` and `npm run lint` from the root, and `deploy.yml` excludes the root `package.json` and its lockfile from the published site. Sean should treat this as adding Playwright to the existing root tooling surface, not as introducing the first root manifest. If the root `package.json` is not yet committed, this work should commit it (with stylelint, the lint scripts, and Playwright together), so the root tooling is finally tracked rather than implied. Sean should confirm the current state with `git status` before editing, so the lint setup and the Playwright setup end up in one coherent manifest.

## Static server approach

Confirmed, with one amendment. Serving `index.html` from a local static server on localhost is correct. Testing against the live GitHub Pages URL would couple the tests to deploy timing and network state, which is wrong for a pull-request gate.

The amendment is about which server. The brief says the accessibility workflow "already uses `npx serve` or a similar static server via `wait-on`." It does not. The real pattern in `accessibility.yml` is `python3 -m http.server 8080 &` followed by `wait-on http://localhost:8080`. Sean should not copy a `serve` package that is not there.

For Playwright specifically, the cleanest approach is to let Playwright own the server through the `webServer` option in `playwright.config.js`. Set `webServer.command` to `python3 -m http.server 8080`, set `webServer.url` to `http://localhost:8080`, set `baseURL` to the same, and set `reuseExistingServer: !process.env.CI`. Playwright then starts the server, waits for the URL, runs the tests, and shuts the server down on its own. This removes the need for a separate background-server step and a separate `wait-on` step in the workflow, and it keeps local runs and CI runs identical. If Sean prefers to mirror the accessibility workflow exactly with a manual background server plus `wait-on`, that is acceptable, but the `webServer` option is the better fit for Playwright and is the recommended path.

## Other concerns before Sean starts

### Browser binary caching in CI

The scaffolded workflow runs `npx playwright install --with-deps`, which downloads browser binaries on every run. This is slow and wasteful. Add a cache step keyed on the Playwright version so the binaries are restored between runs. Cache the path `~/.cache/ms-playwright` with a key derived from the resolved Playwright version (for example, a hash of `package-lock.json`, or the version string itself). On a cache hit, run `npx playwright install-deps` only (system libraries are not cached); on a miss, run the full `--with-deps` install. This is a workflow refinement, not a blocker.

### Pin the browser project to one engine

The brief lists seven functional flows on a static reference page. Running them across Chromium, Firefox, and WebKit triples the CI time for little extra signal on a page with no engine-specific behaviour. Configure a single project (Chromium) in `playwright.config.js` for the CI gate. Cross-engine coverage can be a later task if a real need appears; it is not in scope here.

### Node version

`lint.yml` and `accessibility.yml` both pin `node-version: lts/*`. The Playwright workflow should use the same `lts/*` so all three CI jobs share one Node line. Do not introduce a different version. There is no `.nvmrc` or `.node-version` file in the repo, so `lts/*` in the workflow is the single source of truth; keep it that way.

### Config file location and language

Place `playwright.config.js` at the repository root, next to `package.json`, which is where Playwright expects it by default. Use plain JavaScript (`playwright.config.js`), not TypeScript, unless Sean is also adding a TypeScript toolchain, which is out of scope. The existing project tooling is plain JavaScript and CSS, so a `.js` config keeps the stack consistent and avoids pulling in a compiler the project does not otherwise use.

### One lockfile, one cache key

Adding Playwright to the root manifest means a root `package-lock.json` is created or updated and must be committed. The accessibility job already pins its cache to `.github/accessibility-tools/package-lock.json`. The lint and Playwright jobs should cache against the root lockfile (the default for `cache: npm`). Keep the two lockfiles separate and never run a root `npm ci` from inside the accessibility-tools folder or the reverse.

### Dependabot coverage

If a `dependabot.yml` exists it should gain an npm entry for the repository root so Playwright gets the same automated version bumps the accessibility tools already receive. I did not find a `dependabot.yml` in `.github/`, so this may already be handled at the org or template level, or it may be a gap. Flagging it as a follow-up rather than a blocker for this work.

## Go / No-go

Go, with the static-server amendment (use `python3 -m http.server`, ideally via Playwright's `webServer` option) and the root-manifest correction (the root `package.json` is the existing tooling home, not a new surface).

<!-- TASK -->
- [ ] Add Playwright browser-binary caching (`~/.cache/ms-playwright`) to the Playwright CI workflow, keyed on the Playwright version `priority:low` `owner:sean` `from:jacob-008-playwright-tests`
- [ ] Confirm Dependabot covers the root `package.json` npm ecosystem; add a `.github/dependabot.yml` npm entry for the repo root if missing `priority:low` `owner:sean` `from:jacob-008-playwright-tests`
<!-- /TASK -->
