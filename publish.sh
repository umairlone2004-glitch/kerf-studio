#!/usr/bin/env bash
# Publish this site to GitHub Pages in one go.
#
#   ./publish.sh                  # uses umairlone2004-glitch/kerf-studio
#   ./publish.sh myuser my-repo   # or your own owner/repo
#
# Needs: git, and either the GitHub CLI (gh, logged in) or a personal access
# token with repo scope. Run it from inside this folder.

set -euo pipefail

OWNER="${1:-umairlone2004-glitch}"
REPO="${2:-kerf-studio}"
cd "$(dirname "$0")"

echo "→ preparing local repository"
if [ ! -d .git ]; then
  git init -b main >/dev/null
fi
git add -A
git commit -m "Kerf — product design studio site" >/dev/null 2>&1 || echo "  (nothing new to commit)"

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  echo "→ creating $OWNER/$REPO and pushing"
  if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
    git remote remove origin >/dev/null 2>&1 || true
    git remote add origin "https://github.com/$OWNER/$REPO.git"
    git push -u origin main
  else
    gh repo create "$OWNER/$REPO" --public --source=. --remote=origin --push
  fi

  echo "→ switching on GitHub Pages"
  gh api -X POST "repos/$OWNER/$REPO/pages" \
    -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
    && echo "  Pages enabled" \
    || echo "  Pages may already be on — check Settings → Pages"

  echo
  echo "Done. The site goes live in about a minute:"
  echo "  https://$OWNER.github.io/$REPO/"
else
  echo "→ GitHub CLI not found or not logged in. Push manually:"
  echo
  echo "  git remote add origin https://github.com/$OWNER/$REPO.git"
  echo "  git push -u origin main"
  echo
  echo "Then enable Pages: repo → Settings → Pages →"
  echo "Deploy from a branch → main → / (root) → Save."
  echo "Live at https://$OWNER.github.io/$REPO/"
fi
