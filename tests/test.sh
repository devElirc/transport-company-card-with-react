#!/bin/bash
set -uo pipefail

TEST_DIR="${TEST_DIR:-/tests}"
REWARD_FILE="/logs/verifier/reward.txt"

mkdir -p /logs/verifier

# Verifier entrypoint (Harbor runs this script).
#
# Contract checks:
# 1) Agent-created npm app at /app (package.json + installable deps).
# 2) Seeded read-only data at /app/src/companyData.js (two named companies).
# 3) Vitest + Testing Library: /tests/unit/transport-company-card.spec.ts
#    — articles, logos/fallbacks, ratings, badges, trust score, metrics, a11y.
# 4) Playwright: /tests/e2e/transport-company-card.spec.ts
#    — CSS layout, ellipsis, animations, narrow viewport behavior.
#
# Orchestration: npm install in /app, then npm install && npm run test in /tests
# (see tests/package.json: test runs unit then e2e).

write_reward() {
  local code="$1"
  if [ "$code" -eq 0 ]; then
    echo 1 > "$REWARD_FILE"
  else
    echo 0 > "$REWARD_FILE"
  fi
}

# Harbor must always receive a reward file, including when tests fail.
EXIT_CODE=0

# Check if we're in a valid working directory
if [ "$PWD" = "/" ]; then
  echo "Error: No working directory set. Please set a WORKDIR in your Dockerfile before running this script." >&2
  write_reward 0
  exit 1
fi

# ---------------------------------------------------------------------------
# 1) Agent app contract (/app)
# ---------------------------------------------------------------------------
if [ ! -f /app/package.json ]; then
  echo "Error: /app/package.json not found. The submitted app must define its own npm project." >&2
  write_reward 0
  exit 1
fi

if [ ! -f /app/src/companyData.js ]; then
  echo "Error: /app/src/companyData.js not found. The task environment should seed this file." >&2
  write_reward 0
  exit 1
fi

cd /app
npm install --no-fund --no-audit || EXIT_CODE=$?

# ---------------------------------------------------------------------------
# 2) Verifier test harness (/tests)
# ---------------------------------------------------------------------------
if [ "$EXIT_CODE" -eq 0 ]; then
  cd "$TEST_DIR"
  npm install --no-fund --no-audit || EXIT_CODE=$?
fi

if [ "$EXIT_CODE" -eq 0 ]; then
  npm run test || EXIT_CODE=$?
fi

write_reward "$EXIT_CODE"
exit "$EXIT_CODE"
