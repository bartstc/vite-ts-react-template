FROM mcr.microsoft.com/devcontainers/typescript-node:dev-22

RUN corepack enable

# Setup Claude Code

## Ensure default node user has access to pnpm global directory
RUN mkdir -p /usr/local/share/pnpm-global && \
  chown -R node:node /usr/local/share/pnpm-global

ARG USERNAME=node
ENV PNPM_HOME="/usr/local/share/pnpm-global"
ENV PATH="$PNPM_HOME:$PATH"

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

## Set up non-root user
USER node

## Install @anthropic-ai/claude-code globally
ARG CLAUDE_CODE_VERSION=latest
ENV SHELL="/bin/bash"
RUN pnpm setup && pnpm add -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}