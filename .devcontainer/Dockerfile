FROM mcr.microsoft.com/devcontainers/typescript-node:dev-24

RUN corepack enable

# Install GitHub CLI and graphviz (graphviz is required by `pnpm madge:graph` to render the dependency graph image)
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt update \
    && apt install -y gh graphviz

# Setup Claude Code

## Ensure default node user has access to pnpm global directory
RUN mkdir -p /usr/local/share/pnpm-global && \
  chown -R node:node /usr/local/share/pnpm-global

ARG USERNAME=node
# AIDEV-NOTE: pnpm installs global bins into $PNPM_HOME/bin, so that — not
# $PNPM_HOME itself — is what belongs on PATH. Without it `pnpm add -g` aborts
# with "The configured global bin directory ... is not in PATH".
ENV PNPM_HOME="/usr/local/share/pnpm-global"
ENV PATH="$PNPM_HOME/bin:$PATH"

## Persist bash history
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  && mkdir /commandhistory \
  && touch /commandhistory/.bash_history \
  && chown -R $USERNAME /commandhistory

## Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

## Create config directory for Claude and set permissions
RUN mkdir -p /home/node/.claude && \
  chown -R node:node /home/node/.claude

## Create SSH and GitHub CLI config directories
RUN mkdir -p /home/node/.ssh /home/node/.config/gh && \
  chown -R node:node /home/node/.ssh /home/node/.config/gh && \
  chmod 700 /home/node/.ssh

## Set up non-root user
USER node

## Install @anthropic-ai/claude-code globally
ARG CLAUDE_CODE_VERSION=latest
ENV SHELL="/bin/bash"
# AIDEV-NOTE: No `pnpm setup` here — it writes PNPM_HOME into .bashrc, which this
# RUN layer never sources, so `add -g` would still abort on "global bin directory
# not in PATH". The ENV above covers both build and runtime.
RUN pnpm add -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}
