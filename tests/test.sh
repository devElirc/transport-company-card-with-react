#!/bin/bash
set -uo pipefail

SCRIPT_PATH="${BASH_SOURCE[0]:-$0}"
TEST_DIR="${TEST_DIR:-$(cd "$(dirname "$SCRIPT_PATH")" && pwd)}"

export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/ms-playwright}"

mkdir -p /logs/verifier

EXIT_CODE=0

if [ ! -f /app/package.json ]; then
  echo "Error: /app/package.json not found. The submitted app must define its own npm project." >&2
  echo 0 > /logs/verifier/reward.txt
  exit 1
fi

if [ ! -f /app/src/companyData.js ]; then
  echo "Error: /app/src/companyData.js not found. The task environment should seed this file." >&2
  echo 0 > /logs/verifier/reward.txt
  exit 1
fi

cd /app
npm install --no-fund --no-audit || EXIT_CODE=$?

if [ "$EXIT_CODE" -eq 0 ]; then
  npm run build || EXIT_CODE=$?
fi

if [ "$EXIT_CODE" -eq 0 ]; then
  cd "$TEST_DIR"
  npm install --no-fund --no-audit || EXIT_CODE=$?
fi

if [ "$EXIT_CODE" -eq 0 ]; then
  npm run test || EXIT_CODE=$?
fi

if [ "$EXIT_CODE" -ne 0 ]; then
  echo "VERIFIER_FAILED exit=${EXIT_CODE} TEST_DIR=${TEST_DIR} PWD=$(pwd)" >&2
  ls -la "${TEST_DIR}" >&2 || true
  ls -la /app >&2 || true
fi

if [ "$EXIT_CODE" -eq 0 ]; then
  echo 1 > /logs/verifier/reward.txt
else
  echo 0 > /logs/verifier/reward.txt
fi

exit "$EXIT_CODE"