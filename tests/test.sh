#!/bin/bash
set -euo pipefail

TEST_DIR="${TEST_DIR:-/tests}"

# Check if we're in a valid working directory
if [ "$PWD" = "/" ]; then
  echo "Error: No working directory set. Please set a WORKDIR in your Dockerfile before running this script."
  exit 1
fi

if [ ! -f /app/package.json ]; then
  echo "Error: /app/package.json not found. The submitted app must define its own npm project."
  exit 1
fi

cd /app
npm install --no-fund --no-audit

cd "$TEST_DIR"
npm install --no-fund --no-audit
export DEBIAN_FRONTEND=noninteractive
npx playwright install-deps chromium
npx playwright install chromium

TEST_EXIT=0
set +e
npm run test
TEST_EXIT=$?
set -e

if [ "$TEST_EXIT" -eq 0 ]; then
  echo 1 > /logs/verifier/reward.txt
else
  echo 0 > /logs/verifier/reward.txt
fi

exit "$TEST_EXIT"
