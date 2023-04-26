# What is SPA Vite Template

This project provides a basic dev setup intended for `Single Page Application` (SPA) development. It contains already configured tools and libraries providing a quick and seamless start, making the Developer Experience (DX) and scalability of your project easily manageable. It also shows a practical application of selected tools and practices in a form of a demo app.

# Template versions

Bearing in mind flexibility and openness to various tools and preferences, this template allows you to adjust your workflow to your needs, assuring best practices and following opinionated frontend/React trends at the same time.

Thus, the template provides two different versions, differing in complexity and spectrum of solved problems.

## Basic version - `basic`

The most basic config of the dev environment. It provides seamless DX and assures a legible and consistent codebase.

### When to use

This version is free of any libraries. If the `core` version doesn't match your preferences and expectations, the `basic` version will be perfect as a basis for your personalized project setup.

### Key features

- Dev environment based on [ViteJS 4](https://vitejs.dev/) toolkit.
- Testing environment based on [Vitest](https://vitest.dev/) and [Storybook 7](https://storybook.js.org/).
- Static code analysis: eslint, prettier, husky.
- TypeScript support.
- [Devcontainer](https://code.visualstudio.com/docs/devcontainers/containers) config for VS Code.

## Extended version - `core`

The extension of the `basic` version. It contains already configured tools and libraries that aim to solve the most basic and typical problems existing in a modern frontend application (SPA).

### When to use

If configured tools and overall setup meet your requirements, you should definitely choose this version as the starting point for your project.

### Key features

- Everything that's included in the `basic` version.
- Simple, modular, and accessible components based on [Chakra UI](https://chakra-ui.com/).
- Data fetching and external state synchronization based on [React Query](https://tanstack.com/query/v4/).
- Routing based on [React Router 6](https://reactrouter.com/en/main/start/overview).
- ~~Date formatting based on [DayJS](https://day.js.org/).~~
- Formatting tools for numbers, monetary values, and dates (easily extendable with any date library like [DayJS](https://day.js.org/)).
- State management with [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction).
- API mocking with [MSW](https://mswjs.io/).
- A demo app with authentication presenting project structure, good practices, and used tooling in action (with a little help of [Fake Store API](https://fakestoreapi.com/docs)).

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

## Starting the dev environment

It's recommended to run the dev server and tests in a docker container. Containerized environment assures compatibility and cohesion regarding launching and developing your project. Because of that, you don't need to worry about unexpected errors or undesired mismatches of locally installed dependencies e. g. Node or Yarn.

If you are using [VS Code](https://code.visualstudio.com/) as your IDE, I personally recommend using already configured in this template [devcontainer env](https://code.visualstudio.com/docs/devcontainers/containers).

Learn more about using this template in practice below.

## Basic commands

| Command                | Description                                                                                                                                                |
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
