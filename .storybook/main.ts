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
      plugins: [...(config.plugins ?? []), tsconfigPaths.default()],
    };
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
