import type { StorybookConfig } from "@storybook/react-vite";
import * as tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  viteFinal(config) {
    return {
      ...config,
      // Ensure that the vite-tsconfig-paths plugin is included in the Storybook config as well.
      // This plugin is necessary for resolving TypeScript path mappings, which allows the
      // coverage addon to instrument the code correctly.
      plugins: [...(config.plugins ?? []), tsconfigPaths.default()],
    };
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
