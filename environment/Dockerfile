FROM mcr.microsoft.com/playwright:v1.49.0-jammy

WORKDIR /app

ENV CI=1 \
    DEBIAN_FRONTEND=noninteractive \
    npm_config_audit=false \
    npm_config_fund=false \
    npm_config_update_notifier=false

# Avoid creating reserved harness directories like /tests or /oracle.
RUN mkdir -p /app /logs/verifier /app/src /app/public

# Seed the task-provided company dataset + static assets into /app so agents can
# import the data without guessing values that the verifier asserts on.
COPY seed/src/companyData.js /app/src/companyData.js
COPY seed/public/atlas-logo.svg /app/public/atlas-logo.svg
COPY seed/public/verified-badge.svg /app/public/verified-badge.svg
