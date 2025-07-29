FROM mcr.microsoft.com/devcontainers/typescript-node:dev-22

RUN corepack enable

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt update \
    && apt install -y gh

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

## Create SSH and GitHub CLI config directories
RUN mkdir -p /home/node/.ssh /home/node/.config/gh && \
  chown -R node:node /home/node/.ssh /home/node/.config/gh && \
  chmod 700 /home/node/.ssh

## Set up non-root user
USER node

## Install @anthropic-ai/claude-code globally
ARG CLAUDE_CODE_VERSION=latest
ENV SHELL="/bin/bash"
RUN pnpm setup && pnpm add -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}