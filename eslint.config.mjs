import tseslint from "typescript-eslint";
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";
// import importPlugin from "eslint-plugin-import";
import storybookPlugin from "eslint-plugin-storybook";
import vitest from "eslint-plugin-vitest";

export default tseslint.config(
  { ignores: ["**/dist", "**/*.typegen.ts"] },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  reactHooks.configs["recommended-latest"],
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  prettierPluginRecommended,
  //   importPlugin.flatConfigs.recommended,
  ...storybookPlugin.configs["flat/recommended"],
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        __DEV__: false,
        __PROD__: false,
        __APP_VERSION__: false,
        __APP_URL__: false,
      },
      ecmaVersion: 2022,
      sourceType: "module",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    // settings: {
    //   "import/resolver": {
    //     typescript: true,
    //   },
    //   "import/ignore": [
    //     "node_modules",
    //     ".json$",
    //     ".(css|scss)$",
    //     ".(jpg|png|gif|svg|html|txt|md|woff|woff2|ttf|eot)$",
    //   ],
    //   "import/external-module-folders": ["node_modules", ".pnpm-store"],
    // },
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      "no-console": [
        "error",
        {
          allow: ["error"],
        },
      ],
      "react/jsx-curly-brace-presence": [
        "error",
        {
          props: "never",
          children: "always",
          propElementValues: "always",
        },
      ],
      "no-unused-vars": "off",
      "no-void": [
        "error",
        {
          allowAsStatement: true,
        },
      ],
      "testing-library/await-async-events": ["off"],
      "react/display-name": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/only-throw-error": "error",
      "@typescript-eslint/prefer-promise-reject-errors": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-base-to-string": "error",
      "@typescript-eslint/no-floating-promises": [
        "error",
        {
          ignoreVoid: true,
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
        },
      ],
      "@typescript-eslint/no-unsafe-enum-comparison": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "shared/*/*",
            "*/**/shared/*",
            "utils/*/*",
            "*/**/utils/*",
            "modules/*/*/*",
            "*/**/modules/*/*",
            "lodash/**",
            "lodash/fp/**",
          ],
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
        },
      ],
      //   "import/no-dynamic-require": "error",
      //   "import/no-useless-path-segments": "error",
      //   "import/no-extraneous-dependencies": "error",
      //   "import/newline-after-import": "error",
      //   "import/no-commonjs": "error",
      //   "import/no-amd": "error",
    },
  },
  {
    files: ["**/*.test.ts?(x)"],
    plugins: { vitest },
    rules: vitest.configs.recommended.rules,
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
  {
    files: ["**/*.?(m|c)js", "**/vite.config.ts", "**/vitest.config.ts"],
    rules: {
      strict: "off",
      "import/no-commonjs": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
    },
  }
);
