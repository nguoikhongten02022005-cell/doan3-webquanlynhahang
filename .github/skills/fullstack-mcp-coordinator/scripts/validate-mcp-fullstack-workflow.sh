#!/usr/bin/env bash
set -e

echo "== MCP fullstack workflow validation checklist =="

echo "[1] Check project structure"
find . -maxdepth 3 \( -type d -name "src" -o -type d -name "backend" -o -type d -name "nest-api" -o -type d -name ".github" \) | sed 's#^\./##' || true

echo "[2] Check key workspace artifacts"
find . -maxdepth 2 \( -name "console-errors.txt" -o -name "*-snapshot.md" -o -name "package.json" -o -name "README.md" \) | sed 's#^\./##' || true

echo "[3] Check existing skill files"
find .github/skills -maxdepth 2 -name "SKILL.md" | sed 's#^\./##' || true

echo "[4] MCP-oriented reminder"
echo "- Verify local code patterns before editing"
echo "- Verify external library docs when adding unfamiliar APIs"
echo "- Verify backend/frontend contracts"
echo "- Verify mapper compatibility and naming alignment"
echo "- Verify auth, permissions, and protected flows"
echo "- Verify console, network, loading, empty, success, and error states"
echo "- Verify browser behavior for UI-affecting changes"
echo "- Verify final summary distinguishes verified facts from assumptions"
