# Brief: 006-braille-reference-setup

## Summary

Adopt the existing `timdixon82/Braille-Reference` repository as a team project. Braille-Reference is a static site hosted on GitHub Pages: an `index.html` and a short `README.md`. Set up the project wiki, backfill the missing reviews, add the team's repository configuration, and verify the project meets the team's standards. Triaged as an adopt-and-backfill job, the same pattern as Periodic-Table, Clock-Practice, and LLBS.

- Status: archived
- Branch: chore/project-setup (merged as PR 1 on 2026-05-23)
- Priority: 8 (closed on completion)
- Blockers: None. Setup work shipped; the "Carol re-dispatch pending" note was stale at the time PR 1 merged and is now historical.

## Requirements

No formal requirements exist. Tad will reverse-engineer and record the requirements and acceptance criteria.

## Routing plan

1. Sonja clones the repository (completed) and creates the work folder.
2. Backfill reviews, in parallel, written into this work folder: Tad (business analysis), Jacob (architecture), Gerrie (security governance), Jed (code review and penetration test), Carol (baseline WCAG 2.2 AAA audit).
3. Sonja consolidates the findings, scaffolds the project wiki skeleton and the `chore/project-setup` branch, and surfaces any decisions to Tim.
4. Sean adds the team's repository configuration.
5. Carol verifies; Neil produces the release checklist.
6. Sonja runs the architecture-and-security conformance check and the merge gate, and presents to Tim. Sean opens the pull request; Sonja merges only on Tim's express approval.

## Approved GitHub actions

- [x] Create a branch
- [x] Commit to a branch
- [x] Push a branch other than the main branch
- [x] Open a pull request
- [ ] Comment on a pull request or an issue
- [ ] Create an issue

Also approved by Tim on 2026-05-21: clone the repository, read-only. Completed.

## Not pre-approved

- Merging to the main branch. This always needs Tim's express approval at the time.
- Publishing to a blog or a social media account.

## Never allowed

The hard deny-list from `CLAUDE.md`: force-push, branch deletion, history rewrite, repository deletion, repository visibility change, branch-protection edits, collaborator changes, release deletion, and disabling secret or code scanning.
