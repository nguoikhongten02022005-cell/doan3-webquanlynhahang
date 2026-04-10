#!/usr/bin/env bash
set -e

echo "== Fullstack feature validation checklist =="

echo "[1] Check project structure"
find . -maxdepth 2 \( -type d -name "src" -o -type d -name "frontend" -o -type d -name "backend" \) | sed 's#^\./##' || true

echo "[2] Check package files"
find . -maxdepth 2 \( -name "package.json" -o -name "pnpm-lock.yaml" -o -name "yarn.lock" -o -name "package-lock.json" \) | sed 's#^\./##' || true

echo "[3] Check test files"
find . -maxdepth 3 \( -type d -name "test" -o -type d -name "tests" -o -type d -name "__tests__" -o -name "*.test.*" -o -name "*.spec.*" \) | sed 's#^\./##' || true

echo "[4] Reminder"
echo "- Verify affected layers"
echo "- Verify backend/frontend contracts"
echo "- Verify mapping layer compatibility"
echo "- Verify auth and permission behavior"
echo "- Verify loading, empty, success, and error states"
echo "- Verify QA checklist"s