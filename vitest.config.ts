import path from "node:path";
import { fileURLToPath } from "node:url";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { mergeConfig } from "vite";
import {
  coverageConfigDefaults,
  defineConfig,
  type TestProjectInlineConfiguration,
} from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

import viteConfig from "./vite.config";

// AIDEV-NOTE: visual regression project. Registered only when VITEST_VISUAL=1 (set by the
// `test:visual*` scripts), so `pnpm test` keeps running unit + storybook only.
// Baselines are valid only from the pinned Playwright container (docs/visual-testing.md §4),
// so `--update` is refused anywhere else.
const isVisualRun = process.env.VITEST_VISUAL === "1";
const isUpdate = process.argv.some((arg) => arg === "-u" || arg === "--update");

if (isVisualRun && isUpdate && process.env.VISUAL_CONTAINER !== "1") {
  throw new Error(
    "Visual baselines are generated only in the pinned container: run `pnpm test:visual:update`."
  );
}

export default defineConfig((env) =>
  mergeConfig(
    viteConfig(env),
    defineConfig({
      test: {
        globals: true,
        environment: "jsdom",
        globalSetup: "./test-globals.ts",
        attachmentsDir: ".vitest/attachments",
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
              setupFiles: ["./test-setup.ts", "./test-setup-unit.ts"],
            },
          },
          {
            extends: true,
            plugins: [
              storybookTest({
                configDir: path.join(dirname, ".storybook"),
                storybookScript: "pnpm storybook --ci",
              }),
            ],
            test: {
              name: "storybook",
              browser: {
                enabled: true,
                provider: playwright(),
                headless: true,
                instances: [{ browser: "chromium" }],
              },
              setupFiles: [".storybook/vitest.setup.ts"],
            },
          },
          ...(isVisualRun ? [visualProject] : []),
        ],
      },
    })
  )
);

const visualProject: TestProjectInlineConfiguration = {
  extends: true,
  plugins: [
    storybookTest({
      configDir: path.join(dirname, ".storybook"),
      tags: { include: ["visual"], exclude: [], skip: [] },
    }),
  ],
  test: {
    name: "storybook-visual",
    // One file at a time: parallel browsers crash on low-memory machines and fail as false diffs.
    fileParallelism: false,
    setupFiles: [".storybook/vitest.setup.ts", ".storybook/visual.setup.ts"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        contextOptions: {
          locale: "en-GB",
          timezoneId: "Europe/London",
          colorScheme: "light",
          reducedMotion: "reduce",
          deviceScaleFactor: 1,
        },
      }),
      instances: [
        {
          browser: "chromium",
          viewport: { width: 1280, height: 800 },
        },
      ],
      expect: {
        toMatchScreenshot: {
          comparatorName: "pixelmatch",
          comparatorOptions: {
            threshold: 0.2,
            allowedMismatchedPixelRatio: 0.001,
          },
          // No platform in the name: valid only because every comparison runs in the container.
          resolveScreenshotPath: ({
            root,
            testFileDirectory,
            screenshotDirectory,
            testFileName,
            arg,
            browserName,
            ext,
          }) =>
            path.join(
              root,
              testFileDirectory,
              screenshotDirectory,
              testFileName,
              `${arg}-${browserName}${ext}`
            ),
        },
      },
    },
  },
};
