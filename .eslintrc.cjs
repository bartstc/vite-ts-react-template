module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["react-app", "plugin:storybook/recommended"],
  overrides: [
    {
      files: ["**/*.stories.*"],
      rules: {
        "import/no-anonymous-default-export": "off",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-explicit-any": [
      "warn",
      {
        fixToUnknown: true,
        ignoreRestArgs: true,
      },
    ],
    "react/jsx-key": [
      "warn",
      {
        checkFragmentShorthand: true,
      },
    ],
    "no-console": [
      "warn",
      {
        allow: ["warn", "error", "info"],
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            message: `Please use import { method } from "lodash-es" instead.`,
            name: "lodash",
          },
          {
            importNames: ["chain"],
            message:
              "Avoid using chain since it is non tree-shakable. Try out flow instead.",
            name: "lodash-es",
          },
          {
            importNames: ["default"],
            message: `Instead of default import, please use import { method } from "lodash-es" instead.`,
            name: "lodash-es",
          },
          {
            message:
              "Avoid using chain since it is non tree-shakable. Try out flow instead.",
            name: "lodash-es/chain",
          },
        ],
        patterns: [
          "shared/*/*",
          "*/**/shared/*",
          "utils/*/*",
          "*/**/utils/*",
          "modules/*/*/*",
          "*/**/modules/*/*",
          "lodash/**",
          "lodash/fp/**",
          "react-router-dom",
          "dayjs",
        ],
      },
    ],
  },
};
