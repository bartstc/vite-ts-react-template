import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import js from "@eslint/js";
import { configs } from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";
import importPlugin from "eslint-plugin-import";
import storybookPlugin from "eslint-plugin-storybook";
import vitest from "eslint-plugin-vitest";
import reactRefresh from "eslint-plugin-react-refresh";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";

// used by import/no-restricted-paths
// AIDEV-NOTE: import/no-restricted-paths uses path.relative() for matching — glob wildcards
// in target/from are NOT supported. All zone lists must be generated per-feature.
const featureSlices = ["carts", "marketing", "products"];
const allFeatureSlices = [
  "auth",
  "authv2",
  "carts",
  "demo",
  "marketing",
  "products",
];

// AIDEV-NOTE: `auth` and `authv2` are cross-slice primitives (identity, permissions,
// auth state). Any feature may import from them. See docs/architecture.md
const featureToFeatureZones = featureSlices.map((feature) => ({
  target: `./src/features/${feature}`,
  from: "./src/features",
  except: [`./${feature}`, "./auth", "./authv2"],
  message: "Avoid importing from other features.",
}));

const featureLayerZones = allFeatureSlices.flatMap((feature) => [
  // application/ ← components/ (forbidden)
  {
    target: `./src/features/${feature}/application`,
    from: `./src/features/${feature}/components`,
    message: "application/ must not depend on components/.",
  },
  // providers/ ← application/ or components/ (forbidden)
  {
    target: `./src/features/${feature}/providers`,
    from: `./src/features/${feature}/application`,
    message: "providers/ must not depend on application/.",
  },
  {
    target: `./src/features/${feature}/providers`,
    from: `./src/features/${feature}/components`,
    message: "providers/ must not depend on components/.",
  },
  // models/ ← any feature layer (forbidden)
  {
    target: `./src/features/${feature}/models`,
    from: `./src/features/${feature}/application`,
    message: "models/ must not depend on application/.",
  },
  {
    target: `./src/features/${feature}/models`,
    from: `./src/features/${feature}/components`,
    message: "models/ must not depend on components/.",
  },
  {
    target: `./src/features/${feature}/models`,
    from: `./src/features/${feature}/providers`,
    message: "models/ must not depend on providers/.",
  },
]);

// Prevents lib/api/ from leaking beyond providers/ and models/.
const apiLayerIsolationZones = allFeatureSlices.flatMap((feature) => [
  {
    target: `./src/features/${feature}/components`,
    from: "./src/lib/api",
    message:
      "src/lib/api/ must not be imported in components/. Use providers/ for data queries and mutations and models/ for types.",
  },
  {
    target: `./src/features/${feature}/application`,
    from: "./src/lib/api",
    message:
      "src/lib/api/ must not be imported in application/. Use providers/ for data queries and mutations and models/ for types.",
  },
]);

const noAnonymousUseEffectRule = [
  "error",
  {
    selector:
      "CallExpression[callee.name='useEffect'] > ArrowFunctionExpression",
    message:
      "Name your useEffect callback: useEffect(function syncSomething() { ... })",
  },
];

export default defineConfig(
  {
    ignores: [
      "**/dist",
      "**/storybook-static/**",
      "**/reports/**",
      "**/*.typegen.ts",
      "**/public/mockServiceWorker.js",
      "server/**",
      "**/*.mdx",
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  configs["recommended-latest"],
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  prettierPluginRecommended,
  reactYouMightNotNeedAnEffect.configs.recommended,
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
    plugins: { import: importPlugin, "react-refresh": reactRefresh },
    settings: {
      "import/resolver": { typescript: { alwaysTryTypes: true } },
      "import/ignore": [
        "node_modules",
        ".json$",
        ".(css|scss)$",
        ".(jpg|png|gif|svg|html|txt|md|woff|woff2|ttf|eot)$",
      ],
      "import/external-module-folders": ["node_modules", ".pnpm-store"],
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      "import/no-dynamic-require": "error",
      "import/no-useless-path-segments": "error",
      "import/no-extraneous-dependencies": "error",
      "import/newline-after-import": "error",
      "import/no-commonjs": "error",
      "import/no-amd": "error",
      "import/order": [
        "error",
        {
          alphabetize: { caseInsensitive: true, order: "asc" },
          groups: ["builtin", "external", "internal", "parent", "sibling"],
          "newlines-between": "always",
        },
      ],
      "react-refresh/only-export-components": "error",
      "no-unused-vars": "off",
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
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/unbound-method": "off",
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
          patterns: ["react-router"],
          paths: [
            {
              importNames: ["default"],
              message: `Instead of default import, please use import { method } from "ramda" instead.`,
              name: "ramda",
            },
          ],
        },
      ],
      "no-restricted-syntax": noAnonymousUseEffectRule,
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
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-spread": "off",
    },
  },
  {
    files: ["./src/features/**"],
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            ...featureToFeatureZones,
            ...featureLayerZones,
            ...apiLayerIsolationZones,
          ],
        },
      ],
    },
  },
  {
    files: ["./src/pages/**"],
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/pages",
              from: "./src/lib/api",
              message:
                "src/lib/api/ must not be imported in pages/. Use features/*/providers/ for data and features/*/models/ for types.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["./src/lib/**"],
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/lib",
              from: "./src/features",
              message: "Lib should not depend on features.",
            },
          ],
        },
      ],
    },
  }
);
