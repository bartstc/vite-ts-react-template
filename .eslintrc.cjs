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
      "warn",
      {
        patterns: [
          "shared/*/*",
          "*/**/shared/*",
          "utils/*/*",
          "*/**/utils/*",
          "modules/*/*/*",
          "*/**/modules/*/*",
          "dayjs",
          "react-router-dom",
        ],
      },
    ],
  },
};
