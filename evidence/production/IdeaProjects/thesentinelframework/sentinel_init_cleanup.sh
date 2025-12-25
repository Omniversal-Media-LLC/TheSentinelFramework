Awesome, you’re right at the “make it real” step.

Here’s what we’ll do:

1. Wire your local `~/WebstormProjects/TheSentinelFramework` folder to the GitHub repo.
2. Use an updated script that:

   * Initializes git if needed
   * Connects to `origin`
   * Cleans structure / flattens duplicates safely
   * Leaves everything staged-ready for you to review + push.

I’ll give you a single script you can drop in and run.

---

## 1. Connect local folder to GitHub

From your server:

```bash
cd ~/WebstormProjects/TheSentinelFramework
```

If you have **not** already run `git init` in there, don’t do anything else yet — the script below will handle it.

If you *have* already initialized git and pointed it somewhere weird, tell me and we’ll adjust. Otherwise we assume “fresh local folder that should map to `TheSentinelFramework.git`”.

---

## 2. Updated script: init + cleanup + structure

Save this as `sentinel_init_cleanup.sh` in `~/WebstormProjects/TheSentinelFramework`, then run it.

```bash
#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/Omniversal-Media-LLC/TheSentinelFramework.git"
CLEANUP_BRANCH="sentinel-cleanup-structure"

echo "=== Sentinel Framework: init + cleanup starting ==="

# 0. If not a git repo yet, initialize and connect to GitHub
if [ ! -d .git ]; then
  echo "No .git found. Initializing new git repo and connecting to origin..."
  git init

  # Set main as default branch
  git branch -M main || true

  # Add remote origin if not present
  git remote add origin "$REPO_URL"

  echo "Git initialized and remote 'origin' set to:"
  echo "  $REPO_URL"
  echo "Working on uncommitted files in this directory."
fi

# 1. Safety check: avoid trampling unreviewed work on existing repos
if [ -n "$(git status --porcelain)" ]; then
  echo "Note: there are uncommitted changes (this is expected if this is your first setup)."
  echo "Continuing using current working tree..."
else
  echo "Working tree is clean."
fi

# 2. Create / switch to cleanup branch if repo already has commits
if git rev-parse --verify HEAD >/dev/null 2>&1; then
  # Repo has at least one commit
  if git rev-parse --verify "$CLEANUP_BRANCH" >/dev/null 2>&1; then
    echo "Branch '$CLEANUP_BRANCH' exists. Checking it out..."
    git checkout "$CLEANUP_BRANCH"
  else
    echo "Creating branch '$CLEANUP_BRANCH' from current HEAD..."
    git checkout -b "$CLEANUP_BRANCH"
  fi
else
  echo "No commits yet. Staying on current branch (likely 'main') for initial structure."
fi

echo "=== Step 3: Ensure canonical site files at repo root (non-destructive) ==="

# Expected top-level pages (only moved if they exist somewhere obvious)
ROOT_PAGES=(
  "index.html"
  "about.html"
  "timeline.html"
  "gallery.html"
  "manifesto.html"
  "contact.html"
  "login.html"
  "autonomous-expansion.html"
  "ethics-packet.html"
  "evidence-index.html"
  "policy-request.html"
  "precedent.html"
  "regulatory-dossier.html"
  "shutdown-timing.html"
)

# Helper for safe move via git mv or plain mv
move_safe() {
  local src="$1"
  local dest="$2"

  [ ! -e "$src" ] && return 0

  mkdir -p "$(dirname "$dest")"

  if git rev-parse --verify HEAD >/dev/null 2>&1; then
    git mv "$src" "$dest"
  else
    mv "$src" "$dest"
  fi
}

#
```
