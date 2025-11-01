import path from "node:path";
import { fileURLToPath } from "node:url";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { mergeConfig } from "vite";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

import viteConfig from "./vite.config";

export default defineConfig((env) =>
  mergeConfig(
    viteConfig(env),
    defineConfig({
      test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./test-setup.ts",
        globalSetup: "./test-globals.ts",
        coverage: {
          provider: "istanbul",
          reporter: [
            "text",
            "html",
            "json",
            ["lcov", { projectRoot: "./src" }],
          ],
          include: ["src/**/*.{ts,tsx}"],
          exclude: [
            "**/test-lib/*",
            "**/public/*",
            "src/**/*.test.@(ts|tsx)",
            "src/**/*.stories.@(ts|tsx)",
            ...coverageConfigDefaults.exclude,
          ],
          reportsDirectory: "./coverage",
        },
        onConsoleLog: (log) => {
          if (log.includes("i18next:")) {
            return false;
          }
          return true;
        },
        projects: [
          {
            extends: true,
            test: {
              name: "unit",
              include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
            },
          },
          {
            extends: true,
            plugins: [
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              storybookTest({
                configDir: path.join(dirname, ".storybook"),
                storybookScript: "pnpm storybook --ci",
              }),
            ],
            test: {
              name: "storybook",
              include: ["src/**/*.stories.@(ts|tsx)"],
              browser: {
                enabled: true,
                provider: playwright(),
                headless: true,
                instances: [{ browser: "chromium" }],
              },
              setupFiles: [".storybook/vitest.setup.ts"],
            },
          },
        ],
      },
    })
  )
);
