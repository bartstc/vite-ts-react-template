# What is SPA Template

This project provides the basic dev configuration designated for developing a Single Page Application (SPA) app. It contains crucial tooling and settings allowing for a quick start with suitable developer experience (DX).

# Main features

- Dev environment based on [ViteJS](https://vitejs.dev/) toolkit.
- Testing environment based on [Vitest](https://vitest.dev/) and [Storybook](https://storybook.js.org/)
- Static code analysis: eslint, prettier, husky.
- TypeScript support.
- [Devcontainer](https://code.visualstudio.com/docs/devcontainers/containers) config for VS Code.

# How to use

_You may simply download a ZIP Directory and start with a clean git repository using a command_ `git init`...

... or clone this repo through git CLI.

```
git clone -b main --depth 1 --single-branch https://github.com/bartstc/spa-vite-template.git [project_name]
```

Link cloned repo with your own remote repository.

```
git remote set-url origin git@github.com:username/project.git
```

Create and push your own branch designated for development.

```
git checkout -b [branch_name]
```

```
git push --set-upstream origin [branch_name]
```

Set your newly created and pushed branch as default. You may do this in `Settings` -> `Branches` -> `Default Branch`.
