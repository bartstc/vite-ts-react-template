import { mergeConfig } from "vite";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default defineConfig((env) =>
  mergeConfig(
    viteConfig(env),
    defineConfig({
      test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./test-setup.ts",
        coverage: {
          provider: "istanbul",
          reporter: [
            "text",
            "html",
            "json",
            ["lcov", { projectRoot: "./src" }],
          ],
          include: ["src/**/*.ts", "src/**/*.tsx"],
          exclude: [
            "**/test-lib/*",
            "**/*{.,-}stories.?(c|m)[jt]s?(x)",
            ...coverageConfigDefaults.exclude,
          ],
          reportsDirectory: "./coverage",
        },
      },
    })
  )
);
