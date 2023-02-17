# What is SPA Template

This project provides the basic dev configuration designated for developing a Single Page Application (SPA) app. It contains crucial tooling and settings allowing for a quick start with suitable developer experience (DX).

# Main features

## Basic version - `basic`

- Dev environment based on [ViteJS](https://vitejs.dev/) toolkit.
- Testing environment based on [Vitest](https://vitest.dev/) and [Storybook](https://storybook.js.org/).
- Static code analysis: eslint, prettier, husky.
- TypeScript support.
- [Devcontainer](https://code.visualstudio.com/docs/devcontainers/containers) config for VS Code.

## Extended version - `core`

- Everything that included in the `basic` version.
- Access to simple, modular and accessible components based on [Chakra UI](https://chakra-ui.com/).
- Data fetching and external state synchronization based on [React Query](https://tanstack.com/query/v4/).
- Routing based on [React Router 6](https://reactrouter.com/en/main/start/overview). [todo]
- Date formatting based on [DayJS](https://day.js.org/).
- State management with [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction). [todo]
- A demo app. [todo]

# Guideline

## How to use

_You may simply download a ZIP Directory and start with a clean git repository using a command_ `git init`...

... or clone this repo through git CLI.

```
git clone -b basic --depth 1 --single-branch https://github.com/bartstc/spa-vite-template.git [project_name]
```

```
git clone -b core --depth 1 --single-branch https://github.com/bartstc/spa-vite-template.git [project_name]
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

## Basic commands

| Komenda                | Opis                                                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yarn dev`             | Runs dev server with the HMR locally on port `5173`                                                                                                        |
| `yarn build`           | Builds optimized app package                                                                                                                               |
| `yarn test`            | Runs unit tests                                                                                                                                            |
| `yarn storybook`       | Runs a Storybook locally on port `6006`                                                                                                                    |
| `yarn test-storybook`  | Runs integration tests (requires a running Storybook on port `6006` - more info [here](https://storybook.js.org/blog/interaction-testing-with-storybook/)) |
| `yarn build-storybook` | Builds static app with [a Storybook's content](https://storybook.js.org/docs/react/sharing/publish-storybook)                                              |

# Contributing

It is publicly open for any contribution. Bugfixes, new features, and extra modules are welcome.

- To contribute to code: Fork the repo, push your changes to your fork, and submit a pull request.
- To report a bug: If something does not work, please report it using [GitHub Issues](https://github.com/bartstc/spa-vite-template/issues).
