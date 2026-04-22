FROM node:20.20.0-bookworm

WORKDIR /app

ENV CI=1 \
    DEBIAN_FRONTEND=noninteractive \
    npm_config_audit=false \
    npm_config_fund=false \
    npm_config_update_notifier=false

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        bash \
        ca-certificates \
        git \
        openssh-client \
        python3 \
        make \
        g++ \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app /tests /logs/verifier

CMD ["sleep", "infinity"]
