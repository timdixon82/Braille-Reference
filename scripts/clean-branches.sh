#!/usr/bin/env bash
# clean-branches.sh — remove merged local and remote branches.
#
# Usage:
#   bash scripts/clean-branches.sh [--dry-run] [--yes] [--remote-only] [--local-only]
#
# Flags:
#   --dry-run      Print what would be deleted; do not delete anything.
#   --yes          Skip the confirmation prompt and delete immediately.
#   --remote-only  Delete remote branches only; leave local branches alone.
#   --local-only   Delete local branches only; leave remote branches alone.
#
# Protected branches are never deleted, whatever flags you pass:
#   main, master, develop, release/*, hotfix/*
#
# What it does:
#   1. Fetches and prunes stale remote-tracking refs.
#   2. Finds local branches fully merged into main.
#   3. Finds remote branches fully merged into main.
#   4. Prints both lists.
#   5. On confirmation (or with --yes), deletes local then remote branches.
#
# Requirements: git, bash 3.2 or later. No other dependencies.

set -euo pipefail

# ── Configuration ──────────────────────────────────────────────────────────────

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "Error: not inside a git repository." >&2
  exit 1
}

BASE_BRANCH="main"
PROTECTED_PATTERNS=("main" "master" "develop" "release/*" "hotfix/*")

# ── Flag parsing ───────────────────────────────────────────────────────────────

DRY_RUN=false
AUTO_YES=false
REMOTE_ONLY=false
LOCAL_ONLY=false

for arg in "$@"; do
  case "$arg" in
    --dry-run)     DRY_RUN=true ;;
    --yes)         AUTO_YES=true ;;
    --remote-only) REMOTE_ONLY=true ;;
    --local-only)  LOCAL_ONLY=true ;;
    --help|-h)
      sed -n '2,30p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Unknown flag: $arg  (use --help for usage)" >&2
      exit 1
      ;;
  esac
done

if $REMOTE_ONLY && $LOCAL_ONLY; then
  echo "Error: --remote-only and --local-only cannot be used together." >&2
  exit 1
fi

# ── Helpers ────────────────────────────────────────────────────────────────────

is_protected() {
  local branch="$1"
  for pattern in "${PROTECTED_PATTERNS[@]}"; do
    # shellcheck disable=SC2254
    case "$branch" in
      $pattern) return 0 ;;
    esac
  done
  return 1
}

# ── Step 1: fetch and prune ────────────────────────────────────────────────────

echo "Fetching and pruning remote-tracking refs…"
git -C "$REPO_ROOT" fetch --prune origin
echo ""

# ── Step 2: find merged local branches ────────────────────────────────────────

local_to_delete=()

if ! $REMOTE_ONLY; then
  while IFS= read -r branch; do
    branch="${branch#  }"   # strip leading spaces
    branch="${branch#* }"   # handle "* current" marker — take the name part
    branch="${branch/\* /}" # strip the active branch asterisk if still present
    branch="${branch#\* }"
    # git branch output: active branch starts with "* ", others with "  "
    # We already excluded HEAD via grep, so just strip whitespace.
    branch="$(echo "$branch" | sed 's/^[* ]*//')"
    [[ -z "$branch" ]] && continue
    is_protected "$branch" && continue
    local_to_delete+=("$branch")
  done < <(git -C "$REPO_ROOT" branch --merged "$BASE_BRANCH" | grep -v "^\* " | grep -v "^  $BASE_BRANCH$" || true)
fi

# ── Step 3: find merged remote branches ───────────────────────────────────────

remote_to_delete=()

if ! $LOCAL_ONLY; then
  while IFS= read -r ref; do
    # ref looks like "  origin/chore/some-branch"
    branch="${ref#  origin/}"
    branch="$(echo "$branch" | sed 's/^[* ]*//')"
    [[ -z "$branch" ]] && continue
    is_protected "$branch" && continue
    remote_to_delete+=("$branch")
  done < <(git -C "$REPO_ROOT" branch -r --merged "$BASE_BRANCH" | grep "origin/" | grep -v "origin/$BASE_BRANCH$" || true)
fi

# ── Step 4: report ────────────────────────────────────────────────────────────

if [[ ${#local_to_delete[@]} -eq 0 && ${#remote_to_delete[@]} -eq 0 ]]; then
  echo "Nothing to clean up. All non-protected branches are either unmerged or already gone."
  exit 0
fi

if $DRY_RUN; then
  echo "Dry run — nothing will be deleted."
  echo ""
fi

if [[ ${#local_to_delete[@]} -gt 0 ]]; then
  echo "Local branches merged into $BASE_BRANCH:"
  for b in "${local_to_delete[@]}"; do
    echo "  $b"
  done
  echo ""
fi

if [[ ${#remote_to_delete[@]} -gt 0 ]]; then
  echo "Remote branches (origin) merged into $BASE_BRANCH:"
  for b in "${remote_to_delete[@]}"; do
    echo "  $b"
  done
  echo ""
fi

$DRY_RUN && exit 0

# ── Step 5: confirm ───────────────────────────────────────────────────────────

if ! $AUTO_YES; then
  read -r -p "Delete the branches listed above? [y/N] " reply
  case "$reply" in
    y|Y|yes|YES) ;;
    *)
      echo "Cancelled. Nothing deleted."
      exit 0
      ;;
  esac
  echo ""
fi

# ── Step 6: delete local branches ─────────────────────────────────────────────

if [[ ${#local_to_delete[@]} -gt 0 ]]; then
  echo "Deleting local branches…"
  for b in "${local_to_delete[@]}"; do
    if git -C "$REPO_ROOT" branch -d "$b" 2>/dev/null; then
      echo "  deleted local:  $b"
    else
      echo "  skipped local:  $b (not fully merged — use 'git branch -D' to force)"
    fi
  done
  echo ""
fi

# ── Step 7: delete remote branches ────────────────────────────────────────────

if [[ ${#remote_to_delete[@]} -gt 0 ]]; then
  echo "Deleting remote branches…"
  for b in "${remote_to_delete[@]}"; do
    if git -C "$REPO_ROOT" push origin --delete "$b" 2>/dev/null; then
      echo "  deleted remote: $b"
    else
      echo "  skipped remote: $b (already gone or permission denied)"
    fi
  done
  echo ""
fi

echo "Done."
