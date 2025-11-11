#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/Omniversal-Media-LLC/TheSentinelFramework.git"
CLEANUP_BRANCH="sentinel-cleanup-structure"

echo "=== Sentinel Framework: init + targeted cleanup ==="

# 0. Ensure we're in the right place
if [ ! -f "index.html" ]; then
  echo "Error: index.html not found in current directory."
  echo "Run this from the root of your TheSentinelFramework project."
  exit 1
fi

# 1. Init git repo if missing, wire to origin
if [ ! -d ".git" ]; then
  echo "No .git found. Initializing repo and adding origin..."
  git init
  git branch -M main || true

  if ! git remote get-url origin >/dev/null 2>&1; then
    git remote add origin "$REPO_URL"
    echo "Remote 'origin' set to $REPO_URL"
  fi
else
  echo ".git already exists, using existing repo."
fi

# 2. Branch handling: if there are commits, work on a cleanup branch
if git rev-parse --verify HEAD >/dev/null 2>&1; then
  if git rev-parse --verify "$CLEANUP_BRANCH" >/dev/null 2>&1; then
    echo "Switching to existing branch '$CLEANUP_BRANCH'..."
    git checkout "$CLEANUP_BRANCH"
  else
    echo "Creating and switching to branch '$CLEANUP_BRANCH'..."
    git checkout -b "$CLEANUP_BRANCH"
  fi
else
  echo "No commits yet; staying on current branch (initial commit path)."
fi

echo "=== Step 3: Helper functions ==="

move_safe_no_overwrite() {
  local src="$1"
  local dest_dir="$2"
  [ ! -e "$src" ] && return 0

  mkdir -p "$dest_dir"
  local base
  base="$(basename "$src")"

  # If destination file already exists, skip to avoid clobbering
  if [ -e "$dest_dir/$base" ]; then
    echo "Skip (exists): $dest_dir/$base"
    return 0
  fi

  if git rev-parse --verify HEAD >/dev/null 2>&1; then
    git mv "$src" "$dest_dir/"
  else
    mv "$src" "$dest_dir/"
  fi
}

echo "=== Step 4: Create normalized top-level folders if missing ==="

mkdir -p evidence regulatory obsidian_whistle

# narratives dir is optional; you can manually move notebooks if you want
mkdir -p narratives

echo "=== Step 5: Flatten nested assets/evidence/evidence/ (pure duplication) ==="

if [ -d "assets/evidence/evidence" ]; then
  echo "Found assets/evidence/evidence/ → flattening into evidence/ (non-destructive)..."
  shopt -s nullglob
  for f in assets/evidence/evidence/*; do
    move_safe_no_overwrite "$f" "evidence"
  done
  shopt -u nullglob

  # Remove now-empty nested dir
  if [ -z "$(ls -A assets/evidence/evidence)" ]; then
    git rm -r assets/evidence/evidence || rmdir assets/evidence/evidence || true
  fi
fi

echo "=== Step 6: Consolidate key evidence artifacts ==="

# These appear in multiple places; prefer top-level evidence/ as canonical
EVIDENCE_FILES=(
  "binder_index.csv"
  "binder_index.csv.xlsx"
  "binder_narrative.md"
  "email_evidence_full.csv"
  "Email_Evidence_Index__preview_.csv"
  "email_evidence_tagged_full.csv"
  "Email_File_matches__preview_.csv"
  "email_timeline.csv"
  "email_to_file_crosswalk.csv"
  "ethics_manifest.csv"
  "Ethics_Packet_Manifest__preview_.csv"
  "evidence_exhibits_index.csv"
  "master_chronology.csv"
  "master_chronology.csv.xlsx"
  "top_exhibits_shortlist.csv"
  "top_exhibits_shortlist.md"
  "Updated_Unified_Reincarnated_Store_Catalog.csv"
)

for f in "${EVIDENCE_FILES[@]}"; do
  move_safe_no_overwrite "assets/evidence/$f" "evidence"
done

# Move WORKDOCS_DOSSIER_SYNC and WorkOrders if they live under assets/evidence
if [ -d "assets/evidence/WORKDOCS_DOSSIER_SYNC" ]; then
  move_safe_no_overwrite "assets/evidence/WORKDOCS_DOSSIER_SYNC" "evidence"
fi

if [ -d "assets/evidence/WorkOrders" ]; then
  move_safe_no_overwrite "assets/evidence/WorkOrders" "evidence"
fi

echo "=== Step 7: Regulatory docs to /regulatory ==="

REG_FILES=(
  "2024-Ohio-6176.pdf"
  "ohio-supreme-court-ensures-access-for-all-media.pdf"
  "OSHA_NOTICE_08-01-2025_ERWOMACK.pdf"
  "Whistleblower_Protection_Packet_Ethan_Womack.zip"
  "please_provide.pdf"
)

for f in "${REG_FILES[@]}"; do
  move_safe_no_overwrite "$f" "regulatory"
  move_safe_no_overwrite "assets/evidence/$f" "regulatory"
  move_safe_no_overwrite "assets/$f" "regulatory"
done

echo "=== Step 8: Obsidian / whistle artifacts to /obsidian_whistle ==="

# Everything obviously obsidian/failsafe/log related under assets/evidence/obsidian_whistle
if [ -d "assets/evidence/WORKDOCS_DOSSIER_SYNC/obsidian_whistle" ]; then
  for f in assets/evidence/WORKDOCS_DOSSIER_SYNC/obsidian_whistle/*; do
    move_safe_no_overwrite "$f" "obsidian_whistle"
  done
fi

if [ -d "assets/obsidian_whistle" ]; then
  for f in assets/obsidian_whistle/*; do
    move_safe_no_overwrite "$f" "obsidian_whistle"
  done
fi

# Top-level obsidian_whistle already exists; keep as canonical

echo "=== Step 9: Optional narratives folder population ==="

for f in \
  "My Notebook.onepkg" \
  "My Notebook @ amazon.onepkg" \
  "The Black Swan Accords.onepkg" \
  "The Sentinel Framework.onepkg" \
  "q-dev-chat-2025-11-10.md"
do
  move_safe_no_overwrite "$f" "narratives"
  move_safe_no_overwrite "assets/evidence/$f" "narratives"
done

echo "=== Step 10: Report remaining legacy-style nesting (manual review) ==="

echo
echo "Remaining references to 'assets/evidence/evidence' (if any):"
grep -R "assets/evidence/evidence" || true

echo
echo "Remaining references to old nested WORKDOCS/obsidian patterns (for sanity):"
grep -R "WORKDOCS_DOSSIER_SYNC/obsidian_whistle" || true

echo
echo "=== Cleanup complete (no HTML/nav changes made). Next steps: ==="
echo "1) Run: git status"
echo "2) Run: git diff"
echo "   - Confirm moves look correct."
echo "3) If happy: git commit -am 'Normalize Sentinel Framework repo structure'"
echo "4) If this is first push:"
echo "     git push -u origin $(git rev-parse --abbrev-ref HEAD)"
echo "   Otherwise, open a PR from '$CLEANUP_BRANCH'."

echo "================================================================"
echo "This did NOT touch your homepage layout or nav."
echo "We only de-duplicated nested evidence/regulatory/whistle artifacts."
echo "Wire your nav links to real files (e.g. evidence-index.html, precedent.html)"
echo "and you’re golden."
echo "================================================================"
